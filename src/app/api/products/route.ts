import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import DodoPayments from 'dodopayments';

function getDodoClient() {
  const apiKey = process.env.DODO_PAYMENTS_API_KEY;
  if (!apiKey) return null;
  const DodoClass = (DodoPayments as any).default || DodoPayments;
  return new DodoClass({
    bearerToken: apiKey,
    environment: process.env.DODO_PAYMENTS_ENVIRONMENT || 'test_mode',
  });
}

export const dynamic = 'force-dynamic';

// GET all products
export async function GET(req: NextRequest) {
  try {
    const supabase = getServiceSupabase();
    const { searchParams } = new URL(req.url);
    const all = searchParams.get('all') === 'true';

    let query = supabase.from('products').select('*').order('created_at', { ascending: false });
    if (!all) {
      query = query.eq('is_active', true);
    }

    const { data: products, error } = await query;
    if (error) throw error;

    return NextResponse.json(products || []);
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ message: 'Error fetching products', error: error.message }, { status: 500 });
  }
}

// POST create product
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, original_price, discounted_price, thumbnail_url, digital_file_url } = body;

    if (!title || !description || !original_price || !discounted_price || !thumbnail_url || !digital_file_url) {
      return NextResponse.json({ message: 'Missing required product fields' }, { status: 400 });
    }

    let dodoProductId: string | null = null;

    // Register product on Dodo Payments
    try {
      const dodo = getDodoClient();
      if (dodo) {
        const dodoProd = await dodo.products.create({
          name: title,
          description: description.substring(0, 500),
          tax_category: 'digital_products',
          price: {
            type: 'one_time_price',
            currency: 'INR',
            price: 100, // 100 paise = ₹1 minimum allowed
            pay_what_you_want: true,
            suggested_price: Math.round(Number(discounted_price) * 100),
          },
        });
        dodoProductId = dodoProd.product_id;
      }
    } catch (dodoErr: any) {
      console.warn('Could not register product on Dodo immediately:', dodoErr.message);
    }

    const supabase = getServiceSupabase();
    const { data: product, error } = await supabase
      .from('products')
      .insert({
        title,
        description,
        original_price: Number(original_price),
        discounted_price: Number(discounted_price),
        thumbnail_url,
        digital_file_url,
        dodo_product_id: dodoProductId,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ message: 'Error creating product', error: error.message }, { status: 500 });
  }
}
