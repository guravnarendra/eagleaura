export default function RefundPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <div className="bg-dark-200 rounded-lg shadow-md p-4 sm:p-6 border border-dark-300 policy-content">
        <h1 className="text-2xl md:text-3xl font-bold text-light-100 mb-4 md:mb-6 font-heading policy-title">
          Cancellation & Refund Policy
        </h1>

        <div className="text-light-300 space-y-6">
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-light-100 mb-3 font-heading section-title">
              Refund Policy
            </h2>
            <p className="mb-3">
              Due to the digital nature of our products, we generally don&apos;t offer refunds. Exceptions may be made for:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Products significantly different from description</li>
              <li>Defective or non-functional products</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-light-100 mb-3 font-heading section-title">
              Requesting a Refund
            </h2>
            <p className="mb-3">
              Email us within 7 days at{' '}
              <a href="mailto:eagleaura09@gmail.com" className="text-primary-light hover:underline">
                eagleaura09@gmail.com
              </a>{' '}
              with:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Order number</li>
              <li>Reason for request</li>
              <li>Supporting evidence</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-light-100 mb-3 font-heading section-title">
              Non-Refundable Cases
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Change of mind</li>
              <li>User-side technical issues</li>
              <li>Failure to read product details</li>
              <li>Sale/promotional items</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-light-100 mb-3 font-heading section-title">
              Cancellations
            </h2>
            <p>
              Orders can only be cancelled within 1 hour of purchase if the product hasn&apos;t been downloaded.
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
