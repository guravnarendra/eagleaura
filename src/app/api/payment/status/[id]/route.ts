import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { sendDownloadEmail } from '@/lib/email';
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

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getServiceSupabase();
    const { searchParams } = new URL(req.url);
    const queryPaymentId = searchParams.get('payment_id');

    const { data: order, error } = await supabase
      .from('orders')
      .select('*, product:products(*)')
      .eq('id', params.id)
      .single();

    if (error || !order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Fallback: check with Dodo API directly if still pending
    if (order.payment_status !== 'completed' && (queryPaymentId || order.dodo_payment_id)) {
      try {
        const dodo = getDodoClient();
        if (dodo) {
          const pid = queryPaymentId || order.dodo_payment_id;
          const payment = await dodo.payments.retrieve(pid);

          if (payment && payment.status === 'succeeded') {
            const downloadUrl = order.product?.digital_file_url || null;

            await supabase
              .from('orders')
              .update({
                payment_status: 'completed',
                dodo_payment_id: pid,
                download_link: downloadUrl,
                updated_at: new Date().toISOString(),
              })
              .eq('id', order.id);

            order.payment_status = 'completed';
            order.download_link = downloadUrl;

            if (downloadUrl) {
              try {
                await sendDownloadEmail({
                  fullName: order.full_name,
                  email: order.email,
                  productTitle: order.product?.title || 'Digital Product',
                  amount: order.final_amount,
                  downloadUrl: downloadUrl,
                  orderId: order.id,
                });
              } catch (e: any) {
                console.error('Email error in status check:', e.message);
              }
            }
          } else if (payment && payment.status === 'failed') {
            await supabase.from('orders').update({ payment_status: 'failed' }).eq('id', order.id);
            order.payment_status = 'failed';
          }
        }
      } catch (err: any) {
        console.warn('Could not retrieve payment from Dodo API:', err.message);
      }
    }

    return NextResponse.json({
      paymentStatus: order.payment_status,
      order,
    });
  } catch (error: any) {
    console.error('Error fetching order status:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}
