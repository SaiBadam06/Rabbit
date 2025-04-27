import React from 'react'
import Topbar from '../Layout/Topbar.jsx';
import Navbar from './Navbar.jsx';
import CartDrawer from '../Layout/CartDrawer.jsx';

const Header = () => {
    
  return (
    <header className='border-b border-gray-200'>
    {/*  */}
    {/* Topbar */}
    <Topbar />
    {/* Navbar */}
    <Navbar />
    {/* Cart Drawer */}
  
    </header>
  );
};

export default Header
