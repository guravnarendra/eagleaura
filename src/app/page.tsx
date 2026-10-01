'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types/database';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const featuredProducts = products.slice(0, 4);

  return (
    <div>
      {/* Hero Section with GIF Background */}
      <section className="hero-container">
        {/* GIF Background */}
        <img src="/wakeup.gif" className="hero-bg" alt="Eagle Aura" />

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto h-full flex items-center hero-content text-center">
          <div className="w-full">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 font-heading leading-tight">
              <span className="gradient-text">Wake Up To Reality</span>
            </h1>
            <p className="text-lg md:text-xl mb-6 max-w-3xl mx-auto text-light-200">
              Premium digital products for your creative projects
            </p>
            <a
              href="#featured-products"
              className="bg-gradient-to-r from-primary-light to-primary-dark text-white px-6 py-2 md:px-8 md:py-3 rounded-lg hover:shadow-glow transition-all duration-300 inline-block font-medium text-sm md:text-base"
            >
              Explore Products
            </a>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="featured-products" className="py-12 bg-dark-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-light-100 mb-2 font-heading">Featured Products</h2>
            <p className="text-light-400 max-w-2xl mx-auto text-sm md:text-base">Our most popular digital assets</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 products-grid">
              <div className="bg-dark-300 rounded-lg p-2 animate-pulse h-64"></div>
              <div className="bg-dark-300 rounded-lg p-2 animate-pulse h-64"></div>
              <div className="bg-dark-300 rounded-lg p-2 animate-pulse h-64 hidden md:block"></div>
              <div className="bg-dark-300 rounded-lg p-2 animate-pulse h-64 hidden lg:block"></div>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="col-span-2 md:col-span-3 lg:col-span-4 text-center py-8">
              <p className="text-light-400">Products will be available soon. Please check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 products-grid">
              {featuredProducts.map((product) => (
                <div key={product.id} className="bg-dark-300 rounded-lg overflow-hidden product-card">
                  <div className="product-image-container md:product-image-container product-image-container-mobile">
                    <img
                      src={product.thumbnail_url}
                      alt={product.title}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                    {product.discount_percentage ? (
                      <div className="absolute top-2 right-2 bg-accent-dark text-white px-2 py-1 rounded-full text-xs font-bold">
                        {product.discount_percentage}% OFF
                      </div>
                    ) : null}
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="text-sm font-semibold mb-1 text-light-100 font-heading truncate">
                      {product.title}
                    </h3>
                    <p className="text-light-400 text-xs mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        {product.original_price > product.discounted_price && (
                          <span className="text-gray-400 line-through text-xs">
                            ₹{product.original_price}
                          </span>
                        )}
                        <span className="text-sm font-bold text-primary-light ml-1">
                          ₹{product.discounted_price}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/product-detail?id=${product.id}`}
                      className="w-full bg-gradient-to-r from-primary-light to-primary-dark text-white py-2 px-3 rounded-lg hover:shadow-glow transition-all duration-300 text-center block text-xs font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              href="/products"
              className="bg-gradient-to-r from-primary-light to-primary-dark text-white px-6 py-2 md:px-8 md:py-3 rounded-lg hover:shadow-glow transition-all duration-300 inline-block font-medium text-sm md:text-base"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 bg-dark-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-light-100 mb-2 font-heading">Why Choose Us?</h2>
            <p className="text-light-400 max-w-2xl mx-auto text-sm md:text-base">Quality digital products with exceptional support</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            <div className="text-center p-4 md:p-6 bg-dark-200 rounded-lg feature-card transition-all duration-300 border border-dark-300 hover:border-primary-light hover:shadow-glow-sm">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary-light to-primary-dark rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-light-100 font-heading">Instant Access</h3>
              <p className="text-light-400 text-sm md:text-base">Get your products immediately after purchase</p>
            </div>

            <div className="text-center p-4 md:p-6 bg-dark-200 rounded-lg feature-card transition-all duration-300 border border-dark-300 hover:border-primary-light hover:shadow-glow-sm">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary-light to-primary-dark rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-light-100 font-heading">Premium Quality</h3>
              <p className="text-light-400 text-sm md:text-base">Professionally designed templates</p>
            </div>

            <div className="text-center p-4 md:p-6 bg-dark-200 rounded-lg feature-card transition-all duration-300 border border-dark-300 hover:border-primary-light hover:shadow-glow-sm">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary-light to-primary-dark rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-light-100 font-heading">Great Value</h3>
              <p className="text-light-400 text-sm md:text-base">Affordable prices for premium products</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 bg-dark-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-light-100 mb-2 font-heading">Customer Reviews</h2>
            <p className="text-light-400 max-w-2xl mx-auto text-sm md:text-base">What our customers say about us</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-dark-300 p-4 md:p-6 rounded-lg border border-dark-200 testimonial-card">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-primary-light to-accent-light flex items-center justify-center text-white font-bold mr-3">
                  RK
                </div>
                <div>
                  <h4 className="text-light-100 font-medium text-sm md:text-base">Rajesh Kumar</h4>
                  <div className="flex text-accent-light">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 md:w-5 md:h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-light-300 text-sm md:text-base">
                &ldquo;The templates from Eagle Aura saved me weeks of work on my startup&apos;s branding. The quality is exceptional!&rdquo;
              </p>
            </div>

            <div className="bg-dark-300 p-4 md:p-6 rounded-lg border border-dark-200 testimonial-card">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-primary-light to-accent-light flex items-center justify-center text-white font-bold mr-3">
                  PM
                </div>
                <div>
                  <h4 className="text-light-100 font-medium text-sm md:text-base">Priya Malhotra</h4>
                  <div className="flex text-accent-light">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 md:w-5 md:h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-light-300 text-sm md:text-base">
                &ldquo;Eagle Aura&apos;s resources helped me deliver professional work to clients faster than ever before.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-primary-dark to-primary-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 font-heading">Ready to Elevate Your Projects?</h2>
          <p className="text-white text-opacity-90 mb-6 max-w-3xl mx-auto text-sm md:text-base">
            Join thousands of satisfied customers who trust Eagle Aura.
          </p>
          <div className="flex justify-center space-x-4 cta-buttons">
            <Link
              href="/products"
              className="bg-white text-primary-dark px-6 py-2 md:px-8 md:py-3 rounded-lg text-sm md:text-base font-semibold hover:bg-opacity-90 transition-all duration-300 inline-block"
            >
              Get Started Now
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-6 py-2 md:px-8 md:py-3 rounded-lg text-sm md:text-base font-semibold hover:bg-white hover:bg-opacity-10 transition-all duration-300 inline-block"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
