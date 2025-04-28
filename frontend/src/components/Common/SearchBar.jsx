import React, { useState } from 'react';
import { HiMagnifyingGlass, HiXMark } from 'react-icons/hi2';
import { HiOutlineSearch } from 'react-icons/hi'; // Changed import to hi
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setFilters, fetchProductsByFilters } from '../../redux/slices/productsSlice';

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
    navigate(`/collection/all?search=${searchTerm}`);
    setIsOpen(false); // Close the search bar after submitting
  };

  return (
    <div className={`flex items-center justify-center w-full transition-all duration-300 ${isOpen ? "absolute top-0 left-0 w-full bg-black h-24 z-50 shadow-md" : "w-auto"}`}>
      {isOpen ? (
        <form onSubmit={handleSearch} className='relative flex items-center justify-center w-full'>
          <div className='relative w-1/2'>
            <div className="search-container relative">
              <input 
                type="text"
                placeholder="Search SRH merchandise..."
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input bg-transparent border-b border-gray-600 text-white pl-8 pr-4 py-1 w-full focus:outline-none focus:border-[var(--srh-orange)]"
                autoFocus
              />
              <HiOutlineSearch className="search-icon absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5" />
            </div>
            <button 
              type="submit" 
              className='absolute right-10 top-1/2 transform -translate-y-1/2 text-white hover:text-[var(--srh-orange)]'
              aria-label="Search"
            >
              <HiMagnifyingGlass className='h-5 w-5' />
            </button>
            <button 
              type="button" 
              className='absolute right-2 top-1/2 transform -translate-y-1/2 text-white hover:text-[var(--srh-orange)]'
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
          className='p-2 hover:text-[var(--srh-orange)] rounded-full transition-colors'
        >
          <HiMagnifyingGlass className='h-6 w-6 text-white'/>
        </button>
      )}
    </div>
  );
};

export default SearchBar;