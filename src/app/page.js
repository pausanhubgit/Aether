import React from "react";
import GlobalFeed from "@/components/GlobalFeed";

import Hero from "@/components/home/Hero";
import FeaturedEvents from "@/components/home/FeaturedEvents";
import Features from "@/components/home/Features";
import WhyChooseAether from "@/components/home/WhyChooseAether";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Contact from "@/components/home/Contact";
import PopularProducts from "@/components/home/PopularArts";
import CallToAction from "@/components/home/CallToAction";
import Categories from "@/components/home/Categories";
import Testimonials from "@/components/home/Testimonials";
import Image from "next/image";
const Home = () => {
  return (
    <main className="relative">
      <Hero />
      <FeaturedEvents />
      <GlobalFeed />
      <Features />
      <WhyChooseAether />
      <FeaturedProducts />
      <Contact />
      <PopularProducts />
      <CallToAction />
      <Categories />
      <Testimonials />
    </main>
  );
};

export default Home;
