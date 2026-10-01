import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = getServiceSupabase();
    const { data: coupons, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(coupons || []);
  } catch (error: any) {
    return NextResponse.json({ message: 'Error fetching coupons', error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const code = (body.code || '').trim().toUpperCase();
    const discountPercentage = body.discount_percentage ?? body.discountPercentage;
    const maxUses = body.max_uses ?? body.maxUses;
    const validUntil = body.expiry_date ?? body.valid_until ?? body.validUntil;
    const isActive = body.is_active ?? body.isActive ?? true;

    if (!code || discountPercentage === undefined || discountPercentage === null || isNaN(Number(discountPercentage))) {
      return NextResponse.json({ message: 'Code and a valid discount percentage are required' }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    const { data: coupon, error } = await supabase
      .from('coupons')
      .insert({
        code,
        discount_percentage: Number(discountPercentage),
        max_uses: maxUses ? Number(maxUses) : 100,
        valid_until: validUntil || null,
        is_active: Boolean(isActive),
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ message: `Coupon code '${code}' already exists` }, { status: 400 });
      }
      throw error;
    }
    return NextResponse.json(coupon, { status: 201 });
  } catch (error: any) {
    console.error('Error creating coupon:', error);
    return NextResponse.json({ message: error.message || 'Error creating coupon' }, { status: 500 });
  }
}
