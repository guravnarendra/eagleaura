'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types/database';

export default function ProductsPage() {
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
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-light to-primary-dark text-white py-8 md:py-12 border-b border-dark-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4 font-heading hero-title">
            All Eagle Products
          </h1>
          <p className="text-base md:text-lg text-light-200 hero-subtitle">
            Browse our complete collection of premium digital templates and resources
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading State */}
          {loading && (
            <div id="loading" className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-light"></div>
              <p className="mt-2 text-light-400">Loading products...</p>
            </div>
          )}

          {/* No Products Message */}
          {!loading && products.length === 0 && (
            <div id="no-products" className="text-center py-12">
              <div className="text-light-400 mb-4">
                <svg className="w-12 h-12 md:w-16 md:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-2-2m0 0l-2 2m2-2v6"></path>
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-light-100 mb-2">No Products Available</h3>
              <p className="text-light-400 text-sm md:text-base">Check back later for new digital products!</p>
            </div>
          )}

          {/* Products Grid */}
          {!loading && products.length > 0 && (
            <div id="products-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-dark-300 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-dark-400"
                >
                  <div className="relative">
                    <img
                      src={product.thumbnail_url}
                      alt={product.title}
                      className="w-full h-40 sm:h-48 object-cover border-b border-dark-400"
                      loading="lazy"
                    />
                    {product.discount_percentage ? (
                      <div className="absolute top-2 right-2 bg-accent-dark text-white px-2 py-1 rounded text-xs sm:text-sm font-semibold border border-yellow-700">
                        {product.discount_percentage}% OFF
                      </div>
                    ) : null}
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="text-base sm:text-lg font-semibold mb-2 line-clamp-2 text-light-100 product-title">
                      {product.title}
                    </h3>
                    <p className="text-light-400 text-xs sm:text-sm mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="flex items-center space-x-2">
                        {product.discount_percentage ? (
                          <span className="text-light-400 line-through text-xs sm:text-sm">
                            ₹{product.original_price}
                          </span>
                        ) : null}
                        <span className="text-lg sm:text-xl font-bold text-primary-light product-price">
                          ₹{product.discounted_price}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/product-detail?id=${product.id}`}
                      className="w-full bg-gradient-to-r from-primary-light to-primary-dark text-white py-2 px-3 sm:py-2 sm:px-4 rounded-lg hover:shadow-glow transition-all duration-300 text-center block font-semibold border border-primary-dark text-sm sm:text-base product-button"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
