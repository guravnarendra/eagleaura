import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { sendDownloadEmail } from '@/lib/email';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getServiceSupabase();
    const { data: order, error } = await supabase
      .from('orders')
      .select('*, product:products(*)')
      .eq('id', params.id)
      .single();

    if (error || !order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ message: 'Error fetching order', error: error.message }, { status: 500 });
  }
}

// Resend download email
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getServiceSupabase();
    const { data: order, error } = await supabase
      .from('orders')
      .select('*, product:products(*)')
      .eq('id', params.id)
      .single();

    if (error || !order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    if (order.payment_status !== 'completed') {
      return NextResponse.json({ message: 'Order payment is not completed' }, { status: 400 });
    }

    const downloadUrl = order.product?.digital_file_url;
    if (!downloadUrl) {
      return NextResponse.json({ message: 'Product file URL missing' }, { status: 400 });
    }

    await sendDownloadEmail({
      fullName: order.full_name,
      email: order.email,
      productTitle: order.product?.title || 'Digital Product',
      amount: order.final_amount,
      downloadUrl,
      orderId: order.id,
    });

    return NextResponse.json({ message: 'Download email sent successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error sending email', error: error.message }, { status: 500 });
  }
}
