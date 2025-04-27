import React from 'react';
import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io5";  // Fixed import
import { RiTwitterXLine } from "react-icons/ri";    // Fixed Twitter icon name

const Topbar = () => {
  return (
    <div className='bg-rabbit-red text-white p-1' >  {/* Added p-4 for testing */}
      <div className="container mx-auto flex justify-between items-center py-3 px-4">
        <div className="hidden md:flex items-center space-x-4">
          <a href="#" className="hover:text-gray-300">
            <TbBrandMeta className="h-5 w-5" />
          </a>
          <a href="#" className="hover:text-gray-300">
            <IoLogoInstagram className="h-5 w-5" />  {/* Correct component */}
          </a>
          <a href="#" className="hover:text-gray-300">
            <RiTwitterXLine className="h-5 w-5" />    {/* Fixed Twitter icon */}
          </a>
        </div>
        <div className="text-sm text-center flex-grow">
          <span> We Ship WorldWide - Fast and reliable shippinf!</span>
        </div>
        <div className='text-sm hidden md:block'>
          <a href="+91 9059223500" className='hover:text-gray-300'>+91 9059223500</a>
        </div>
      </div>
    </div>
  );
};

export default Topbar;