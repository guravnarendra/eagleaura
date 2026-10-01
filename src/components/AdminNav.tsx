'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Tag, ArrowLeft } from 'lucide-react';

export default function AdminNav() {
  const pathname = usePathname();

  const links = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/admin/coupons', label: 'Coupons', icon: Tag },
  ];

  return (
    <div className="bg-dark-200 border-b border-dark-300 py-3 px-4 sm:px-6 mb-8">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-light-400 hover:text-light-100 p-1.5 rounded-lg border border-dark-400">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="font-bold text-light-100 font-heading text-sm sm:text-base">Admin Panel</span>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-3 overflow-x-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium flex items-center space-x-1.5 transition-colors ${
                  active
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-light-400 hover:text-light-200 hover:bg-dark-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
