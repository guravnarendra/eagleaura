'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Product } from '@/types/database';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [digitalFile, setDigitalFile] = useState<File | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [uploadStatus, setUploadStatus] = useState('');

  async function loadProducts() {
    setLoading(true);
    try {
      const res = await fetch('/api/products?all=true');
      if (res.ok) {
        setProducts(await res.json());
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function openAddModal() {
    setEditingProduct(null);
    setTitle('');
    setDescription('');
    setOriginalPrice('');
    setDiscountedPrice('');
    setThumbnailFile(null);
    setDigitalFile(null);
    setIsActive(true);
    setUploadStatus('');
    setShowModal(true);
  }

  function openEditModal(prod: Product) {
    setEditingProduct(prod);
    setTitle(prod.title);
    setDescription(prod.description);
    setOriginalPrice(String(prod.original_price));
    setDiscountedPrice(String(prod.discounted_price));
    setThumbnailFile(null);
    setDigitalFile(null);
    setIsActive(prod.is_active ?? true);
    setUploadStatus('');
    setShowModal(true);
  }

  async function uploadToSupabase(file: File, bucket: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', bucket);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'File upload failed');
    }

    const data = await res.json();
    return data.url;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setUploadStatus('Processing...');

    try {
      let thumbnailUrl = editingProduct ? editingProduct.thumbnail_url : '';
      let digitalFileUrl = editingProduct ? editingProduct.digital_file_url : '';

      if (thumbnailFile) {
        setUploadStatus('Uploading thumbnail to Supabase...');
        thumbnailUrl = await uploadToSupabase(thumbnailFile, 'product-thumbnails');
      }

      if (digitalFile) {
        setUploadStatus('Uploading product file to Supabase...');
        digitalFileUrl = await uploadToSupabase(digitalFile, 'product-files');
      }

      if (!thumbnailUrl || !digitalFileUrl) {
        alert('Thumbnail and digital product file are required.');
        setSubmitting(false);
        return;
      }

      setUploadStatus('Saving product details in Supabase...');

      if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            description,
            original_price: Number(originalPrice),
            discounted_price: Number(discountedPrice),
            thumbnail_url: thumbnailUrl,
            digital_file_url: digitalFileUrl,
            is_active: isActive,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || 'Failed to update product');
        }
      } else {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            description,
            original_price: Number(originalPrice),
            discounted_price: Number(discountedPrice),
            thumbnail_url: thumbnailUrl,
            digital_file_url: digitalFileUrl,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || 'Failed to create product');
        }
      }

      setShowModal(false);
      loadProducts();
    } catch (err: any) {
      alert(err.message || 'An error occurred');
    } finally {
      setSubmitting(false);
      setUploadStatus('');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
      } else {
        alert('Failed to delete product');
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <AdminLayout>
      <div className="mb-6 md:mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-light-100 header-text">Product Management</h1>
          <p className="text-light-400 text-sm md:text-base">Add, edit, and manage your digital products</p>
        </div>
        <button
          onClick={openAddModal}
          id="add-product-btn"
          className="bg-primary text-white px-4 py-2 md:px-6 md:py-3 rounded-lg hover:bg-primary-dark transition-colors text-sm md:text-base font-medium"
        >
          Add New Product
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-dark-200 rounded-lg shadow-lg border border-dark-300">
        <div className="px-4 py-3 md:px-6 md:py-4 border-b border-dark-300">
          <h2 className="text-lg md:text-xl font-semibold text-light-100">Products</h2>
        </div>
        <div className="p-4 md:p-6">
          {loading ? (
            <div id="products-loading" className="text-center py-6 md:py-8">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-light"></div>
              <p className="mt-2 text-light-400">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div id="no-products" className="text-center py-6 md:py-8">
              <div className="text-light-400 mb-3 md:mb-4">
                <svg className="w-12 h-12 md:w-16 md:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-light-200 mb-1 md:mb-2">No Products Found</h3>
              <p className="text-light-400 mb-4">Start by adding your first digital product.</p>
              <button
                onClick={openAddModal}
                id="add-product-empty-btn"
                className="bg-primary text-white px-4 py-2 md:px-6 md:py-2 rounded-lg hover:bg-primary-dark transition-colors text-sm md:text-base"
              >
                Add Product
              </button>
            </div>
          ) : (
            <div id="products-table">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-dark-300">
                  <thead className="bg-dark-300">
                    <tr>
                      <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium text-light-400 uppercase tracking-wider table-header">
                        Product
                      </th>
                      <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium text-light-400 uppercase tracking-wider table-header">
                        Pricing
                      </th>
                      <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium text-light-400 uppercase tracking-wider table-header">
                        Status
                      </th>
                      <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium text-light-400 uppercase tracking-wider table-header">
                        Created
                      </th>
                      <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium text-light-400 uppercase tracking-wider table-header">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody id="products-body" className="bg-dark-200 divide-y divide-dark-300">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap table-cell">
                          <div className="flex items-center">
                            <img
                              src={product.thumbnail_url}
                              alt={product.title}
                              className="w-10 h-10 object-cover rounded mr-3 border border-dark-400"
                            />
                            <div>
                              <div className="text-xs md:text-sm font-medium text-light-100">{product.title}</div>
                              <div className="text-xs md:text-sm text-light-400 truncate max-w-xs">{product.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap table-cell">
                          <div>
                            <div className="text-xs md:text-sm font-medium text-light-100">₹{product.discounted_price}</div>
                            {product.discount_percentage ? (
                              <div className="text-xs md:text-sm text-light-400 line-through">
                                ₹{product.original_price} ({product.discount_percentage}% off)
                              </div>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap table-cell">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              product.is_active !== false ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                            }`}
                          >
                            {product.is_active !== false ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap table-cell">
                          <div className="text-xs md:text-sm text-light-200">
                            {product.created_at ? new Date(product.created_at).toLocaleDateString() : 'N/A'}
                          </div>
                        </td>
                        <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium table-cell">
                          <button
                            onClick={() => openEditModal(product)}
                            className="text-primary-light hover:text-primary-dark mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
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

      {/* Product Modal */}
      {showModal && (
        <div id="product-modal" className="fixed inset-0 bg-dark-100 bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="bg-dark-200 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto modal-content border border-dark-300">
            <div className="px-4 py-3 md:px-6 md:py-4 border-b border-dark-300 flex items-center justify-between">
              <h3 id="modal-title" className="text-lg md:text-xl font-semibold text-light-100">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-light-400 hover:text-light-200">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div className="p-4 md:p-6">
              <form id="product-form" className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="title" className="block text-sm md:text-base font-medium text-light-200 mb-2">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-dark-300 border border-dark-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent text-light-200"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm md:text-base font-medium text-light-200 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-dark-300 border border-dark-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent text-light-200"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="originalPrice" className="block text-sm md:text-base font-medium text-light-200 mb-2">
                      Original Price (₹) *
                    </label>
                    <input
                      type="number"
                      id="originalPrice"
                      name="originalPrice"
                      required
                      min="0"
                      step="0.01"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      className="w-full px-3 py-2 bg-dark-300 border border-dark-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent text-light-200"
                    />
                  </div>

                  <div>
                    <label htmlFor="discountedPrice" className="block text-sm md:text-base font-medium text-light-200 mb-2">
                      Discounted Price (₹) *
                    </label>
                    <input
                      type="number"
                      id="discountedPrice"
                      name="discountedPrice"
                      required
                      min="0"
                      step="0.01"
                      value={discountedPrice}
                      onChange={(e) => setDiscountedPrice(e.target.value)}
                      className="w-full px-3 py-2 bg-dark-300 border border-dark-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent text-light-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm md:text-base font-medium text-light-200 mb-2">
                    Thumbnail Image {editingProduct ? '(Leave empty to keep existing)' : '*'}
                  </label>
                  <input
                    type="file"
                    id="thumbnail"
                    name="thumbnail"
                    accept="image/*"
                    required={!editingProduct}
                    onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 bg-dark-300 border border-dark-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent text-light-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm md:text-base font-medium text-light-200 mb-2">
                    Product Digital File (Zip/PDF) {editingProduct ? '(Leave empty to keep existing)' : '*'}
                  </label>
                  <input
                    type="file"
                    id="productFile"
                    name="productFile"
                    required={!editingProduct}
                    onChange={(e) => setDigitalFile(e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 bg-dark-300 border border-dark-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent text-light-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-primary border-dark-400 rounded bg-dark-300"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-light-300">
                    Product is Active
                  </label>
                </div>

                {uploadStatus && (
                  <div className="p-3 bg-primary/20 border border-primary/40 rounded-lg text-primary-light text-xs">
                    {uploadStatus}
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4 border-t border-dark-300">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    disabled={submitting}
                    className="px-4 py-2 border border-dark-400 rounded-lg text-light-300 hover:bg-dark-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : 'Save Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
