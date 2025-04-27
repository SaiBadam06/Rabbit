import React, { useState } from 'react';
import { HiMagnifyingGlass, HiXMark } from 'react-icons/hi2';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setFilters } from '../../redux/slices/productsSlice';
import { fetchProductsByFilters } from '../../redux/slices/productsSlice';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  
  const handleSearchToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm(""); // Clear search when opening
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle search logic here
    console.log("Searching for:", searchTerm);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters({ search: searchTerm }));
    dispatch(fetchProductsByFilters({ search: searchTerm }));
    // Fix the URL path from 'collections' to 'collection'
    navigate(`/collection/all?search=${searchTerm}`);
    setIsOpen(false); // Close the search bar after submitting
  };

  return (
    <div className={`flex items-center justify-center w-full transition-all duration-300 ${isOpen ? "absolute top-0 left-0 w-full bg-white h-24 z-50 shadow-md" : "w-auto"}`}>
      {isOpen ? (
        <form onSubmit={handleSearch} className='relative flex items-center justify-center w-full'>
          <div className='relative w-1/2'>
            <input 
              type="text" 
              placeholder='Search' 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-100 px-4 py-2 pl-4 pr-16 rounded-lg focus:outline-none w-full placeholder:text-gray-700 focus:ring-2 focus:ring-blue-500"
              autoFocus // Auto-focus when opened
            />
            {/* Search icon */}
            <button 
              type="submit" 
              className='absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900'
              aria-label="Search"
            >
              <HiMagnifyingGlass className='h-5 w-5' />
            </button>
            {/* Close icon */}
            <button 
              type="button" 
              className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900'
              onClick={handleSearchToggle}
              aria-label="Close search"
            >
              <HiXMark className='h-6 w-6' />
            </button>
          </div>
        </form>
      ) : (
        <button 
          onClick={handleSearchToggle}
          aria-label="Open search"
          className='p-2 hover:bg-gray-100 rounded-full transition-colors'
        >
          <HiMagnifyingGlass className='h-6 w-6'/>
        </button>
      )}
    </div>
  );
};

export default SearchBar;