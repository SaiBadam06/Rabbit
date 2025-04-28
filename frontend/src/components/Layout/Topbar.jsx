import React from 'react';
import { TbBrandFacebook } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io5";
import { RiTwitterXLine } from "react-icons/ri";
import { HiPhone } from "react-icons/hi";

const Topbar = () => {
  return (
    <div className='sticky bg-[var(--srh-orange)] text-white py-2'>
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="hidden md:flex items-center space-x-6">
          <a 
            href="https://www.facebook.com/SunRisersHyderabad" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-[var(--srh-black)] transition-colors duration-200"
          >
            <TbBrandFacebook className="h-5 w-5" />
          </a>
          <a 
            href="https://www.instagram.com/sunrisershyderabad" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-[var(--srh-black)] transition-colors duration-200"
          >
            <IoLogoInstagram className="h-5 w-5" />
          </a>
          <a 
            href="https://twitter.com/SunRisers" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-[var(--srh-black)] transition-colors duration-200"
          >
            <RiTwitterXLine className="h-5 w-5" />
          </a>
        </div>
        
        <div className="text-sm text-center flex-grow font-medium">
          <span className="hidden md:inline">Merchandise Store for Oranage Army</span>
          <span className="md:hidden">Merch Store</span>
        </div>
        
        <div className='text-sm hidden md:flex items-center space-x-2 hover:text-[var(--srh-black)] transition-colors duration-200'>
          <HiPhone className="h-4 w-4" />
          <a href="tel:+919059223500">+91 9059223500</a>
        </div>
      </div>
    </div>
  );
};

export default Topbar;