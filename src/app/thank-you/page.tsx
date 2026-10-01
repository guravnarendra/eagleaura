'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Order } from '@/types/database';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const paymentId = searchParams.get('payment_id');
  const statusParam = searchParams.get('status')?.toLowerCase() || null;

  const [order, setOrder] = useState<Order | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'completed' | 'failed' | 'pending' | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const checkStatus = useCallback(async (isManualRefresh = false) => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    if (isManualRefresh) {
      setRefreshing(true);
    }

    try {
      const queryParts: string[] = [];
      if (paymentId) queryParts.push(`payment_id=${encodeURIComponent(paymentId)}`);
      if (statusParam) queryParts.push(`status=${encodeURIComponent(statusParam)}`);
      const queryStr = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
      const url = `/api/payment/status/${orderId}${queryStr}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
        if (data.paymentStatus) {
          setPaymentStatus(data.paymentStatus);
        } else if (data.order?.payment_status) {
          setPaymentStatus(data.order.payment_status);
        }
      }
    } catch (err) {
      console.error('Error fetching order status:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [orderId, paymentId, statusParam]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  if (loading) {
    return (
      <div id="loading" className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-light"></div>
          <p className="mt-2 text-light-400">Verifying payment status...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div id="error-state" className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center px-4">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-light-100 mb-2">Order Not Found</h3>
          <p className="text-light-400 mb-4">The order you're looking for doesn't exist or there was an error retrieving it.</p>
          <Link href="/products" className="bg-gradient-to-r from-primary-light to-primary-dark text-white px-6 py-2 rounded-lg hover:shadow-glow transition-colors">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  // Determine actual payment outcome
  const isFailedParam =
    statusParam === 'failed' ||
    statusParam === 'cancelled' ||
    statusParam === 'expired';

  const isFailed =
    paymentStatus === 'failed' ||
    order.payment_status === 'failed' ||
    (isFailedParam && paymentStatus !== 'completed');

  const isCompleted =
    !isFailed &&
    (paymentStatus === 'completed' || order.payment_status === 'completed');

  const isPending = !isCompleted && !isFailed;

  const downloadUrl = isCompleted ? (order.download_link || (order.product as any)?.digital_file_url) : null;
  const productTitle = (order.product as any)?.title || 'Digital Product';
  const originalAmount = order.original_amount;
  const finalAmount = order.final_amount;
  const discountAmount = originalAmount - finalAmount;

  return (
    <section id="thank-you-section" className="py-8 md:py-12 thank-you-section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* PAYMENT FAILED HEADER */}
        {isFailed && (
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-950/60 border border-red-500/40 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-950/40">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-light-100 mb-2 font-heading">
              Payment Failed
            </h1>
            <p className="text-lg text-red-400">
              Your payment could not be processed.
            </p>
            <p className="text-sm text-light-400 mt-1 max-w-lg mx-auto">
              No money was charged to your account. If any amount was deducted, it will be automatically refunded by your bank.
            </p>
          </div>
        )}

        {/* PAYMENT PENDING HEADER */}
        {isPending && (
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-yellow-950/60 border border-yellow-500/40 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-950/40">
              <svg className="w-8 h-8 text-yellow-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-light-100 mb-2 font-heading">
              Payment Under Verification
            </h1>
            <p className="text-lg text-yellow-300">
              We are waiting for payment confirmation from your bank or payment provider.
            </p>
          </div>
        )}

        {/* PAYMENT COMPLETED / SUCCESS HEADER */}
        {isCompleted && (
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-light-100 mb-2 font-heading">
              Thank You for Your Purchase!
            </h1>
            <p className="text-lg text-light-300">Your payment has been successfully processed.</p>
          </div>
        )}

        {/* FAILED ACTION BANNER */}
        {isFailed && (
          <div className="bg-gradient-to-r from-red-950/70 via-dark-200 to-dark-200 border border-red-500/40 rounded-lg p-6 mb-8 text-center">
            <h2 className="text-xl font-bold text-light-100 mb-2">Want to try again?</h2>
            <p className="text-light-300 text-sm mb-6 max-w-lg mx-auto">
              You can retry payment with a different card or UPI method. Your selected product is saved and ready.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                href={order.product_id ? `/checkout?id=${order.product_id}` : '/products'}
                className="w-full sm:w-auto inline-flex items-center justify-center bg-gradient-to-r from-primary-light to-primary-dark text-white px-6 py-3 rounded-lg font-semibold hover:shadow-glow transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Retry Payment Now
              </Link>
              <Link
                href="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-dark-300 border border-dark-400 text-light-200 px-6 py-3 rounded-lg font-medium hover:bg-dark-400 transition-colors"
              >
                Browse Other Products
              </Link>
            </div>
          </div>
        )}

        {/* PENDING ACTION BANNER */}
        {isPending && (
          <div className="bg-dark-200 border border-yellow-500/40 rounded-lg p-6 mb-8 text-center">
            <p className="text-light-300 text-sm mb-4">
              If your payment was completed on the payment gateway, please click below to refresh the status.
            </p>
            <button
              onClick={() => checkStatus(true)}
              disabled={refreshing}
              className="inline-flex items-center bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              <svg className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              {refreshing ? 'Checking Status...' : 'Refresh Status'}
            </button>
          </div>
        )}

        {/* SUCCESS DOWNLOAD SECTION - ONLY VISIBLE ON COMPLETED STATUS */}
        {isCompleted && (
          <div className="bg-gradient-to-r from-primary-light to-primary-dark text-white rounded-lg p-6 mb-8">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-4">Download Your Product</h2>
              <p className="mb-4 text-light-200">
                Click below to download your digital product. The link has also been sent to your email.
              </p>
              {downloadUrl ? (
                <a
                  id="download-link"
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="inline-flex items-center bg-white text-primary-dark px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors download-btn"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-4-4m4 4l4-4m-6 4h8a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v7a2 2 0 002 2z"></path>
                  </svg>
                  Download Now
                </a>
              ) : (
                <p className="text-light-200 font-medium">Link sent to your email</p>
              )}
            </div>
          </div>
        )}

        {/* Order Details */}
        <div className="bg-dark-300 rounded-lg shadow-lg p-6 mb-8 border border-dark-400">
          <h2 className="text-xl font-semibold mb-4 text-light-100 font-heading">Order Details</h2>
          <div id="order-details" className="space-y-6">
            <div className="grid order-details-grid md:grid-cols-2 gap-6">
              <div className="bg-dark-200 p-4 rounded-lg border border-dark-400">
                <h3 className="font-semibold mb-3 text-light-100">Customer Information</h3>
                <div className="space-y-2 text-light-300">
                  <p><span className="font-medium text-light-200">Name:</span> {order.full_name}</p>
                  <p><span className="font-medium text-light-200">Email:</span> {order.email}</p>
                  <p><span className="font-medium text-light-200">WhatsApp:</span> {order.whatsapp_number}</p>
                </div>
              </div>

              <div className="bg-dark-200 p-4 rounded-lg border border-dark-400">
                <h3 className="font-semibold mb-3 text-light-100">Order Information</h3>
                <div className="space-y-2 text-light-300">
                  <p><span className="font-medium text-light-200">Product:</span> {productTitle}</p>
                  <p><span className="font-medium text-light-200">Order Date:</span> {new Date(order.created_at || Date.now()).toLocaleDateString()}</p>
                  <p>
                    <span className="font-medium text-light-200">Payment Status:</span>{' '}
                    {isCompleted && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-300">
                        Completed
                      </span>
                    )}
                    {isFailed && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-950 text-red-400 border border-red-800">
                        Failed
                      </span>
                    )}
                    {isPending && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-950 text-yellow-300 border border-yellow-800">
                        Pending
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-dark-400 pt-6 mt-6">
              <h3 className="font-semibold mb-3 text-light-100">Payment Summary</h3>
              <div className="bg-dark-200 rounded-lg p-4 border border-dark-400">
                <div className="flex justify-between items-center mb-2 text-light-300">
                  <span>Original Amount:</span>
                  <span>₹{originalAmount}</span>
                </div>
                {order.coupon_used && discountAmount > 0 && (
                  <div className="flex justify-between items-center mb-2 text-green-400">
                    <span>Discount:</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-dark-400 pt-2 flex justify-between items-center font-semibold text-light-100">
                  <span>{isCompleted ? 'Total Paid:' : 'Total Amount:'}</span>
                  <span className={isCompleted ? 'text-primary-light' : isFailed ? 'text-red-400' : 'text-yellow-400'}>
                    ₹{finalAmount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Section */}
        {isCompleted && (
          <div className="bg-yellow-900 bg-opacity-20 border border-yellow-700 rounded-lg p-4 mb-8">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-yellow-400 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <h3 className="font-semibold text-yellow-300 mb-2">Important Information</h3>
                <ul className="text-yellow-200 space-y-1 text-sm">
                  <li className="flex items-start">
                    <svg className="w-4 h-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Save the download link - you have lifetime access</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Check your email for the download link</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {isFailed && (
          <div className="bg-red-950/20 border border-red-800/40 rounded-lg p-4 mb-8">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-400 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              <div>
                <h3 className="font-semibold text-red-300 mb-1">Why did my payment fail?</h3>
                <p className="text-light-300 text-sm">
                  Payments may fail due to incorrect card expiry date or CVV, 3D Secure / OTP timeout, insufficient balance, or international transaction restrictions imposed by your bank. Please re-check your details and try again.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Support Section */}
        <div className="bg-dark-300 rounded-lg shadow-lg p-6 border border-dark-400">
          <h2 className="text-xl font-semibold mb-4 text-light-100 font-heading">Need Help?</h2>
          <p className="text-light-300 mb-4">
            {isFailed
              ? 'Having trouble with payments? Contact us and we will assist you.'
              : 'Contact us if you need assistance with your download.'}
          </p>
          <div className="flex items-center bg-dark-200 p-4 rounded-lg">
            <svg className="w-5 h-5 text-primary-light mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <div>
              <p className="font-semibold text-light-100">Email Support</p>
              <p className="text-light-400">eagleaura09@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Continue Shopping */}
        <div className="text-center mt-8">
          <Link
            href="/products"
            className="bg-gradient-to-r from-primary-light to-primary-dark text-white px-6 py-2 rounded-lg hover:shadow-glow transition-all duration-300 inline-block font-medium"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-light"></div>
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}

