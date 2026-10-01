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
    const queryStatus = searchParams.get('status')?.toLowerCase();

    const { data: order, error } = await supabase
      .from('orders')
      .select('*, product:products(*)')
      .eq('id', params.id)
      .single();

    if (error || !order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    const isExplicitlyFailedInQuery =
      queryStatus === 'failed' ||
      queryStatus === 'cancelled' ||
      queryStatus === 'expired' ||
      queryStatus === 'error';

    // Fallback: check with Dodo API directly if still pending or if query indicates failure
    if (order.payment_status !== 'completed') {
      let resolvedStatus: 'completed' | 'failed' | null = null;
      let pid = queryPaymentId || order.dodo_payment_id;

      try {
        const dodo = getDodoClient();
        if (dodo) {
          // 1. Check with Dodo Payments API if payment ID is available
          if (pid) {
            try {
              const payment = await dodo.payments.retrieve(pid);
              if (payment) {
                if (payment.status === 'succeeded') {
                  resolvedStatus = 'completed';
                } else if (payment.status === 'failed' || payment.status === 'cancelled') {
                  resolvedStatus = 'failed';
                }
              }
            } catch (err: any) {
              console.warn('Could not retrieve payment from Dodo API:', err.message);
            }
          }

          // 2. If not resolved yet, check Dodo Checkout Session if session ID is available
          if (!resolvedStatus && order.dodo_session_id) {
            try {
              const session = await dodo.checkoutSessions.retrieve(order.dodo_session_id);
              if (session) {
                if (session.payment_id && !pid) {
                  pid = session.payment_id;
                }
                if (session.payment_status === 'succeeded') {
                  resolvedStatus = 'completed';
                } else if (session.payment_status === 'failed' || session.payment_status === 'cancelled') {
                  resolvedStatus = 'failed';
                }
              }
            } catch (err: any) {
              console.warn('Could not retrieve checkout session from Dodo API:', err.message);
            }
          }
        }
      } catch (err: any) {
        console.warn('Dodo client error during status check:', err.message);
      }

      // 3. Mark failed if confirmed by Dodo OR indicated by redirect query parameter
      if (resolvedStatus === 'failed' || (!resolvedStatus && isExplicitlyFailedInQuery)) {
        await supabase
          .from('orders')
          .update({
            payment_status: 'failed',
            ...(pid ? { dodo_payment_id: pid } : {}),
            updated_at: new Date().toISOString(),
          })
          .eq('id', order.id);

        order.payment_status = 'failed';
        if (pid) order.dodo_payment_id = pid;
      } else if (resolvedStatus === 'completed') {
        const downloadUrl = order.product?.digital_file_url || null;

        await supabase
          .from('orders')
          .update({
            payment_status: 'completed',
            ...(pid ? { dodo_payment_id: pid } : {}),
            download_link: downloadUrl,
            updated_at: new Date().toISOString(),
          })
          .eq('id', order.id);

        order.payment_status = 'completed';
        order.download_link = downloadUrl;
        if (pid) order.dodo_payment_id = pid;

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
      }
    }

    // Security check: Never expose download link or digital_file_url if payment is not completed
    if (order.payment_status !== 'completed') {
      order.download_link = null;
      if (order.product) {
        order.product.digital_file_url = '';
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
