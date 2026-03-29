import React from "react";
import { FaRedo } from "react-icons/fa";
import { FaCheck, FaCreditCard, FaTruck } from "react-icons/fa6";

const Features = () => {
  return (
    <section id="why-choose-us" className="py-16 bg-white dark:bg-[#0d0118] dark:text-purple-100">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-center mb-4">
            Why Choose Aether
          </h2>
          <p className="text-gray-600 dark:text-purple-300/80 text-center">
            We provide the best shopping experience with our premium quality
           Arts and all videoes and music you can upload.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-5 gap-x-8">
          <div className="bg-white dark:bg-[#160327] py-5 px-7 rounded-lg shadow-sm border border-slate-100 dark:border-purple-900/40 transition-all hover:shadow-md">
            <div className="text-4xl text-primary mb-4">
              <FaCheck />
            </div>
            <h3 className="font-semibold text-xl mb-2">Quality Products</h3>
            <p className="text-gray-600 dark:text-purple-300/70">
              We provide only the best quality products from the trusted
              suppliers.
            </p>
          </div>
          <div className="bg-white dark:bg-[#160327] py-5 px-7 rounded-lg shadow-sm border border-slate-100 dark:border-purple-900/40 transition-all hover:shadow-md">
            <div className="text-3xl text-primary mb-4">
              <FaTruck />
            </div>
            <h3 className="font-semibold text-xl mb-2">Fast Delivery</h3>
            <p className="text-gray-600 dark:text-purple-300/70">
              Get your orders delivered in your record time.
            </p>
          </div>
          <div className="bg-white dark:bg-[#160327] py-5 px-7 rounded-lg shadow-sm border border-slate-100 dark:border-purple-900/40 transition-all hover:shadow-md">
            <div className="text-4xl text-primary mb-4">
              <FaRedo />
            </div>
            <h3 className="font-semibold text-xl mb-2">Easy Returns</h3>
            <p className="text-gray-600 dark:text-purple-300/70">
              No need to hustle for returning your products if not upto your
              expectations.
            </p>
          </div>
          <div className="bg-white dark:bg-[#160327] py-5 px-7 rounded-lg shadow-sm border border-slate-100 dark:border-purple-900/40 transition-all hover:shadow-md">
            <div className="text-4xl text-primary mb-4">
              <FaCreditCard />
            </div>
            <h3 className="font-semibold text-xl mb-2">Secure Payments</h3>
            <p className="text-gray-600 dark:text-purple-300/70">
              Shop with confidence using your secure payment methods and also
              with multiple payment options.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;