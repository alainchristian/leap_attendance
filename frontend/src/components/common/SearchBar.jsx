import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = () => {
  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search..."
        className="block w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg
                 text-gray-900 placeholder-gray-500 focus:border-asyv-green focus:ring-0
                 focus:outline-none text-sm transition duration-150 ease-in-out"
      />
    </div>
  );
};

export default SearchBar;