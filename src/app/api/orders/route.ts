import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

// GET all orders (admin)
export async function GET() {
  try {
    const supabase = getServiceSupabase();
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, product:products(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(orders || []);
  } catch (error: any) {
    return NextResponse.json({ message: 'Error fetching orders', error: error.message }, { status: 500 });
  }
}
