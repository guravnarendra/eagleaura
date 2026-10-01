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
    webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_KEY || undefined,
  });
}

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    let event: any;

    const webhookId =
      req.headers.get('webhook-id') ||
      req.headers.get('svix-id') ||
      '';
    const webhookSignature =
      req.headers.get('webhook-signature') ||
      req.headers.get('svix-signature') ||
      '';
    const webhookTimestamp =
      req.headers.get('webhook-timestamp') ||
      req.headers.get('svix-timestamp') ||
      '';

    const webhookKey = process.env.DODO_PAYMENTS_WEBHOOK_KEY;

    if (webhookKey && webhookSignature) {
      try {
        const dodo = getDodoClient();
        if (!dodo) throw new Error('Dodo client not configured');

        event = dodo.webhooks.unwrap(rawBody, {
          headers: {
            'webhook-id': webhookId,
            'webhook-signature': webhookSignature,
            'webhook-timestamp': webhookTimestamp,
          },
          key: webhookKey,
        });
      } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return new NextResponse(`Webhook verification failed: ${err.message}`, { status: 400 });
      }
    } else {
      console.warn('DODO_PAYMENTS_WEBHOOK_KEY not verified. Parsing raw body.');
      try {
        event = JSON.parse(rawBody);
      } catch (e: any) {
        return new NextResponse(`Invalid JSON body: ${e.message}`, { status: 400 });
      }
    }

    const eventType = event.type || event.event;
    console.log(`Dodo Webhook event received: ${eventType}`);

    const supabase = getServiceSupabase();

    if (eventType === 'payment.succeeded' || eventType === 'checkout.session.completed') {
      const payloadData = event.data || {};
      const orderId =
        payloadData.metadata?.orderId ||
        payloadData.metadata?.order_id;
      const paymentId = payloadData.payment_id || payloadData.paymentId;
      const sessionId = payloadData.session_id || payloadData.sessionId;

      let order: any = null;

      // 1. Search by primary order ID
      if (orderId) {
        const { data } = await supabase
          .from('orders')
          .select('*, product:products(*)')
          .eq('id', orderId)
          .single();
        order = data;
      }

      // 2. Fallback search by dodo_session_id
      if (!order && sessionId) {
        const { data } = await supabase
          .from('orders')
          .select('*, product:products(*)')
          .eq('dodo_session_id', sessionId)
          .single();
        order = data;
      }

      // 3. Fallback search by dodo_payment_id
      if (!order && paymentId) {
        const { data } = await supabase
          .from('orders')
          .select('*, product:products(*)')
          .eq('dodo_payment_id', paymentId)
          .single();
        order = data;
      }

      if (!order) {
        console.warn(`Order not found for webhook event: ${eventType}, orderId: ${orderId}, paymentId: ${paymentId}`);
        return NextResponse.json({ received: true, note: 'Order not matched in Supabase' });
      }

      if (order.payment_status !== 'completed') {
        const downloadUrl = order.product?.digital_file_url || null;

        await supabase
          .from('orders')
          .update({
            payment_status: 'completed',
            dodo_payment_id: paymentId || order.dodo_payment_id,
            download_link: downloadUrl,
            updated_at: new Date().toISOString(),
          })
          .eq('id', order.id);

        console.log(`Order ${order.id} marked as completed in Supabase.`);

        // Send email with download link
        if (downloadUrl && order.email) {
          try {
            await sendDownloadEmail({
              fullName: order.full_name,
              email: order.email,
              productTitle: order.product?.title || 'Digital Product',
              amount: order.final_amount,
              downloadUrl: downloadUrl,
              orderId: order.id,
            });
            console.log(`Download email sent to ${order.email} for order ${order.id}`);
          } catch (e: any) {
            console.error('Failed to send download email:', e.message);
          }
        }
      } else {
        console.log(`Order ${order.id} was already marked completed.`);
      }
    } else if (eventType === 'payment.failed') {
      const payloadData = event.data || {};
      const orderId =
        payloadData.metadata?.orderId ||
        payloadData.metadata?.order_id;
      const sessionId = payloadData.session_id || payloadData.sessionId;

      if (orderId) {
        await supabase
          .from('orders')
          .update({ payment_status: 'failed', updated_at: new Date().toISOString() })
          .eq('id', orderId);
        console.log(`Order ${orderId} marked as failed.`);
      } else if (sessionId) {
        await supabase
          .from('orders')
          .update({ payment_status: 'failed', updated_at: new Date().toISOString() })
          .eq('dodo_session_id', sessionId);
      }
    }

    return NextResponse.json({ received: true, event: eventType });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
