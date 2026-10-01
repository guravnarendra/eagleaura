export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <div className="bg-dark-200 rounded-lg shadow-md p-4 sm:p-6 border border-dark-300 policy-content">
        <h1 className="text-2xl md:text-3xl font-bold text-light-100 mb-4 md:mb-6 font-heading policy-title">
          Terms & Conditions
        </h1>

        <div className="text-light-300 space-y-6">
          <p className="text-light-400 text-sm">
            Last updated: <strong className="text-light-100">June 15, 2024</strong>
          </p>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-light-100 mb-3 font-heading section-title">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using Eagle Aura, you accept and agree to be bound by the terms and provisions
              of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-light-100 mb-3 font-heading section-title">
              2. Digital Products
            </h2>
            <p className="mb-3">
              All products sold on Eagle Aura are digital products delivered electronically. By purchasing
              our products, you agree that:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Products are for personal or commercial use as specified in the product description</li>
              <li>You will not redistribute, resell, or share the digital files</li>
              <li>You understand that digital products cannot be returned once downloaded</li>
              <li>Download links are provided immediately after successful payment</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-light-100 mb-3 font-heading section-title">
              3. Payment and Pricing
            </h2>
            <p className="mb-3">
              All payments are processed securely through Dodo Payments. By making a purchase, you agree that:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>All prices are listed in Indian Rupees (INR)</li>
              <li>Payment must be completed before product delivery</li>
              <li>Prices may change without notice</li>
              <li>Coupon codes have terms and expiration dates</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-light-100 mb-3 font-heading section-title">
              4. Refund Policy
            </h2>
            <p className="mb-3">
              Due to the digital nature of our products, all sales are final. Refunds are only provided in
              the following circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Technical issues preventing download within 48 hours of purchase</li>
              <li>Duplicate purchases made in error</li>
              <li>Product significantly different from description</li>
            </ul>
            <p className="mt-3">
              Refund requests must be made within 7 days of purchase and include order details.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-light-100 mb-3 font-heading section-title">
              5. Intellectual Property
            </h2>
            <p className="mb-3">
              All digital products and content on Eagle Aura are protected by copyright and other intellectual
              property laws. You may not:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Copy, modify, or distribute our products without permission</li>
              <li>Reverse engineer or attempt to extract source code</li>
              <li>Remove copyright notices or watermarks</li>
              <li>Claim ownership of our products</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-light-100 mb-3 font-heading section-title">
              6. User Responsibilities
            </h2>
            <p className="mb-3">As a user of Eagle Aura, you agree to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Provide accurate and complete information during purchase</li>
              <li>Use products in accordance with their intended purpose</li>
              <li>Not engage in fraudulent or illegal activities</li>
              <li>Respect the intellectual property rights of others</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-light-100 mb-3 font-heading section-title">
              7. Limitation of Liability
            </h2>
            <p>
              Eagle Aura shall not be liable for any direct, indirect, incidental, special, or consequential
              damages resulting from the use or inability to use our products or services. Our liability is
              limited to the amount paid for the specific product.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-light-100 mb-3 font-heading section-title">
              8. Privacy
            </h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy to understand how we collect,
              use, and protect your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-light-100 mb-3 font-heading section-title">
              9. Modifications
            </h2>
            <p>
              We reserve the right to modify these terms and conditions at any time. Changes will be effective
              immediately upon posting on our website. Continued use of our services constitutes acceptance
              of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-light-100 mb-3 font-heading section-title">
              10. Termination
            </h2>
            <p>
              We may terminate or suspend access to our services immediately, without prior notice, for any
              reason, including breach of these terms and conditions.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-light-100 mb-3 font-heading section-title">
              11. Governing Law
            </h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of India.
              Any disputes shall be subject to the exclusive jurisdiction of the courts in India.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-light-100 mb-3 font-heading section-title">
              12. Contact Information
            </h2>
            <p className="mb-3">
              If you have any questions about these terms and conditions, please contact us:
            </p>
            <div className="bg-dark-300 rounded-lg p-4 border border-dark-400">
              <p><strong>Email:</strong> eagleaura09@gmail.com</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
