import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getServiceSupabase();
    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) throw error;
    if (!coupon) {
      return NextResponse.json({ message: 'Coupon not found' }, { status: 404 });
    }

    return NextResponse.json(coupon);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Error fetching coupon' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const updates: any = {};

    if (body.code !== undefined) updates.code = body.code.trim().toUpperCase();
    if (body.discount_percentage !== undefined || body.discountPercentage !== undefined) {
      updates.discount_percentage = Number(body.discount_percentage ?? body.discountPercentage);
    }
    if (body.max_uses !== undefined || body.maxUses !== undefined) {
      const mu = body.max_uses ?? body.maxUses;
      updates.max_uses = mu ? Number(mu) : 100;
    }
    if (body.expiry_date !== undefined || body.valid_until !== undefined || body.validUntil !== undefined) {
      updates.valid_until = body.expiry_date ?? body.valid_until ?? body.validUntil ?? null;
    }
    if (body.is_active !== undefined || body.isActive !== undefined) {
      updates.is_active = Boolean(body.is_active ?? body.isActive);
    }

    const supabase = getServiceSupabase();
    const { data: coupon, error } = await supabase
      .from('coupons')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ message: `Coupon code '${updates.code}' already exists` }, { status: 400 });
      }
      throw error;
    }

    return NextResponse.json(coupon);
  } catch (error: any) {
    console.error('Error updating coupon:', error);
    return NextResponse.json({ message: error.message || 'Error updating coupon' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getServiceSupabase();
    const { error } = await supabase
      .from('coupons')
      .delete()
      .eq('id', params.id);

    if (error) throw error;
    return NextResponse.json({ message: 'Coupon deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json({ message: error.message || 'Error deleting coupon' }, { status: 500 });
  }
}
