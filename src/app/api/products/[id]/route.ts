import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getServiceSupabase();
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ message: 'Error fetching product', error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const supabase = getServiceSupabase();

    const { data: product, error } = await supabase
      .from('products')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ message: 'Error updating product', error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getServiceSupabase();
    const { error } = await supabase.from('products').delete().eq('id', params.id);
    if (error) throw error;
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error deleting product', error: error.message }, { status: 500 });
  }
}
