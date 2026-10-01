'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Order } from '@/types/database';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);

  async function loadOrders() {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) setOrders(await res.json());
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function handleResendEmail(id: string) {
    setSendingId(id);
    try {
      const res = await fetch(`/api/orders/${id}`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        alert('Download email resent successfully!');
      } else {
        alert(data.message || 'Failed to resend email');
      }
    } catch (err: any) {
      alert(err.message || 'Error resending email');
    } finally {
      setSendingId(null);
    }
  }

  const filteredOrders = orders
    .filter((o) => {
      const matchesSearch =
        o.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        o.email?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || o.payment_status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'amount') return Number(b.final_amount) - Number(a.final_amount);
      if (sortBy === 'customer') return (a.full_name || '').localeCompare(b.full_name || '');
      return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
    });

  return (
    <AdminLayout>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-light-100 header-text">Order Management</h1>
        <p className="text-light-400 text-sm md:text-base">Track and manage customer orders and payments</p>
      </div>

      {/* Filter and Search */}
      <div className="bg-dark-200 rounded-lg shadow-lg p-4 md:p-6 mb-6 md:mb-8 border border-dark-300">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 filter-container">
          <div className="flex-1 max-w-md filter-controls">
            <input
              type="text"
              id="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders by customer name or email..."
              className="w-full px-4 py-2 bg-dark-300 border border-dark-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent text-light-200"
            />
          </div>
          <div className="flex gap-2 md:gap-4 filter-controls">
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-dark-300 border border-dark-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light text-light-200 text-sm md:text-base"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-dark-300 border border-dark-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light text-light-200 text-sm md:text-base"
            >
              <option value="recent">Sort by Recent</option>
              <option value="amount">Sort by Amount</option>
              <option value="customer">Sort by Customer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-dark-200 rounded-lg shadow-lg border border-dark-300">
        <div className="px-4 py-3 md:px-6 md:py-4 border-b border-dark-300">
          <h2 className="text-lg md:text-xl font-semibold text-light-100">Order List</h2>
        </div>
        <div className="p-4 md:p-6">
          {loading ? (
            <div id="orders-loading" className="text-center py-6 md:py-8">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-light"></div>
              <p className="mt-2 text-light-400">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div id="no-orders" className="text-center py-6 md:py-8">
              <div className="text-light-400 mb-3 md:mb-4">
                <svg className="w-12 h-12 md:w-16 md:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-light-200 mb-1 md:mb-2">No Orders Found</h3>
              <p className="text-light-400">No orders match your current filters.</p>
            </div>
          ) : (
            <div id="orders-table">
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
                      <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium text-light-400 uppercase tracking-wider table-header">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody id="orders-body" className="bg-dark-200 divide-y divide-dark-300">
                    {filteredOrders.map((order) => (
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
                        <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium table-cell">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-primary-light hover:text-primary-dark mr-3"
                          >
                            View
                          </button>
                          {order.payment_status === 'completed' && (
                            <button
                              onClick={() => handleResendEmail(order.id)}
                              disabled={sendingId === order.id}
                              className="text-light-300 hover:text-light-100 disabled:opacity-50"
                            >
                              {sendingId === order.id ? 'Sending...' : 'Resend Email'}
                            </button>
                          )}
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

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div id="order-modal" className="fixed inset-0 bg-dark-100 bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="bg-dark-200 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto modal-content border border-dark-300">
            <div className="px-4 py-3 md:px-6 md:py-4 border-b border-dark-300 flex items-center justify-between">
              <h3 className="text-lg md:text-xl font-semibold text-light-100">Order Details</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-light-400 hover:text-light-200">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div id="order-modal-content" className="p-4 md:p-6 space-y-4">
              <div>
                <p className="text-xs text-light-400">Order ID</p>
                <p className="text-sm font-mono text-light-200">{selectedOrder.id}</p>
              </div>
              <div>
                <p className="text-xs text-light-400">Customer Name</p>
                <p className="text-sm font-medium text-light-100">{selectedOrder.full_name}</p>
              </div>
              <div>
                <p className="text-xs text-light-400">Customer Email</p>
                <p className="text-sm text-light-200">{selectedOrder.email}</p>
              </div>
              <div>
                <p className="text-xs text-light-400">WhatsApp</p>
                <p className="text-sm text-light-200">{selectedOrder.whatsapp_number}</p>
              </div>
              <div>
                <p className="text-xs text-light-400">Billing Address</p>
                <p className="text-sm text-light-200">{selectedOrder.billing_address}</p>
              </div>
              <div>
                <p className="text-xs text-light-400">Dodo Payment ID</p>
                <p className="text-sm font-mono text-light-200">{selectedOrder.dodo_payment_id || 'N/A'}</p>
              </div>
              <div className="pt-3 border-t border-dark-300 flex justify-between items-center">
                <span className="text-sm font-bold text-light-100">Final Amount</span>
                <span className="text-base font-bold text-primary-light">₹{selectedOrder.final_amount}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
