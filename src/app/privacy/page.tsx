export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <div className="bg-dark-200 rounded-lg shadow-md p-4 sm:p-6 border border-dark-300 policy-content">
        <h1 className="text-2xl md:text-3xl font-bold text-light-100 mb-4 md:mb-6 font-heading policy-title">
          Privacy Policy
        </h1>

        <div className="text-light-300 space-y-6">
          <p className="text-light-400 text-sm">
            Last updated: <strong className="text-light-100">June 15, 2024</strong>
          </p>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-light-100 mb-3 font-heading section-title">
              1. Information We Collect
            </h2>
            <p>When you make a purchase from Eagle Aura, we collect the following information:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Full name</li>
              <li>Email address</li>
              <li>WhatsApp number</li>
              <li>Billing address</li>
              <li>Payment information (processed securely through Dodo Payments)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-light-100 mb-3 font-heading section-title">
              2. How We Use Your Information
            </h2>
            <p className="mb-3">We use the collected information for the following purposes:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Processing and fulfilling your orders</li>
              <li>Sending download links and order confirmations via email</li>
              <li>Providing customer support</li>
              <li>Communicating important updates about your purchases</li>
              <li>Improving our services and user experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-light-100 mb-3 font-heading section-title">
              3. Information Sharing
            </h2>
            <p className="mb-3">
              We do not sell, trade, or otherwise transfer your personal information to third parties, except:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Payment processing through Dodo Payments (secure payment gateway)</li>
              <li>Email delivery services for sending download links</li>
              <li>When required by law or to protect our rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-light-100 mb-3 font-heading section-title">
              4. Data Security
            </h2>
            <p>
              We implement appropriate security measures to protect your personal information against unauthorized access,
              alteration, disclosure, or destruction. All payment information is processed securely through Dodo Payments&apos;s
              encrypted payment gateway.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-light-100 mb-3 font-heading section-title">
              5. Data Retention
            </h2>
            <p>
              We retain your personal information for as long as necessary to provide our services and fulfill
              the purposes outlined in this privacy policy. Order information is kept for record-keeping and
              customer support purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-light-100 mb-3 font-heading section-title">
              6. Your Rights
            </h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Access your personal information</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal information</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-light-100 mb-3 font-heading section-title">
              7. Cookies
            </h2>
            <p>
              Our website may use cookies to enhance user experience. Cookies are small files stored on your
              device that help us understand how you use our website and improve our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-light-100 mb-3 font-heading section-title">
              8. Third-Party Services
            </h2>
            <p>
              We use Dodo Payments for payment processing. Please review Dodo Payments&apos;s privacy policy to understand
              how they handle your payment information.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-light-100 mb-3 font-heading section-title">
              9. Changes to This Policy
            </h2>
            <p>
              We may update this privacy policy from time to time. Any changes will be posted on this page
              with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-light-100 mb-3 font-heading section-title">
              10. Contact Us
            </h2>
            <p className="mb-3">
              If you have any questions about this privacy policy or our data practices, please contact us:
            </p>
            <div className="bg-dark-300 rounded-lg p-4 border border-dark-400">
              <p className="text-light-200"><strong>Email:</strong> eagleaura09@gmail.com</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
