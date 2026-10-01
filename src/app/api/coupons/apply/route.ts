import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

// Apply coupon
export async function POST(req: NextRequest) {
  try {
    const { code, amount } = await req.json();

    if (!code) {
      return NextResponse.json({ message: 'Coupon code is required' }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error || !coupon) {
      return NextResponse.json({ valid: false, message: 'Invalid or inactive coupon code' }, { status: 400 });
    }

    if (coupon.valid_until && new Date(coupon.valid_until) < new Date()) {
      return NextResponse.json({ valid: false, message: 'Coupon code has expired' }, { status: 400 });
    }

    if (coupon.max_uses && coupon.current_usage_count >= coupon.max_uses) {
      return NextResponse.json({ valid: false, message: 'Coupon usage limit reached' }, { status: 400 });
    }

    const originalAmount = Number(amount) || 0;
    const discountAmount = (originalAmount * Number(coupon.discount_percentage)) / 100;
    const finalAmount = Math.max(0, originalAmount - discountAmount);

    return NextResponse.json({
      valid: true,
      couponCode: coupon.code,
      discountPercentage: Number(coupon.discount_percentage),
      discountAmount,
      finalAmount,
    });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error checking coupon', error: error.message }, { status: 500 });
  }
}

// GET all coupons (admin)
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
