'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Coupon } from '@/types/database';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  // Form states
  const [code, setCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [maxUses, setMaxUses] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [isActive, setIsActive] = useState(true);

  async function loadCoupons() {
    try {
      const res = await fetch('/api/coupons');
      if (res.ok) setCoupons(await res.json());
    } catch (err) {
      console.error('Error fetching coupons:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCoupons();
  }, []);

  function openAddModal() {
    setEditingCoupon(null);
    setCode('');
    setDiscountPercentage('');
    setMaxUses('');
    setExpiryDate('');
    setIsActive(true);
    setShowModal(true);
  }

  function openEditModal(c: Coupon) {
    setEditingCoupon(c);
    setCode(c.code);
    setDiscountPercentage(String(c.discount_percentage));
    const expiry = c.expiry_date || c.valid_until;
    setExpiryDate(expiry ? expiry.split('T')[0] : '');
    setIsActive(c.is_active);
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        code: code.trim().toUpperCase(),
        discount_percentage: Number(discountPercentage),
        max_uses: maxUses ? Number(maxUses) : null,
        expiry_date: expiryDate ? new Date(expiryDate).toISOString() : null,
        is_active: isActive,
      };

      if (editingCoupon) {
        const res = await fetch(`/api/coupons/${editingCoupon.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || 'Failed to update coupon');
        }
      } else {
        const res = await fetch('/api/coupons', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || 'Failed to create coupon');
        }
      }

      setShowModal(false);
      loadCoupons();
    } catch (err: any) {
      alert(err.message || 'Error saving coupon');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      const res = await fetch(`/api/coupons/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCoupons(coupons.filter((c) => c.id !== id));
      } else {
        alert('Failed to delete coupon');
      }
    } catch (err) {
      console.error(err);
    }
  }

  const activeCount = coupons.filter((c) => c.is_active).length;
  const totalUsage = coupons.reduce((sum, c) => sum + (c.current_usage_count ?? c.used_count ?? 0), 0);

  return (
    <AdminLayout>
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-light-100 header-text">Coupon Management</h1>
          <p className="text-light-400 text-sm md:text-base">Create and manage discount coupons</p>
        </div>
        <button
          onClick={openAddModal}
          id="add-coupon-btn"
          className="bg-gradient-to-r from-primary-light to-primary-dark text-white px-4 py-2 md:px-6 md:py-3 rounded-lg hover:shadow-glow transition-all text-sm md:text-base font-medium"
        >
          Create New Coupon
        </button>
      </div>

      {/* Coupon Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8 stats-grid">
        <div className="bg-dark-200 rounded-lg shadow-lg p-4 md:p-6 border border-dark-300">
          <div className="flex items-center">
            <div className="p-2 md:p-3 rounded-full bg-blue-900 bg-opacity-30">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
              </svg>
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm font-medium text-light-400">Total Coupons</p>
              <p id="total-coupons" className="text-xl md:text-2xl font-semibold text-light-100">{coupons.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-dark-200 rounded-lg shadow-lg p-4 md:p-6 border border-dark-300">
          <div className="flex items-center">
            <div className="p-2 md:p-3 rounded-full bg-green-900 bg-opacity-30">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm font-medium text-light-400">Active Coupons</p>
              <p id="active-coupons" className="text-xl md:text-2xl font-semibold text-light-100">{activeCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-dark-200 rounded-lg shadow-lg p-4 md:p-6 border border-dark-300">
          <div className="flex items-center">
            <div className="p-2 md:p-3 rounded-full bg-purple-900 bg-opacity-30">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm font-medium text-light-400">Total Usage</p>
              <p id="total-usage" className="text-xl md:text-2xl font-semibold text-light-100">{totalUsage}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-dark-200 rounded-lg shadow-lg border border-dark-300">
        <div className="px-4 py-3 md:px-6 md:py-4 border-b border-dark-300">
          <h2 className="text-lg md:text-xl font-semibold text-light-100">Coupons</h2>
        </div>
        <div className="p-4 md:p-6">
          {loading ? (
            <div id="coupons-loading" className="text-center py-6 md:py-8">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-light"></div>
              <p className="mt-2 text-light-400">Loading coupons...</p>
            </div>
          ) : coupons.length === 0 ? (
            <div id="no-coupons" className="text-center py-6 md:py-8">
              <div className="text-light-400 mb-3 md:mb-4">
                <svg className="w-12 h-12 md:w-16 md:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-light-200 mb-1 md:mb-2">No Coupons Found</h3>
              <p className="text-light-400">Start by creating your first discount coupon.</p>
            </div>
          ) : (
            <div id="coupons-table">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-dark-300">
                  <thead className="bg-dark-300">
                    <tr>
                      <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium text-light-400 uppercase tracking-wider table-header">
                        Code
                      </th>
                      <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium text-light-400 uppercase tracking-wider table-header">
                        Discount
                      </th>
                      <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium text-light-400 uppercase tracking-wider table-header">
                        Usage
                      </th>
                      <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium text-light-400 uppercase tracking-wider table-header">
                        Expiry
                      </th>
                      <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium text-light-400 uppercase tracking-wider table-header">
                        Status
                      </th>
                      <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium text-light-400 uppercase tracking-wider table-header">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody id="coupons-body" className="bg-dark-200 divide-y divide-dark-300">
                    {coupons.map((coupon) => (
                      <tr key={coupon.id}>
                        <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap table-cell font-mono font-bold text-light-100">
                          {coupon.code}
                        </td>
                        <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap table-cell text-primary-light font-semibold">
                          {coupon.discount_percentage}% OFF
                        </td>
                        <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap table-cell text-light-200">
                          {coupon.current_usage_count ?? coupon.used_count ?? 0} / {coupon.max_uses ? coupon.max_uses : 'Unlimited'}
                        </td>
                        <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap table-cell text-light-300">
                          {coupon.valid_until || coupon.expiry_date
                            ? new Date(coupon.valid_until || coupon.expiry_date!).toLocaleDateString()
                            : 'Never'}
                        </td>
                        <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap table-cell">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              coupon.is_active ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                            }`}
                          >
                            {coupon.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium table-cell">
                          <button
                            onClick={() => openEditModal(coupon)}
                            className="text-primary-light hover:text-primary-dark mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(coupon.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            Delete
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

      {/* Coupon Modal */}
      {showModal && (
        <div id="coupon-modal" className="fixed inset-0 bg-dark-100 bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="bg-dark-200 rounded-lg shadow-xl max-w-lg w-full p-6 border border-dark-300 modal-content">
            <div className="flex items-center justify-between pb-4 border-b border-dark-300 mb-4">
              <h3 className="text-lg md:text-xl font-semibold text-light-100">
                {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-light-400 hover:text-light-200">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-light-200 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SAVE20"
                  className="w-full px-3 py-2 bg-dark-300 border border-dark-400 rounded-lg text-light-200 uppercase focus:outline-none focus:ring-2 focus:ring-primary-light"
                />
              </div>

              <div>
                <label className="block text-sm text-light-200 mb-1">Discount Percentage (%) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="100"
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(e.target.value)}
                  placeholder="20"
                  className="w-full px-3 py-2 bg-dark-300 border border-dark-400 rounded-lg text-light-200 focus:outline-none focus:ring-2 focus:ring-primary-light"
                />
              </div>

              <div>
                <label className="block text-sm text-light-200 mb-1">Max Uses (Leave empty for unlimited)</label>
                <input
                  type="number"
                  min="1"
                  value={maxUses}
                  onChange={(e) => setMaxUses(e.target.value)}
                  placeholder="100"
                  className="w-full px-3 py-2 bg-dark-300 border border-dark-400 rounded-lg text-light-200 focus:outline-none focus:ring-2 focus:ring-primary-light"
                />
              </div>

              <div>
                <label className="block text-sm text-light-200 mb-1">Expiry Date (Leave empty for no expiry)</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-300 border border-dark-400 rounded-lg text-light-200 focus:outline-none focus:ring-2 focus:ring-primary-light"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="couponActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-dark-400 rounded bg-dark-300"
                />
                <label htmlFor="couponActive" className="ml-2 block text-sm text-light-300">
                  Coupon is Active
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-dark-300">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-dark-400 rounded-lg text-light-300 hover:bg-dark-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
