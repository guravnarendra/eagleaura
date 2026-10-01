'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  const faqs = [
    {
      q: 'How do I download my purchased products?',
      a: "After completing your purchase, you'll receive an email with download links. You can also access your products anytime on the thank-you page.",
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept UPI, RuPay, debit/credit cards, net banking, and international payment options via Dodo Payments.',
    },
    {
      q: 'Can I get a refund for digital products?',
      a: "Due to the nature of digital downloads, sales are generally final once downloaded. However, if you face any technical problems with your files, contact us and we'll resolve it.",
    },
  ];

  return (
    <div>
      {/* Contact Hero Section */}
      <section className="bg-gradient-to-r from-primary-light to-primary-dark text-white py-12 border-b border-dark-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 font-heading policy-title">Contact Eagle Aura</h1>
          <p className="text-lg md:text-xl mb-4 text-light-200">
            We&apos;d love to hear from you! Reach out with questions, feedback, or partnership opportunities.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 bg-dark-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-dark-200 rounded-lg shadow-md p-4 sm:p-6 border border-dark-300 policy-content">
            <h2 className="text-xl md:text-2xl font-bold text-light-100 mb-4 font-heading section-title">
              Send us a message
            </h2>

            {submitted ? (
              <div className="p-4 bg-green-900/30 border border-green-700 text-green-300 rounded-lg text-sm">
                Thank you for your message! We will get back to you shortly at {email}.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-light-300 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 border border-dark-400 rounded-lg focus:ring-primary focus:border-primary bg-dark-300 text-light-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-light-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-dark-400 rounded-lg focus:ring-primary focus:border-primary bg-dark-300 text-light-200"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-light-300 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2 border border-dark-400 rounded-lg focus:ring-primary focus:border-primary bg-dark-300 text-light-200"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-light-300 mb-1">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2 border border-dark-400 rounded-lg focus:ring-primary focus:border-primary bg-dark-300 text-light-200"
                  ></textarea>
                </div>

                <div>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-primary-light to-primary-dark text-white px-6 py-3 rounded-lg font-semibold hover:shadow-glow transition-all duration-300"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-12 bg-dark-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-light-100 mb-2 font-heading section-title">
              Other Ways to Reach Us
            </h2>
            <p className="text-light-300">Choose whichever method is most convenient for you</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-dark-300 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-dark-400">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-1 text-light-100">Email Us</h3>
              <p className="text-light-300 mb-1">eagleaura09@gmail.com</p>
              <p className="text-xs text-light-400">Typically responds within 24 hours</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-dark-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-light-100 mb-2 font-heading section-title">
              Frequently Asked Questions
            </h2>
            <p className="text-light-300">Find quick answers to common questions below</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-dark-400 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex justify-between items-center p-3 text-left bg-dark-300 hover:bg-dark-400 transition-colors"
                >
                  <span className="font-medium text-light-100">{faq.q}</span>
                  <svg
                    className={`w-5 h-5 text-light-400 transform transition-transform ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                {openFaq === idx && (
                  <div className="p-3 border-t border-dark-400 bg-dark-300">
                    <p className="text-light-300 text-sm">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
