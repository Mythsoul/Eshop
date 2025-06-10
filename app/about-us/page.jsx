'use client'

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheck, CreditCard, Star, Truck, Headphones, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.15, type: "spring", stiffness: 100 },
  }),
};

const About = () => {
  const cards = [
    {
      icon: <ShieldCheck className="mx-auto mb-3 text-orange-500" size={40} />,
      title: "Trustworthy",
      desc: "We are dedicated to honesty, reliability, and transparency in everything we do.",
    },
    {
      icon: <CreditCard className="mx-auto mb-3 text-orange-500" size={40} />,
      title: "Secure Payments",
      desc: "Your payment and data are fully protected with advanced security systems.",
    },
    {
      icon: <Star className="mx-auto mb-3 text-orange-500" size={40} />,
      title: "Quality Products",
      desc: "Only genuine and verified items from trusted sellers across Nepal.",
    },
    {
      icon: <Truck className="mx-auto mb-3 text-orange-500" size={40} />,
      title: "Fast Delivery",
      desc: "We deliver across Nepal quickly and safely, right to your doorstep.",
    },
    {
      icon: <Headphones className="mx-auto mb-3 text-orange-500" size={40} />,
      title: "Customer Support",
      desc: "Friendly support team ready to help with any questions or concerns.",
    },
    {
      icon: <DollarSign className="mx-auto mb-3 text-orange-500" size={40} />,
      title: "Transparent Pricing",
      desc: "We believe in clear, upfront prices with no hidden fees — what you see is what you pay.",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-12 lg:px-20 py-12 bg-gradient-to-br from-white to-orange-50 min-h-screen">
        {/* Page Title */}
        <div className="mb-8 text-center">
          <p className="text-3xl md:text-4xl font-extrabold text-orange-600 tracking-wide drop-shadow-md">
            About Hamro eShop
          </p>
          <div className="w-20 h-1 bg-orange-500 rounded-full mx-auto mt-2 shadow-lg"></div>
        </div>

        {/* Intro */}
        <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-xl p-8 sm:p-10 text-gray-800 space-y-6 text-lg leading-relaxed">
          <p>
            Welcome to <span className="font-semibold text-orange-600">Hamro eShop</span> — an online marketplace where quality, affordability, and exceptional service come together.
          </p>
          <p>
            Our platform is designed to simplify your shopping experience by connecting you with genuine products and ensuring seamless delivery. Whether you’re searching for electronics, fashion, or everyday essentials, we’ve got you covered.
          </p>
          <p>
            At Hamro eShop, we don’t just sell products — we are committed to serving you. Your satisfaction and trust are our highest priorities.
          </p>
        </div>

        {/* Why Choose Us */}
        <div className="max-w-5xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-center text-orange-600 mb-6">Why Choose Us?</h2>

          {/* Mobile 3 rows layout */}
          <div className="md:hidden space-y-8">

            {/* First 4 cards: 2 columns grid */}
            <div className="grid grid-cols-2 gap-6">
              {cards.slice(0, 4).map((item, i) => (
                <motion.div
                  key={item.title}
                  className="p-6 bg-white border border-gray-200 rounded-xl shadow hover:shadow-orange-200 transition cursor-pointer"
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={cardVariants}
                >
                  {item.icon}
                  <h3 className="text-xl font-semibold mb-2 text-gray-700">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Last 2 cards: stacked vertically */}
            <div className="space-y-6">
              {cards.slice(4, 6).map((item, i) => (
                <motion.div
                  key={item.title}
                  className="p-6 bg-white border border-gray-200 rounded-xl shadow hover:shadow-orange-200 transition cursor-pointer"
                  custom={i + 4}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={cardVariants}
                >
                  {item.icon}
                  <h3 className="text-xl font-semibold mb-2 text-gray-700">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Desktop and tablet (md+) layout */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
            {cards.map((item, i) => (
              <motion.div
                key={item.title}
                className="p-6 bg-white border border-gray-200 rounded-xl shadow hover:shadow-orange-200 transition cursor-pointer"
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={cardVariants}
              >
                {item.icon}
                <h3 className="text-xl font-semibold mb-2 text-gray-700">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;
