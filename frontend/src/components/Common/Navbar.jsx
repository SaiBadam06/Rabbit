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
    const { cart } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);

    const cartItemCount = cart?.products?.reduce((total, product) => total + product.quantity, 0) || 0;

    const toggleCartDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const toggleNavDrawer = () => {
        setNavDrawerOpen(!navDrawerOpen);
    };

    return (
        <>
            <nav className="sticky top-0 z-50 bg-black shadow-lg">
                <div className="container mx-auto flex items-center justify-between py-4 px-6">
                    {/* Left - Logo */}
                    <div>
                        <Link to="/" className="text-2xl font-bold text-[var(--srh-orange)]">
                            FanCharge
                        </Link>
                    </div>

                    {/* Center - Navigation (Desktop) */}
                    <div className='hidden md:flex space-x-6'>
                        <Link 
                            to="/collection/all?category=Jerseys" 
                            className='text-white hover:text-[var(--srh-orange)] text-sm font-medium uppercase transition-colors duration-200'
                        >
                            Jerseys
                        </Link>
                        <Link 
                            to="/collection/all?category=Training Wear" 
                            className='text-white hover:text-[var(--srh-orange)] text-sm font-medium uppercase transition-colors duration-200'
                        >
                            Training Wear
                        </Link>
                        <Link 
                            to="/collection/all?category=Accessories" 
                            className='text-white hover:text-[var(--srh-orange)] text-sm font-medium uppercase transition-colors duration-200'
                        >
                            Accessories
                        </Link>
                        <Link 
                            to="/collection/all?category=Collectibles" 
                            className='text-white hover:text-[var(--srh-orange)] text-sm font-medium uppercase transition-colors duration-200'
                        >
                            Collectibles
                        </Link>
                    </div>

                    {/* Right - Icons */}
                    <div className='flex items-center space-x-4'>
                        {user && user.role === 'admin' && (
                            <Link to="/admin" className='block bg-[var(--srh-orange)] px-3 py-1 rounded text-sm text-white hover:bg-[var(--srh-gold)] transition-colors duration-200'>
                                Admin
                            </Link>
                        )}
                        
                        <Link to="/profile" className='hover:text-[var(--srh-orange)] transition-colors duration-200'>
                            <HiOutlineUser className='h-5 w-5 text-white' />
                        </Link>
                        
                        <button 
                            onClick={toggleCartDrawer} 
                            className='relative hover:text-[var(--srh-orange)] transition-colors duration-200'
                            aria-label="Shopping cart"
                        >
                            <HiOutlineShoppingBag className='h-5 w-5 text-white' />
                            {cartItemCount > 0 && (
                                <span className='absolute -top-2 -right-2 bg-[var(--srh-orange)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                                    {cartItemCount}
                                </span>
                            )}
                        </button>
                        
                        {/* Search - Hidden on mobile */}
                        <div className='hidden md:block overflow-hidden'>
                            <SearchBar />
                        </div> 
                        
                        {/* Mobile menu button */}
                        <button onClick={toggleNavDrawer} className='md:hidden text-white'>
                            {navDrawerOpen ? (
                                <HiXMark className='h-6 w-6' />
                            ) : (
                                <HiBars3BottomRight className='h-6 w-6' />
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

            {/* Mobile nav drawer */}
            {navDrawerOpen && (
                <>
                    {/* Overlay */}
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
                        onClick={toggleNavDrawer}
                    />
                    
                    {/* Mobile nav drawer */}
                    <div className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-black shadow-lg transform transition-transform duration-300 z-50 ${navDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}>
                        <div className='flex justify-end p-4'>
                            <button onClick={toggleNavDrawer} className="text-white hover:text-[var(--srh-orange)]">
                                <IoMdClose className='h-6 w-6' />   
                            </button>
                        </div>
                        <div className='p-6'>
                            <h2 className='text-xl font-bold mb-6 text-[var(--srh-orange)]'>SRH Store</h2>
                            <nav className="space-y-4">
                                <Link 
                                    to="/collection/all?collection=Match Day" 
                                    className='block text-white hover:text-[var(--srh-orange)] text-sm font-medium uppercase mb-3' 
                                    onClick={toggleNavDrawer}
                                >
                                    Match Day Collection
                                </Link>
                                <Link 
                                    to="/collection/all?collection=Practice" 
                                    className='block text-white hover:text-[var(--srh-orange)] text-sm font-medium uppercase mb-3' 
                                    onClick={toggleNavDrawer}
                                >
                                    Practice Collection
                                </Link>
                                <Link 
                                    to="/collection/all?collection=Limited Edition" 
                                    className='block text-white hover:text-[var(--srh-orange)] text-sm font-medium uppercase mb-3' 
                                    onClick={toggleNavDrawer}
                                >
                                    Limited Edition
                                </Link>
                                <Link 
                                    to="/collection/all?collection=Casual" 
                                    className='block text-white hover:text-[var(--srh-orange)] text-sm font-medium uppercase mb-3' 
                                    onClick={toggleNavDrawer}
                                >
                                    Casual Wear
                                </Link>
                            </nav>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Navbar;