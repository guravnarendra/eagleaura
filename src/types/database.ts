export interface Product {
  id: string;
  title: string;
  description: string;
  original_price: number;
  discounted_price: number;
  discount_percentage?: number;
  thumbnail_url: string;
  digital_file_url: string;
  dodo_product_id?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_percentage: number;
  is_active: boolean;
  valid_from?: string;
  valid_until?: string | null;
  expiry_date?: string | null;
  max_uses?: number | null;
  current_usage_count?: number;
  used_count?: number;
  created_at?: string;
}

export interface Order {
  id: string;
  full_name: string;
  whatsapp_number: string;
  email: string;
  billing_address: string;
  product_id?: string | null;
  product?: Product;
  coupon_code?: string | null;
  coupon_discount?: number | null;
  original_amount: number;
  final_amount: number;
  coupon_used?: boolean;
  dodo_session_id?: string | null;
  dodo_payment_id?: string | null;
  payment_status: 'pending' | 'completed' | 'failed';
  download_link?: string | null;
  created_at?: string;
  updated_at?: string;
}
