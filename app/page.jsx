'use client';
import React from "react";
import HeaderSlider from "@/components/HeaderSlider";
import HomeProducts from "@/components/HomeProducts";
import Banner from "@/components/Banner";
import NewsLetter from "@/components/NewsLetter";
import FeaturedProduct from "@/components/FeaturedProduct";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileNavBar from "@/components/MobileNavBar"; // ✅ IMPORT THIS

const Home = () => {
  return (
    <div className="relative pb-16"> {/* Ensure padding-bottom so content doesn't hide behind fixed navbar */}
      <Navbar />

      <div className="px-6 md:px-16 lg:px-32">
        <HeaderSlider />
        <HomeProducts />
        <FeaturedProduct />
        <Banner />
        <NewsLetter />
      </div>

      <Footer />

      <MobileNavBar /> {/* ✅ Fixed Bottom Navbar for Mobile */}
    </div>
  );
};

export default Home;
