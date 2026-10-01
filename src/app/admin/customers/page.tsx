'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Order } from '@/types/database';

interface CustomerSummary {
  fullName: string;
  email: string;
  whatsappNumber: string;
  billingAddress: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string;
  orders: Order[];
}

export default function AdminCustomersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerSummary | null>(null);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch('/api/orders');
        if (res.ok) setOrders(await res.json());
      } catch (err) {
        console.error('Error loading orders:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  // Aggregate orders by customer email
  const customersMap = new Map<string, CustomerSummary>();
  orders.forEach((o) => {
    const email = o.email?.toLowerCase().trim() || 'unknown';
    const existing = customersMap.get(email);
    const amount = o.payment_status === 'completed' ? Number(o.final_amount) : 0;

    if (existing) {
      existing.orderCount += 1;
      existing.totalSpent += amount;
      existing.orders.push(o);
      if (new Date(o.created_at || '').getTime() > new Date(existing.lastOrderDate).getTime()) {
        existing.lastOrderDate = o.created_at || '';
      }
    } else {
      customersMap.set(email, {
        fullName: o.full_name,
        email: o.email,
        whatsappNumber: o.whatsapp_number,
        billingAddress: o.billing_address,
        orderCount: 1,
        totalSpent: amount,
        lastOrderDate: o.created_at || '',
        orders: [o],
      });
    }
  });

  const customerList = Array.from(customersMap.values());
  const repeatCustomers = customerList.filter((c) => c.orderCount > 1).length;
  const totalRevenue = customerList.reduce((acc, c) => acc + c.totalSpent, 0);
  const totalOrdersCompleted = orders.filter((o) => o.payment_status === 'completed').length;
  const avgOrderValue = totalOrdersCompleted > 0 ? totalRevenue / totalOrdersCompleted : 0;

  const filteredCustomers = customerList
    .filter((c) => {
      const q = search.toLowerCase();
      return c.fullName?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.fullName.localeCompare(b.fullName);
      if (sortBy === 'orders') return b.orderCount - a.orderCount;
      if (sortBy === 'revenue') return b.totalSpent - a.totalSpent;
      return new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime();
    });

  function exportCSV() {
    const headers = ['Full Name', 'Email', 'WhatsApp', 'Total Orders', 'Total Spent (INR)', 'Last Order Date'];
    const rows = filteredCustomers.map((c) => [
      `"${c.fullName}"`,
      `"${c.email}"`,
      `"${c.whatsappNumber}"`,
      c.orderCount,
      c.totalSpent,
      `"${c.lastOrderDate ? new Date(c.lastOrderDate).toLocaleDateString() : ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `eagle_customers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <AdminLayout>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-light-100 header-text">Customer Details</h1>
        <p className="text-light-400 text-sm md:text-base">View and manage customer information</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-dark-200 rounded-lg shadow-lg p-4 md:p-6 mb-6 md:mb-8 border border-dark-300">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 search-container">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              id="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customers by name or email..."
              className="w-full px-4 py-2 bg-dark-300 border border-dark-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent text-light-200"
            />
          </div>
          <div className="flex gap-2 md:gap-4">
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-dark-300 border border-dark-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light text-light-200 text-sm md:text-base"
            >
              <option value="recent">Sort by Recent</option>
              <option value="name">Sort by Name</option>
              <option value="orders">Sort by Orders</option>
              <option value="revenue">Sort by Revenue</option>
            </select>
            <button
              onClick={exportCSV}
              id="export-btn"
              className="bg-gradient-to-r from-secondary-light to-secondary-dark text-white px-4 py-2 rounded-lg hover:shadow-glow transition-colors text-sm md:text-base font-medium"
            >
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8 stats-grid">
        <div className="bg-dark-200 rounded-lg shadow-lg p-4 md:p-6 border border-dark-300">
          <div className="flex items-center">
            <div className="p-2 md:p-3 rounded-full bg-blue-900 bg-opacity-30">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm font-medium text-light-400">Total Customers</p>
              <p id="total-customers" className="text-xl md:text-2xl font-semibold text-light-100">
                {customerList.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-dark-200 rounded-lg shadow-lg p-4 md:p-6 border border-dark-300">
          <div className="flex items-center">
            <div className="p-2 md:p-3 rounded-full bg-green-900 bg-opacity-30">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm font-medium text-light-400">Repeat Customers</p>
              <p id="repeat-customers" className="text-xl md:text-2xl font-semibold text-light-100">
                {repeatCustomers}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-dark-200 rounded-lg shadow-lg p-4 md:p-6 border border-dark-300">
          <div className="flex items-center">
            <div className="p-2 md:p-3 rounded-full bg-purple-900 bg-opacity-30">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm font-medium text-light-400">Avg. Order Value</p>
              <p id="avg-order-value" className="text-xl md:text-2xl font-semibold text-light-100">
                ₹{avgOrderValue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-dark-200 rounded-lg shadow-lg border border-dark-300">
        <div className="px-4 py-3 md:px-6 md:py-4 border-b border-dark-300">
          <h2 className="text-lg md:text-xl font-semibold text-light-100">Customer List</h2>
        </div>
        <div className="p-4 md:p-6">
          {loading ? (
            <div id="customers-loading" className="text-center py-6 md:py-8">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-light"></div>
              <p className="mt-2 text-light-400">Loading customers...</p>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div id="no-customers" className="text-center py-6 md:py-8">
              <div className="text-light-400 mb-3 md:mb-4">
                <svg className="w-12 h-12 md:w-16 md:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-light-200 mb-1 md:mb-2">No Customers Found</h3>
              <p className="text-light-400">No customer data available yet.</p>
            </div>
          ) : (
            <div id="customers-table">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-dark-300">
                  <thead className="bg-dark-300">
                    <tr>
                      <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium text-light-400 uppercase tracking-wider table-header">
                        Customer
                      </th>
                      <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium text-light-400 uppercase tracking-wider table-header">
                        Contact
                      </th>
                      <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium text-light-400 uppercase tracking-wider table-header">
                        Orders
                      </th>
                      <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium text-light-400 uppercase tracking-wider table-header">
                        Total Spent
                      </th>
                      <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium text-light-400 uppercase tracking-wider table-header">
                        Last Order
                      </th>
                      <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium text-light-400 uppercase tracking-wider table-header">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody id="customers-body" className="bg-dark-200 divide-y divide-dark-300">
                    {filteredCustomers.map((cust) => (
                      <tr key={cust.email}>
                        <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap table-cell font-medium text-light-100">
                          {cust.fullName}
                        </td>
                        <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap table-cell">
                          <div className="text-xs md:text-sm text-light-200">{cust.email}</div>
                          <div className="text-xs md:text-sm text-light-400">{cust.whatsappNumber}</div>
                        </td>
                        <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap table-cell text-light-200">
                          {cust.orderCount}
                        </td>
                        <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap table-cell font-semibold text-light-100">
                          ₹{cust.totalSpent.toFixed(2)}
                        </td>
                        <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap table-cell text-light-300">
                          {cust.lastOrderDate ? new Date(cust.lastOrderDate).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium table-cell">
                          <button
                            onClick={() => setSelectedCustomer(cust)}
                            className="text-primary-light hover:text-primary-dark"
                          >
                            View
                          </button>
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

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div id="customer-modal" className="fixed inset-0 bg-dark-100 bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="bg-dark-200 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto modal-content border border-dark-300">
            <div className="px-4 py-3 md:px-6 md:py-4 border-b border-dark-300 flex items-center justify-between">
              <h3 className="text-lg md:text-xl font-semibold text-light-100">Customer Details</h3>
              <button onClick={() => setSelectedCustomer(null)} className="text-light-400 hover:text-light-200">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div id="customer-modal-content" className="p-4 md:p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-light-400">Name</p>
                  <p className="text-sm font-medium text-light-100">{selectedCustomer.fullName}</p>
                </div>
                <div>
                  <p className="text-xs text-light-400">Email</p>
                  <p className="text-sm text-light-200">{selectedCustomer.email}</p>
                </div>
                <div>
                  <p className="text-xs text-light-400">WhatsApp</p>
                  <p className="text-sm text-light-200">{selectedCustomer.whatsappNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-light-400">Total Spent</p>
                  <p className="text-sm font-bold text-primary-light">₹{selectedCustomer.totalSpent.toFixed(2)}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-light-400">Address</p>
                <p className="text-sm text-light-200">{selectedCustomer.billingAddress || 'N/A'}</p>
              </div>
              <div className="pt-4 border-t border-dark-300">
                <h4 className="text-xs font-semibold text-light-400 uppercase mb-2">Orders History</h4>
                <div className="space-y-2">
                  {selectedCustomer.orders.map((o) => (
                    <div key={o.id} className="p-3 bg-dark-300 rounded-lg flex justify-between items-center text-xs">
                      <div>
                        <span className="font-semibold text-light-100 block">
                          {(o.product as any)?.title || 'Digital Product'}
                        </span>
                        <span className="text-light-400">
                          {o.created_at ? new Date(o.created_at).toLocaleDateString() : 'N/A'} • {o.id.substring(0, 8)}...
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-light-100 block">₹{o.final_amount}</span>
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[10px] ${
                            o.payment_status === 'completed' ? 'text-green-300' : 'text-yellow-300'
                          }`}
                        >
                          {o.payment_status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
