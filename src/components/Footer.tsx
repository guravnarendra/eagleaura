import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-dark-400 text-light-300 py-8 border-t border-dark-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 footer-grid">
          <div className="footer-section">
            <h3 className="text-lg font-bold mb-3 text-light-100 font-heading">Eagle Aura</h3>
            <p className="mb-4 text-sm md:text-base">Premium digital templates and creative resources.</p>
            <div className="flex space-x-4 footer-social items-center">
              <a
                href="https://www.instagram.com/eagle.aura07"
                className="text-light-400 hover:text-pink-500 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <Link href="/admin/login" className="text-xs text-dark-400 hover:text-light-400 transition-colors ml-2">
                Admin
              </Link>
            </div>
          </div>
          <div className="footer-section">
            <h4 className="text-base font-semibold mb-3 text-light-100 font-heading">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="hover:text-primary-light transition-colors text-sm md:text-base">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary-light transition-colors text-sm md:text-base">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-light-100 font-heading">Policies</h4>
            <ul className="space-y-1 md:space-y-2">
              <li>
                <Link href="/privacy" className="text-light-400 hover:text-primary-light transition-colors text-sm md:text-base">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-light-400 hover:text-primary-light transition-colors text-sm md:text-base">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-light-400 hover:text-primary-light transition-colors text-sm md:text-base">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-light-400 hover:text-primary-light transition-colors text-sm md:text-base">
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4 className="text-base font-semibold mb-3 text-light-100 font-heading">Contact Info</h4>
            <p className="mb-2 text-sm md:text-base">Email: eagleaura09@gmail.com</p>
            <p className="text-sm md:text-base">24/7 Support</p>
          </div>
        </div>
        <div className="border-t border-dark-300 mt-6 pt-6 text-center text-sm">
          <p>&copy; 2025 Eagle Aura. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
