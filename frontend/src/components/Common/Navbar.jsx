import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineUser, HiOutlineShoppingBag, HiBars3BottomRight, HiXMark } from 'react-icons/hi2';
import SearchBar from './SearchBar';
import CartDrawer from '../Layout/CartDrawer';
import { IoMdClose } from 'react-icons/io';
import { useSelector } from 'react-redux';


const Navbar = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [navDrawerOpen, setNavDrawerOpen] = useState(false);
    const {cart} = useSelector((state) => state.cart);
    const {user} = useSelector((state) => state.auth);

    const cartItemCount = cart?.products?.reduce((total, product) => total+product.quantity, 0) || 
    0;

    const toggleCartDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const toggleNavDrawer = () => {
        setNavDrawerOpen(!navDrawerOpen);
    };

    return (
        <>
            <nav className="sticky top-0 z-50 bg-white shadow-sm container mx-auto flex items-center justify-between py-4 px-6">
                {/* Left - Logo */}
                <div>
                    <Link to="/" className="text-2xl font-medium">Rabbit</Link>
                </div>

                {/* Center - Navigation (Desktop) */}
                <div className='hidden md:flex space-x-6'>
                    <Link to="/collection/all?gender=Men" className='text-gray-500 hover:text-black text-sm font-medium uppercase transition-colors duration-200'>Men</Link>
                    <Link to="/collection/all?gender=Women" className='text-gray-500 hover:text-black text-sm font-medium uppercase transition-colors duration-200'>Women</Link>
                    <Link to="/collection/all?category=Top Wear" className='text-gray-500 hover:text-black text-sm font-medium uppercase transition-colors duration-200'>TopWear</Link>
                    <Link to="/collection/all?category=Bottom Wear" className='text-gray-500 hover:text-black text-sm font-medium uppercase transition-colors duration-200'>BottomWear</Link>
                </div>

                {/* Right - Icons */}
                <div className='flex items-center space-x-4'>
                    {user && user.role === 'admin' && (<Link to="/admin" className='block bg-black px-2 rounded text-sm text-white'>
                    Admin
                    </Link>
                )}
                    
                    <Link to="/profile" className='hover:text-black transition-colors duration-200'>
                        <HiOutlineUser className='h-5 w-5 text-gray-700' />
                    </Link>
                    
                    <button 
                        onClick={toggleCartDrawer} 
                        className='relative hover:text-black transition-colors duration-200'
                        aria-label="Shopping cart"
                    >
                        <HiOutlineShoppingBag className='h-5 w-5 text-gray-700' />
                        {cartItemCount > 0 && (<span className='absolute -top-2 -right-2 bg-rabbit-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                            {cartItemCount}
                        </span>)}
                        
                    </button>
                    
                    {/* Search - Hidden on mobile */}
                    <div className='hidden md:block overflow-hidden'>
                        <SearchBar />
                    </div> 
                    
                    {/* Mobile menu button */}
                    <button onClick={toggleNavDrawer} className='md:hidden'>
                        {navDrawerOpen ? (
                            <HiXMark className='h-6 w-6 text-gray-700' />
                        ) : (
                            <HiBars3BottomRight className='h-6 w-6 text-gray-700' />
                        )}
                    </button>
                </div>
            </nav>

            <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

            {/* Mobile nav overlay and drawer */}
            {navDrawerOpen && (
                <>
                    {/* Overlay */}
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
                        onClick={toggleNavDrawer}
                    />
                    
                    {/* Mobile nav drawer */}
                    <div className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${navDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}>
                        <div className='flex justify-end p-4'>
                            <button onClick={toggleNavDrawer}>
                                <IoMdClose className='h-6 w-6 text-gray-600' />   
                            </button>
                        </div>
                        <div className='p-6'>
                            <h2 className='text-xl font-semibold mb-6'>Menu</h2>
                            <nav classname="sapce-y-4">
                                <Link to="/collection/all?gender=Men" className='block text-gray-500 hover:text-black text-sm font-medium uppercase' onClick={toggleNavDrawer}>Men</Link>
                                <Link to="/collection/all?gender=Women" className='block text-gray-500 hover:text-black text-sm font-medium uppercase' onClick={toggleNavDrawer}>Women</Link>
                                <Link to="/collection/all?category=Top Wear" className='block text-gray-500 hover:text-black text-sm font-medium uppercase' onClick={toggleNavDrawer}>TopWear</Link>
                                <Link to="/collection/all?category=Bottom Wear" className='block text-gray-500 hover:text-black text-sm font-medium uppercase' onClick={toggleNavDrawer}>BottomWear</Link>
                            </nav>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Navbar;