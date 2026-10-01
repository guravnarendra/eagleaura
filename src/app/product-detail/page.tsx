'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Product } from '@/types/database';

function ProductDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) {
      setError(true);
      setLoading(false);
      return;
    }

    async function loadProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          setError(true);
        } else {
          const data = await res.json();
          setProduct(data);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div id="loading" className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-light"></div>
          <p className="mt-2 text-light-400">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div id="error-state" className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center px-4">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 md:w-16 md:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h3 className="text-lg md:text-xl font-semibold text-light-100 mb-2">Product Not Found</h3>
          <p className="text-light-400 mb-4 text-sm md:text-base">The product you're looking for doesn't exist or has been removed.</p>
          <Link href="/products" className="bg-gradient-to-r from-primary-light to-primary-dark text-white px-4 py-2 md:px-6 md:py-2 rounded-lg hover:shadow-glow transition-colors text-sm md:text-base">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section id="product-detail" className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 md:mb-8">
          <ol className="flex items-center space-x-2 text-sm overflow-x-auto py-2">
            <li><Link href="/" className="text-light-400 hover:text-primary-light">Home</Link></li>
            <li className="text-light-400">/</li>
            <li><Link href="/products" className="text-light-400 hover:text-primary-light">Products</Link></li>
            <li className="text-light-400">/</li>
            <li className="text-light-100 truncate max-w-[150px] md:max-w-none">{product.title}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="bg-dark-300 rounded-lg md:rounded-xl overflow-hidden shadow-lg border border-dark-400">
              <img
                src={product.thumbnail_url}
                alt={product.title}
                className="w-full h-auto product-image max-h-[300px] md:max-h-[500px] object-contain"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4 md:space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-light-100 mb-3 md:mb-4 font-heading product-title">
                {product.title}
              </h1>
              <div className="flex items-center space-x-2 md:space-x-4 mb-4 md:mb-6 price-container">
                {product.discount_percentage ? (
                  <span className="text-lg md:text-2xl text-light-400 line-through original-price">
                    ₹{product.original_price}
                  </span>
                ) : null}
                <span className="text-2xl md:text-4xl font-bold text-primary-light discounted-price">
                  ₹{product.discounted_price}
                </span>
                {product.discount_percentage ? (
                  <span className="bg-accent-dark text-white px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-semibold">
                    {product.discount_percentage}% OFF
                  </span>
                ) : null}
              </div>
            </div>

            {/* Buy Now Button */}
            <div className="sticky bottom-0 bg-dark-100 py-3 md:py-0 md:static z-10">
              <button
                onClick={() => router.push(`/checkout?id=${product.id}`)}
                className="w-full bg-gradient-to-r from-primary-light to-primary-dark text-white py-3 md:py-4 px-6 md:px-8 rounded-lg text-base md:text-lg font-semibold hover:shadow-glow transition-all duration-300 flex items-center justify-center buy-now-btn"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0h9"></path>
                </svg>
                Buy Now - ₹{product.discounted_price}
              </button>
              <p className="text-xs md:text-sm text-light-400 text-center mt-1 md:mt-2">
                Secure payment via Dodo Payments
              </p>
            </div>

            {/* Product Description */}
            <div className="border-t border-dark-400 pt-4 md:pt-6">
              <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3 text-light-100">Product Description</h3>
              <p className="text-light-300 leading-relaxed text-sm md:text-base whitespace-pre-line">
                {product.description}
              </p>
            </div>

            <div className="border-t border-dark-400 pt-4 md:pt-6">
              <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3 text-light-100">What You Get</h3>
              <ul className="space-y-2 md:space-y-3 text-light-300 text-sm md:text-base">
                <li className="flex items-start">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Instant download after purchase</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Lifetime access to your purchase</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Email delivery with download link</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>24/7 customer support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-light"></div>
        </div>
      }
    >
      <ProductDetailContent />
    </Suspense>
  );
}
