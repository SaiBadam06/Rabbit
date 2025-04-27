import React, { use } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import axios from 'axios';


const NewArrivals = () => {
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeftState, setScrollLeftState] = useState(false);
    const [scrollRightState, setScrollRightState] = useState(true);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);


    const [newArrivals, setNewArrivals] = useState([]);

    useEffect(() => {
        const fetchNewArrivals = async () => {
            try {
                const response = await axios.get (
                    `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
                );
                setNewArrivals(response.data);
            } catch (error) {
                console.error(error);
            }
        }; 
        
        fetchNewArrivals();
    }, []);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeftState(scrollRef.current.scrollLeft);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = x - startX;
        scrollRef.current.scrollLeft = scrollLeftState - walk;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const scroll = (direction) => {
        const scrollAmount = direction === 'left' ? -300 : 300;
        scrollRef.current.scrollBy({
            left: scrollAmount,
            behavior: 'smooth',
        });
    };

    const updateScrollButtons = () => {
        const container = scrollRef.current;
        if (container) {
            const { scrollLeft, scrollWidth, clientWidth } = container;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
        }
    };

    useEffect(() => {
        const container = scrollRef.current;
        if (container) {
            container.addEventListener("scroll", updateScrollButtons);
            updateScrollButtons();
            return () => {
                container.removeEventListener("scroll", updateScrollButtons);
            };
        }
    }, [newArrivals]);

    return (
        <section className='py-16 px-4'>
            <div className='container mx-auto text-center mb-10 relative'>
                <h2 className='text-3xl font-bold mb-4'>
                    Explore New Arrivals
                </h2>
                <p className='text-lg mb-8 text-gray-600'>
                    Discover latest styles straight off the runway, flashy added to keep your wardrobe on the cutting edge of fashion.
                </p>
                {/* scroll buttons */}
                <div className='absolute right-0 top-0 flex space-x-2'>
                    <button 
                        onClick={() => scroll("left")} 
                        disabled={!canScrollLeft}
                        className={`p-2 rounded-full border ${canScrollLeft ? "bg-white text-black hover:bg-gray-100" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                    >
                        <FiChevronLeft className='text-2xl' />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        disabled={!canScrollRight}
                        className={`p-2 rounded-full border ${canScrollRight ? "bg-white text-black hover:bg-gray-100" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                    >
                        <FiChevronRight className='text-2xl' />
                    </button>
                </div>
            </div>
            {/* Scrollable content */}
            <div
                ref={scrollRef}
                className={`container mx-auto overflow-x-auto flex space-x-6 pb-4 hide-scrollbar ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{ userSelect: 'none' }}
            >
                {newArrivals.map((product) => (
                    <div key={product._id} className='min-w-[280px] sm:min-w-[300px] flex-shrink-0 relative group'>
                        <img
                            src={product.images[0]?.url}
                            alt={product.images[0]?.altText || product.name}
                            className='w-full h-[400px] object-cover rounded-lg transition-transform group-hover:scale-105'
                            draggable="false"
                        />
                        <div className='absolute bottom-0 left-0 right-0 backdrop-blur-md bg-black bg-opacity-50 text-white p-4 rounded-b-lg transition-opacity group-hover:bg-opacity-70'>
                            <Link to={`/product/${product._id}`} className="block">
                                <h4 className='font-medium text-lg'>{product.name}</h4>
                                <p className='mt-1'>${product.price}</p>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default NewArrivals;