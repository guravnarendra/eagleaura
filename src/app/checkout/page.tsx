'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Product } from '@/types/database';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercentage: number; discountAmount: number } | null>(null);

  const [fullName, setFullName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [billingAddress, setBillingAddress] = useState('');

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    async function loadProduct() {
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        }
      } catch (err) {
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [productId]);

  const originalAmount = product ? Number(product.discounted_price) : 0;
  const discountAmount = appliedCoupon ? (originalAmount * appliedCoupon.discountPercentage) / 100 : 0;
  const finalAmount = Math.max(0, originalAmount - discountAmount);

  const isFormValid =
    fullName.trim() !== '' &&
    whatsappNumber.trim() !== '' &&
    email.trim() !== '' &&
    billingAddress.trim() !== '';

  async function handleApplyCoupon() {
    if (!couponCode.trim() || !product) {
      setCouponMessage({ text: 'Please enter a coupon code', type: 'error' });
      return;
    }

    try {
      const response = await fetch('/api/coupons/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponCode.trim(),
          amount: originalAmount,
        }),
      });

      const result = await response.json();

      if (response.ok && result.valid) {
        setAppliedCoupon({
          code: result.couponCode,
          discountPercentage: result.discountPercentage,
          discountAmount: result.discountAmount,
        });
        setCouponMessage({ text: `Coupon applied! You saved ₹${result.discountAmount.toFixed(2)}`, type: 'success' });
      } else {
        setCouponMessage({ text: result.message || 'Invalid coupon code', type: 'error' });
      }
    } catch (error) {
      setCouponMessage({ text: 'Error applying coupon', type: 'error' });
    }
  }

  async function initiatePayment() {
    if (!isFormValid || !product) {
      alert('Please fill all required fields');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          fullName: fullName.trim(),
          whatsappNumber: whatsappNumber.trim(),
          email: email.trim(),
          billingAddress: billingAddress.trim(),
          couponCode: appliedCoupon ? appliedCoupon.code : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Failed to create order');
      }

      const result = await response.json();

      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      } else {
        throw new Error(result.message || 'Checkout URL could not be generated');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      alert(error.message || 'Error processing payment. Please try again.');
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div id="loading" className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-light"></div>
          <p className="mt-2 text-light-400">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div id="error-state" className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              ></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-light-100 mb-2">Product Not Found</h3>
          <p className="text-light-400 mb-4">The product you're trying to purchase doesn't exist.</p>
          <Link
            href="/products"
            className="bg-gradient-to-r from-primary-light to-primary-dark text-white px-6 py-2 rounded-lg hover:shadow-glow transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section id="checkout-section" className="py-8 md:py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-light-100 mb-6 md:mb-8 font-heading policy-title">
          Checkout
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 checkout-grid">
          {/* Checkout Form */}
          <div className="bg-dark-200 rounded-lg shadow-md p-4 sm:p-6 border border-dark-300 policy-content">
            <h2 className="text-xl md:text-2xl font-semibold text-light-100 mb-4 md:mb-6 font-heading section-title">
              Billing Information
            </h2>
            <form id="checkout-form" className="space-y-4 checkout-form" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-light-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 border border-dark-400 rounded-lg focus:ring-primary focus:border-primary bg-dark-300 text-light-200"
                />
              </div>

              <div>
                <label htmlFor="whatsappNumber" className="block text-sm font-medium text-light-300 mb-1">
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  id="whatsappNumber"
                  name="whatsappNumber"
                  required
                  placeholder="Enter WhatsApp number for better communication"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full px-4 py-2 border border-dark-400 rounded-lg focus:ring-primary focus:border-primary bg-dark-300 text-light-200"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-light-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="Used to send download link"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-dark-400 rounded-lg focus:ring-primary focus:border-primary bg-dark-300 text-light-200"
                />
              </div>

              <div>
                <label htmlFor="billingAddress" className="block text-sm font-medium text-light-300 mb-1">
                  Billing Address *
                </label>
                <textarea
                  id="billingAddress"
                  name="billingAddress"
                  required
                  rows={3}
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                  className="w-full px-4 py-2 border border-dark-400 rounded-lg focus:ring-primary focus:border-primary bg-dark-300 text-light-200"
                ></textarea>
              </div>

              <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 coupon-section">
                <input
                  type="text"
                  id="couponCode"
                  name="couponCode"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-4 py-2 border border-dark-400 rounded-lg focus:ring-primary focus:border-primary bg-dark-300 text-light-200"
                />
                <button
                  type="button"
                  id="apply-coupon-btn"
                  onClick={handleApplyCoupon}
                  className="w-full sm:w-auto bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-dark transition-colors"
                >
                  Apply
                </button>
              </div>

              {couponMessage && (
                <div
                  id="coupon-message"
                  className={`mt-2 text-sm ${couponMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}
                >
                  {couponMessage.text}
                </div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="order-1 md:order-none bg-dark-200 rounded-lg shadow-md p-4 sm:p-6 border border-dark-300 policy-content summary-section">
            <h2 className="text-xl md:text-2xl font-semibold text-light-100 mb-4 md:mb-6 font-heading section-title">
              Order Summary
            </h2>
            <div id="product-summary" className="space-y-4">
              <div className="flex items-center space-x-4">
                <img
                  src={product.thumbnail_url}
                  alt={product.title}
                  className="w-16 h-16 object-cover rounded border border-dark-400"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-light-100 truncate">{product.title}</h3>
                  <p className="text-sm text-light-400">Digital Download</p>
                </div>
                <div className="text-right whitespace-nowrap">
                  {product.original_price > product.discounted_price && (
                    <div className="text-sm text-light-400 line-through">₹{product.original_price}</div>
                  )}
                  <div className="font-semibold text-light-200">₹{product.discounted_price}</div>
                </div>
              </div>
            </div>

            <div className="border-t border-dark-400 pt-4 mt-6 space-y-2">
              <div className="flex justify-between">
                <span className="text-light-300">Original Price:</span>
                <span id="original-amount" className="text-light-200">₹{originalAmount}</span>
              </div>
              {appliedCoupon && (
                <div id="discount-row" className="flex justify-between text-green-400">
                  <span>Discount:</span>
                  <span id="discount-amount">-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-dark-400 pt-2 flex justify-between text-lg font-semibold">
                <span className="text-light-100">Total:</span>
                <span id="final-amount" className="text-primary-light">₹{finalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button
              id="pay-now-btn"
              disabled={!isFormValid || submitting}
              onClick={initiatePayment}
              className="w-full bg-gradient-to-r from-primary-light to-primary-dark text-white py-3 px-6 rounded-lg font-semibold hover:shadow-glow transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed mt-6 flex flex-wrap items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0h9"
                ></path>
              </svg>
              {submitting ? 'Redirecting to payment...' : 'Pay Now'}
            </button>

            <div className="mt-4 text-center">
              <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-light-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  ></path>
                </svg>
                <span>Secure payment via Dodo Payments</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-light"></div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
