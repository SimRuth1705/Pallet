import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function FilterSideBar() {
  const [SearchParam, setSearchParam] = useSearchParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    category: "",
    gender: "",
    color: "",
    size: [],
    material: [],
    brand: [],
    minPrice: 0,
    maxPrice: 150,
  });

  const [priceRange, setPriceRange] = useState([0, 150]);
  const category = ["topwear", "bottomwear"];
  const gender = ["men", "women"];
  const color = [
    "red",
    "blue",
    "green",
    "black",
    "white",
    "yellow",
    "pink",
    "purple",
  ];
  const size = ["xs", "s", "m", "l", "xl", "xxl"];
  const material = ["cotton", "polyester", "leather", "denim", "wool"];
  const brand = ["nike", "adidas", "puma", "reebok", "under armour"];

  useEffect(() => {
    const params = Object.fromEntries([...SearchParam]);

    setFilters({
      category: params.category || "",
      gender: params.gender || "",
      color: params.color || "",
      size: params.size ? params.size.split(",") : [],
      material: params.material ? params.material.split(",") : [],
      brand: params.brand ? params.brand.split(",") : [],
      minPrice: params.minPrice ? parseInt(params.minPrice) : 0,
      maxPrice: params.maxPrice ? parseInt(params.maxPrice) : 150,
    });
    setPriceRange([0, params.maxPrice || 150]);
  }, [SearchParam]);

  const updateURLParams = (updatedFilters) => {
    const params = new URLSearchParams();
    Object.keys(updatedFilters).forEach((key) => {
      if (
        Array.isArray(updatedFilters[key]) &&
        updatedFilters[key].length > 0
      ) {
        params.append(key, updatedFilters[key].join(","));
      } else if (updatedFilters[key]) {
        params.append(key, updatedFilters[key]);
      }
    });
    setSearchParam(params);
    navigate(`?${params.toString()}`);
  };
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    let updatedFilters = { ...filters };
    if (name === "pricerange") {
      updatedFilters.maxPrice = value;
      setPriceRange([0, value]);
      setFilters(updatedFilters);
      updateURLParams(updatedFilters);
    } else if (type === "checkbox") {
      if (checked) {
        updatedFilters[name] = [...(updatedFilters[name] || []), value];
      } else {
        updatedFilters[name] = updatedFilters[name].filter(
          (item) => item !== value
        );
      }
    } else {
      updatedFilters[name] = value;
    }
    setFilters(updatedFilters);
    updateURLParams(updatedFilters);
  };

  return (
    <div className="p-4">
      <h3 className="text-xl font-medium mb-4 text-gray-800">Filter</h3>
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2 ">
          Category
        </label>
        {category.map((cat) => (
          <div key={cat} className="flex items-center mb-2">
            <input
              type="radio"
              name="category"
              value={cat}
              onChange={handleFilterChange}
              checked={filters.category === cat}
              className="mr-2 h-2 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
            />
            <span className="text-gray-700">{cat}</span>
          </div>
        ))}
      </div>
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2 ">Gender</label>
        {gender.map((gender) => (
          <div key={gender} className="flex items-center mb-2">
            <input
              type="radio"
              name="gender"
              value={gender}
              checked={filters.gender === gender}
              onChange={handleFilterChange}
              className="mr-2 h-2 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
            />
            <span className="text-gray-700">{gender}</span>
          </div>
        ))}
      </div>
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Color</label>
        <div className="flex flex-wrap gap-2">
          {color.map((col) => (
            <button
              key={col}
              name="color"
              value={col}
              onClick={handleFilterChange}
              className={`w-8 h-8 rounded-full border border-gray-300 cursor-pointer transition hover:scale-105 ${ filters.color === col ? "ring ring-blue-500" : "" } `}
              style={{ backgroundColor: col.toLowerCase() }}
            ></button>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Size</label>
        {size.map((sz) => (
          <div key={sz} className="flex items-center mb-2">
            <input
              type="checkbox"
              name="size"
              value={sz}
              checked={filters.size.includes(sz)}
              onChange={handleFilterChange}
              className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
            />
            <span className="text-gray-700">{sz.toUpperCase()}</span>
          </div>
        ))}
      </div>
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Material</label>
        {material.map((material) => (
          <div key={material} className="flex items-center mb-2">
            <input
              type="checkbox"
              name="material"
              value={material}
              checked={filters.material.includes(material)}
              onChange={handleFilterChange}
              className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
            />
            <span className="text-gray-700">{material}</span>
          </div>
        ))}
      </div>
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Brand</label>
        {brand.map((brand) => (
          <div key={brand} className="flex items-center mb-2">
            <input
              type="checkbox"
              name="brand"
              value={brand}
              onChange={handleFilterChange}
              checked={filters.brand.includes(brand)}
              className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
            />
            <span className="text-gray-700">{brand}</span>
          </div>
        ))}
      </div>
      <div className="mb-8">
        <label className=" block text-gray-600 font-medium mb-2 ">
          Price Range
        </label>
        <input
          type="range"
          name="pricerange"
          value={priceRange[1]}
          onChange={handleFilterChange}
          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
          min={0}
          max={150}
        />
        <div className="flex justify-between text-gray-600 mt-1">
          <span>$0</span>
          <span>${priceRange[1]} </span>
        </div>
      </div>
    </div>
  );
}

export default FilterSideBar;
