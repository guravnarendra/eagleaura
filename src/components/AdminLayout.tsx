'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<string>('admin');

  useEffect(() => {
    // Check auth
    const token = localStorage.getItem('eagle_admin_auth') || localStorage.getItem('adminToken');
    if (!token && pathname !== '/admin/login') {
      router.push('/admin/login');
      return;
    }
    const userStr = localStorage.getItem('adminUser');
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        if (parsed.username) setAdminUser(parsed.username);
      } catch (e) {}
    }
  }, [pathname, router]);

  function handleLogout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('eagle_admin_auth');
    router.push('/admin/login');
  }

  const navItems = [
    {
      href: '/admin/dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0"></path>
        </svg>
      ),
    },
    {
      href: '/admin/products',
      label: 'Products',
      icon: (
        <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
        </svg>
      ),
    },
    {
      href: '/admin/orders',
      label: 'Orders',
      icon: (
        <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
      ),
    },
    {
      href: '/admin/coupons',
      label: 'Coupons',
      icon: (
        <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
        </svg>
      ),
    },
    {
      href: '/admin/customers',
      label: 'Customers',
      icon: (
        <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-dark-100 text-light-200 min-h-screen">
      {/* Top Navigation */}
      <nav className="bg-dark-200 shadow-lg border-b border-dark-300 top-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/admin/dashboard" className="text-xl md:text-2xl font-bold gradient-text">
                Eagle Aura Admin
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-light-300 text-sm md:text-base">Welcome, {adminUser}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg hover:bg-red-700 transition-colors text-sm md:text-base font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="mobile-nav">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mobile-nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="w-6 h-6 mb-1 flex items-center justify-center [&>svg]:w-6 [&>svg]:h-6 [&>svg]:mr-0">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="flex">
        {/* Sidebar (Desktop) */}
        <div className="sidebar bg-dark-200 border-r border-dark-300">
          <nav className="mt-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-4 md:p-8 main-content">
          {children}
        </div>
      </div>
    </div>
  );
}
