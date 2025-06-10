import React from "react";

const NewsLetter = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-2 pt-8 pb-14">
      <h1 className="md:text-4xl text-2xl font-semibold text-gray-800">
        Join Hamro eShop & Get 20% Off!
      </h1>
      <p className="md:text-base text-sm text-gray-500/80 pb-8 max-w-xl">
        Subscribe to our newsletter for exclusive deals, updates, and special offers from Hamro eShop.
      </p>
      <div className="flex items-center justify-between max-w-2xl w-full md:h-14 h-12 px-4">
        <input
          className="border border-gray-300 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-600"
          type="email"
          placeholder="Enter your email address"
        />
        <button className="md:px-10 px-6 h-full text-white bg-orange-600 rounded-md rounded-l-none hover:bg-orange-700 transition-colors">
          Subscribe
        </button>
      </div>
    </div>
  );
};

export default NewsLetter;
