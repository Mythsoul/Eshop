'use client';
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-12 bg-white shadow-md rounded-md my-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b-4 border-green-600 pb-3">
          Privacy Policy
        </h1>

        <p className="text-gray-700 leading-relaxed mb-8 text-lg">
          Welcome to <strong className="text-green-700">Hamro eShop</strong>. Your privacy matters to us. This Privacy Policy outlines how we collect, use, and protect your personal information.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
          <p className="text-gray-600 leading-relaxed">
            We collect your name, email, phone number, shipping address, and order history to process orders and improve your experience.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
          <p className="text-gray-600 leading-relaxed">
            Your information is used strictly for order fulfillment, customer service, and service improvement. We do not sell or rent your data.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. Our Product Sourcing Model</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We operate a hybrid model:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
            <li><strong className="text-green-700">Dropshipping:</strong> For some products, orders are forwarded to trusted suppliers like Daraz who ship directly to you.</li>
            <li><strong className="text-green-700">Offline Stores:</strong> Other products are stocked and shipped by us directly from our physical stores, ensuring timely delivery and quality.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Sharing Your Information</h2>
          <p className="text-gray-600 leading-relaxed">
            We only share your data with trusted partners like payment processors and shipping providers for order fulfillment. Your data remains confidential.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Data Security</h2>
          <p className="text-gray-600 leading-relaxed">
            We implement robust security measures to protect your information but remind you that no internet system is fully secure.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Your Consent</h2>
          <p className="text-gray-600 leading-relaxed">
            By using our services, you agree to this Privacy Policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Changes to This Policy</h2>
          <p className="text-gray-600 leading-relaxed">
            We may update this policy; changes will be posted here. Continued use means acceptance.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Contact Us</h2>
          <p className="text-gray-600 leading-relaxed">
            Questions? Reach out at{' '}
            <a href="mailto:service.eshopnepal@gmail.com" className="text-green-600 underline hover:text-green-800 transition">
              service.eshopnepal@gmail.com
            </a>.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
