'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Order, Product, Coupon } from '@/types/database';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [ordersRes, prodsRes, couponsRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/products?all=true'),
          fetch('/api/coupons'),
        ]);

        if (ordersRes.ok) setOrders(await ordersRes.json());
        if (prodsRes.ok) setProducts(await prodsRes.json());
        if (couponsRes.ok) setCoupons(await couponsRes.json());
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const completedOrders = orders.filter((o) => o.payment_status === 'completed');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + Number(o.final_amount), 0);
  const activeCoupons = coupons.filter((c) => c.is_active);

  return (
    <AdminLayout>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-light-100 header-text">Dashboard</h1>
        <p className="text-light-400 text-sm md:text-base">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8 stats-grid">
        <div className="bg-dark-200 rounded-lg shadow-lg p-4 md:p-6 border border-dark-300">
          <div className="flex items-center">
            <div className="p-2 md:p-3 rounded-full bg-blue-900 bg-opacity-30">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm font-medium text-light-400">Total Orders</p>
              <p id="total-orders" className="text-xl md:text-2xl font-semibold text-light-100">
                {loading ? '...' : completedOrders.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-dark-200 rounded-lg shadow-lg p-4 md:p-6 border border-dark-300">
          <div className="flex items-center">
            <div className="p-2 md:p-3 rounded-full bg-green-900 bg-opacity-30">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm font-medium text-light-400">Total Revenue</p>
              <p id="total-revenue" className="text-xl md:text-2xl font-semibold text-light-100">
                {loading ? '...' : `₹${totalRevenue.toFixed(2)}`}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-dark-200 rounded-lg shadow-lg p-4 md:p-6 border border-dark-300">
          <div className="flex items-center">
            <div className="p-2 md:p-3 rounded-full bg-purple-900 bg-opacity-30">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm font-medium text-light-400">Total Products</p>
              <p id="total-products" className="text-xl md:text-2xl font-semibold text-light-100">
                {loading ? '...' : products.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-dark-200 rounded-lg shadow-lg p-4 md:p-6 border border-dark-300">
          <div className="flex items-center">
            <div className="p-2 md:p-3 rounded-full bg-yellow-900 bg-opacity-30">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
              </svg>
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm font-medium text-light-400">Active Coupons</p>
              <p id="active-coupons" className="text-xl md:text-2xl font-semibold text-light-100">
                {loading ? '...' : activeCoupons.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-dark-200 rounded-lg shadow-lg border border-dark-300">
        <div className="px-4 py-3 md:px-6 md:py-4 border-b border-dark-300">
          <h2 className="text-lg md:text-xl font-semibold text-light-100">Recent Orders</h2>
        </div>
        <div className="p-4 md:p-6">
          {loading ? (
            <div id="recent-orders-loading" className="text-center py-6 md:py-8">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-light"></div>
              <p className="mt-2 text-light-400">Loading recent orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div id="no-orders" className="text-center py-6 md:py-8">
              <div className="text-light-400 mb-3 md:mb-4">
                <svg className="w-12 h-12 md:w-16 md:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-light-200 mb-1 md:mb-2">No Orders Found</h3>
              <p className="text-light-400">No order data available yet.</p>
            </div>
          ) : (
            <div id="recent-orders-table">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-dark-300">
                  <thead className="bg-dark-300">
                    <tr>
                      <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium text-light-400 uppercase tracking-wider table-header">
                        Customer
                      </th>
                      <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium text-light-400 uppercase tracking-wider table-header">
                        Product
                      </th>
                      <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium text-light-400 uppercase tracking-wider table-header">
                        Amount
                      </th>
                      <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium text-light-400 uppercase tracking-wider table-header">
                        Date
                      </th>
                      <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium text-light-400 uppercase tracking-wider table-header">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody id="recent-orders-body" className="bg-dark-200 divide-y divide-dark-300">
                    {orders.slice(0, 10).map((order) => (
                      <tr key={order.id}>
                        <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap table-cell">
                          <div>
                            <div className="text-xs md:text-sm font-medium text-light-100">{order.full_name}</div>
                            <div className="text-xs md:text-sm text-light-400">{order.email}</div>
                          </div>
                        </td>
                        <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap table-cell">
                          <div className="text-xs md:text-sm text-light-200">
                            {(order.product as any)?.title || 'Digital Product'}
                          </div>
                        </td>
                        <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap table-cell">
                          <div className="text-xs md:text-sm text-light-200">₹{order.final_amount}</div>
                        </td>
                        <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap table-cell">
                          <div className="text-xs md:text-sm text-light-200">
                            {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Today'}
                          </div>
                        </td>
                        <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap table-cell">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              order.payment_status === 'completed'
                                ? 'bg-green-900 text-green-300'
                                : order.payment_status === 'pending'
                                ? 'bg-yellow-900 text-yellow-300'
                                : 'bg-red-900 text-red-300'
                            }`}
                          >
                            {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
