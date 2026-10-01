import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import DodoPayments from 'dodopayments';

function getDodoClient() {
  const apiKey = process.env.DODO_PAYMENTS_API_KEY;
  if (!apiKey) {
    throw new Error('DODO_PAYMENTS_API_KEY is not configured in .env.local');
  }
  const DodoClass = (DodoPayments as any).default || DodoPayments;
  return new DodoClass({
    bearerToken: apiKey,
    environment: process.env.DODO_PAYMENTS_ENVIRONMENT || 'test_mode',
    webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_KEY || undefined,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, fullName, whatsappNumber, email, billingAddress, couponCode } = body;

    if (!productId || !fullName || !whatsappNumber || !email || !billingAddress) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    const supabase = getServiceSupabase();

    // 1. Fetch product from Supabase
    const { data: product, error: prodErr } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (prodErr || !product) {
      return NextResponse.json({ message: 'Product not found in database' }, { status: 404 });
    }

    let finalAmount = Number(product.discounted_price);
    let couponUsed: { code: string; discount: number } | null = null;

    // 2. Validate & apply coupon if provided
    if (couponCode) {
      const { data: coupon } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('is_active', true)
        .single();

      if (coupon) {
        const discountAmount = (finalAmount * Number(coupon.discount_percentage)) / 100;
        finalAmount = Math.max(1, finalAmount - discountAmount);
        couponUsed = {
          code: coupon.code,
          discount: Number(coupon.discount_percentage),
        };

        // Increment usage count
        await supabase
          .from('coupons')
          .update({ current_usage_count: (coupon.current_usage_count || 0) + 1 })
          .eq('id', coupon.id);
      } else {
        return NextResponse.json({ message: 'Invalid or expired coupon code' }, { status: 400 });
      }
    }

    const dodo = getDodoClient();

    // 3. Resolve or create Dodo product
    let dodoProductId = process.env.DODO_PRODUCT_ID || product.dodo_product_id;
    if (!dodoProductId) {
      try {
        const dodoProduct = await dodo.products.create({
          name: product.title,
          description: product.description ? product.description.substring(0, 500) : 'Digital Product',
          tax_category: 'digital_products',
          price: {
            type: 'one_time_price',
            currency: 'INR',
            price: 100, // 100 paise (₹1) minimum
            pay_what_you_want: true,
            suggested_price: Math.round(finalAmount * 100),
          },
        });
        dodoProductId = dodoProduct.product_id;
        await supabase.from('products').update({ dodo_product_id: dodoProductId }).eq('id', product.id);
      } catch (err: any) {
        console.warn('Auto create Dodo product error:', err.message);
        if (process.env.DODO_PRODUCT_ID) {
          dodoProductId = process.env.DODO_PRODUCT_ID;
        } else {
          throw err;
        }
      }
    }

    // 4. Create pending order in Supabase
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        full_name: fullName,
        whatsapp_number: whatsappNumber,
        email: email,
        billing_address: billingAddress,
        product_id: product.id,
        coupon_code: couponUsed?.code || null,
        coupon_discount: couponUsed?.discount || null,
        original_amount: Number(product.discounted_price),
        final_amount: finalAmount,
        payment_status: 'pending',
      })
      .select()
      .single();

    if (orderErr || !order) {
      throw new Error(`Failed to save order in Supabase: ${orderErr?.message}`);
    }

    // 5. Compute return URL
    const host = req.headers.get('host') || 'localhost:3000';
    const proto = req.headers.get('x-forwarded-proto') || 'http';
    const baseUrl = process.env.BASE_URL || `${proto}://${host}`;
    const returnUrl = `${baseUrl}/thank-you?orderId=${order.id}`;

    // 6. Format customer details for Dodo E.164
    const customerData: { name: string; email: string; phone_number?: string } = {
      name: fullName,
      email: email,
    };
    if (whatsappNumber) {
      const cleaned = whatsappNumber.replace(/\D/g, '');
      if (cleaned.length === 10) {
        customerData.phone_number = `+91${cleaned}`;
      } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
        customerData.phone_number = `+${cleaned}`;
      } else if (whatsappNumber.startsWith('+') && cleaned.length >= 10 && cleaned.length <= 15) {
        customerData.phone_number = `+${cleaned}`;
      }
    }

    // 7. Create Dodo Payments Checkout Session
    const sessionPayload = {
      product_cart: [
        {
          product_id: dodoProductId!,
          quantity: 1,
          amount: Math.round(finalAmount * 100), // In paise
        },
      ],
      customer: customerData,
      billing_address: {
        country: 'IN',
        street: billingAddress,
      },
      metadata: {
        orderId: order.id,
        productId: product.id,
        email: email,
      },
      return_url: returnUrl,
    };

    let session;
    try {
      session = await dodo.checkoutSessions.create(sessionPayload);
    } catch (err: any) {
      if (
        err?.error?.code === 'REQUEST_AMOUNT_BELOW_MINIMUM' ||
        err?.status === 422 ||
        (typeof err?.message === 'string' && err.message.includes('minimum amount'))
      ) {
        console.log('Product minimum price issue detected. Updating Dodo product price configuration...');
        try {
          await dodo.products.update(dodoProductId!, {
            price: {
              type: 'one_time_price',
              currency: 'INR',
              price: 100, // 100 paise = ₹1 minimum allowed
              pay_what_you_want: true,
              suggested_price: Math.round(Number(product.discounted_price) * 100),
            },
          });
          session = await dodo.checkoutSessions.create(sessionPayload);
        } catch (retryErr) {
          throw err;
        }
      } else {
        throw err;
      }
    }

    // 8. Update order with session ID
    await supabase.from('orders').update({ dodo_session_id: session.session_id }).eq('id', order.id);

    return NextResponse.json({
      success: true,
      checkoutUrl: session.checkout_url,
      sessionId: session.session_id,
      orderDbId: order.id,
      amount: finalAmount,
      currency: 'INR',
      productTitle: product.title,
    });
  } catch (error: any) {
    console.error('Error in create-order:', error);
    return NextResponse.json(
      { message: 'Error creating checkout session', error: error.message },
      { status: 500 }
    );
  }
}
