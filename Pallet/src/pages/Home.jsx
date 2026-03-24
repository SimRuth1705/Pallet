import React, { useMemo } from 'react';
import { PRODUCTS as all_products } from "../assets/fakeData";

import GenderCollection from "../components/GenderCollection";
import Hero from "../components/Hero";
import NewArrivals from "../components/NewArrivals";
import FeaturedCollection from "../components/FeaturedCollection";
import ProductDetails from "./ProductDetails";

function Home() {

  const getRandomProducts = (prods, count) => {
    if (!prods) return [];
    const shuffled = [...prods].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const newArrivalsData = useMemo(() => getRandomProducts(all_products, 8), []);
  const featuredData = useMemo(() => getRandomProducts(all_products, 8), []);
  const specificProductData = useMemo(() => getRandomProducts(all_products, 1), []); 
  return (
    <>
      <Hero />
      <GenderCollection />
      
      <NewArrivals data={newArrivalsData} />
      
      <ProductDetails data={specificProductData} />
      
      <FeaturedCollection data={featuredData} />
    </>
  );
}

export default Home;