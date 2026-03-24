import React from "react";

const ShortOptions = ({ setSortType }) => {
  return (
    <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
      <p className="text-sm text-gray-500 hidden sm:block">
        Showing all results
      </p>

      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-sm font-medium text-gray-700">
          Sort by:
        </label>

        <select
          id="sort"
          onChange={(e) => setSortType(e.target.value)}
          className="
          
            border border-gray-300 
            text-gray-900 text-sm 
            rounded-sm 
            focus:ring-black focus:border-black 
            block p-2.5 
            bg-white 
            cursor-pointer 
            outline-none
            transition-all duration-200
            hover:border-gray-400
          "
        >
          <option value="relevant">Relevant</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
};

export default ShortOptions;
