export default function ShippingPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <div className="bg-dark-200 rounded-lg shadow-md p-4 sm:p-6 border border-dark-300 policy-content">
        <h1 className="text-2xl md:text-3xl font-bold text-light-100 mb-4 md:mb-6 font-heading policy-title">
          Shipping Policy
        </h1>

        <div className="text-light-300 space-y-6">
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-light-100 mb-3 font-heading section-title">
              Digital Delivery
            </h2>
            <p className="mb-3">
              Since all our products are digital, there is no physical shipping involved. After completing your
              purchase, you&apos;ll receive instant access to download your digital products.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-light-100 mb-3 font-heading section-title">
              Delivery Timeframe
            </h2>
            <p className="mb-3">
              All digital products are available for immediate download after payment confirmation. You will
              receive:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Instant access to your downloads on the confirmation page</li>
              <li>A download link sent to your email address</li>
              <li>Access to your downloads in your account dashboard (if you created an account)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-light-100 mb-3 font-heading section-title">
              Download Instructions
            </h2>
            <p className="mb-3">To access your purchased digital products:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Complete your purchase successfully</li>
              <li>Check your email for the download link (may take a few minutes)</li>
              <li>Click the download link to save the files to your device</li>
              <li>If you encounter any issues, contact our support team at eagleaura09@gmail.com</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-light-100 mb-3 font-heading section-title">
              Troubleshooting
            </h2>
            <p className="mb-3">If you don&apos;t receive your download links:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Check your spam/junk folder</li>
              <li>Ensure you entered the correct email address during checkout</li>
              <li>Wait 15 minutes in case of processing delays</li>
              <li>Contact our support team with your order details</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-light-100 mb-3 font-heading section-title">
              License & Usage
            </h2>
            <p>
              All digital products are licensed for personal or commercial use as specified in the product
              description. Redistribution or resale of our digital products is strictly prohibited.
            </p>
          </section>

          <div className="pt-4 border-t border-dark-300">
            <p className="text-light-400 text-sm">Last updated: June 15, 2024</p>
          </div>
        </div>
      </div>
    </main>
  );
}
