'use client'

import React, { useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const form = useRef();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    emailjs.sendForm(
      'service_tnbvvb6',
      'template_axr0n9t',
      form.current,
      'DFAbCJPUHm3j6PS8y'
    )
      .then(() => {
        setSuccess("✅ Message sent successfully!");
        setLoading(false);
        e.target.reset();
      })
      .catch((err) => {
        console.error("❌ EmailJS Error:", err);
        setError("❌ Failed to send message. Please try again.");
        setLoading(false);
      });
  };

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-12 lg:px-20 py-12 bg-gradient-to-br from-white to-orange-50 min-h-screen">
        <div className="mb-8 text-center">
          <p className="text-3xl md:text-4xl font-extrabold text-orange-600 tracking-wide drop-shadow-md">
            Contact Us
          </p>
          <div className="w-20 h-1 bg-orange-500 rounded-full mx-auto mt-2 shadow-lg"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 max-w-4xl mx-auto">
          
          {/* Contact Form */}
          <div className="flex-1 w-full max-w-sm mx-auto px-4 sm:px-6 bg-white border border-gray-300 rounded-2xl shadow-xl p-5 sm:p-8 hover:shadow-orange-300 transition-shadow duration-500">

            <form ref={form} onSubmit={sendEmail} className="space-y-6">
              <div>
                <label htmlFor="user_name" className="block mb-2 text-lg font-semibold text-gray-700">Name</label>
                <input
                  type="text"
                  id="user_name"
                  name="user_name"
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent shadow-sm transition"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="user_email" className="block mb-2 text-lg font-semibold text-gray-700">Email</label>
                <input
                  type="email"
                  id="user_email"
                  name="user_email"
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent shadow-sm transition"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block mb-2 text-lg font-semibold text-gray-700">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent shadow-sm resize-none transition"
                  placeholder="Write your message here..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full text-white font-bold text-lg rounded-lg py-3 ${
                  loading
                    ? "bg-orange-300 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600"
                } transition`}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>

              {success && <p className="text-green-600 font-semibold mt-4 text-center">{success}</p>}
              {error && <p className="text-red-600 font-semibold mt-4 text-center">{error}</p>}
            </form>
          </div>

          {/* Contact Info */}
          <div className="flex-1 max-w-sm bg-orange-50 border border-orange-300 rounded-2xl shadow-lg p-8 space-y-6
          lg:mt-0 mt-10 mx-auto lg:mx-0 lg:text-left text-center pl-6 sm:pl-10">

            <h2 className="text-2xl md:text-3xl font-bold text-orange-600 mb-4 text-center lg:text-left">Get in Touch</h2>

            <div>
              <p className="font-semibold text-orange-700 flex items-center gap-2 text-lg">
                <span>📞</span> Phone:
              </p>
              <p className="text-orange-900 text-base">+977 9828086387</p>
              <p className="text-orange-900 text-base">+977 9840186285</p>
            </div>

            <div>
              <p className="font-semibold text-orange-700 flex items-center gap-2 text-lg">
                <span>📧</span> Email:
              </p>
              <p className="text-orange-900 text-base">service.eshopnepal@gmail.com</p>
            </div>

            <div>
              <p className="font-semibold text-orange-700 flex items-center gap-2 text-lg">
                <span>🏠</span> Address:
              </p>
              <p className="text-orange-900 text-base">Kathmandu, Nepal</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
