import React, { useEffect, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa";
import FilterSideBar from "../components/FilterSideBar";
import ShortOptions from "../components/ShortOptions";
import Productgrid from "../components/Productgrid";
import { getAllProducts } from "../assets/fakeData";
import { useSearchParams } from "react-router-dom";

function CollectionPage() {
  const [products, setProducts] = useState([]);
  const [filterProducts, setFilterProducts] = useState([]);
  const [searchParams] = useSearchParams();
  
  const Sidebar = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const allData = getAllProducts();
    setProducts(allData);
    setFilterProducts(allData);
  }, []);

  // --- THIS IS THE FIXED FILTER LOGIC ---
  useEffect(() => {
    if (products.length === 0) return; // Wait for products to load

    let productsCopy = [...products];
    const params = Object.fromEntries([...searchParams]);

    // 1. Category Filter (Fixes "Top Wear" vs "topwear")
    if (params.category) {
      productsCopy = productsCopy.filter(item => 
        item.category.toLowerCase().replace(" ", "") === params.category.toLowerCase()
      );
    }
    
    // 2. Gender Filter (Fixes "Men" vs "men")
    if (params.gender) {
      productsCopy = productsCopy.filter(item => 
        item.gender.toLowerCase() === params.gender.toLowerCase()
      );
    }

    // 3. Color Filter (Checks if the product's color list contains the selected color)
    if (params.color) {
      productsCopy = productsCopy.filter(item => 
        item.colors && item.colors.some(c => c.toLowerCase() === params.color.toLowerCase())
      );
    }

    // 4. Size Filter (Checks if any selected size exists in product sizes)
    if (params.size) {
      const selectedSizes = params.size.split(","); // "s,m" -> ["s", "m"]
      productsCopy = productsCopy.filter(item => 
        item.sizes && item.sizes.some(s => selectedSizes.includes(s.toLowerCase()))
      );
    }

    // 5. Material Filter
    if (params.material) {
        const selectedMaterials = params.material.split(",");
        productsCopy = productsCopy.filter(item => 
            item.material && selectedMaterials.includes(item.material.toLowerCase())
        );
    }

    // 6. Brand Filter
    if (params.brand) {
        const selectedBrands = params.brand.split(",");
        productsCopy = productsCopy.filter(item => 
            item.brand && selectedBrands.includes(item.brand.toLowerCase())
        );
    }

    // 7. Price Filter
    if (params.maxPrice) {
        productsCopy = productsCopy.filter(item => item.price <= Number(params.maxPrice));
    }

    // 8. Sorting Logic
    const sortValue = params.sort;
    if (sortValue === "low-high") {
      productsCopy.sort((a, b) => a.price - b.price);
    } else if (sortValue === "high-low") {
      productsCopy.sort((a, b) => b.price - a.price);
    }

    setFilterProducts(productsCopy);
  }, [searchParams, products]);

  return (
    <div className="flex flex-col lg:flex-row">
      <button
        onClick={toggleSidebar}
        className="border lg:hidden p-2 flex justify-center items-center"
      >
        <FaFilter className="mr-2" />
      </button>

      <div
        ref={Sidebar}
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 z-50 left-0 w-64 lg:w-[190px] bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0`}
      >
        <FilterSideBar />
      </div>

      <div className="grow p-4">
        <h2 className="text-2xl uppercase mb-4">All Collection</h2>
        <ShortOptions /> 
        {filterProducts.length > 0 ? (
            <Productgrid Products={filterProducts} />
        ) : (
            <p className="text-gray-500 mt-10 text-center">No products found matching your filters.</p>
        )}
      </div>
    </div>
  );
}

export default CollectionPage;