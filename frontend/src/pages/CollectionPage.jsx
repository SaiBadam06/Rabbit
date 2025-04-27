import React, { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByFilters } from '../redux/slices/productsSlice';
import ProductGrid from '../components/Products/ProductGrid';
import FilterSidebar from '../components/Products/FilterSidebar';
import SortOptions from '../components/Products/SortOptions';
import { FaFilter } from 'react-icons/fa';

const CollectionPage = () => {
    const { collection } = useParams();
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.products);
    const queryParams = Object.fromEntries([...searchParams]);

    const sidebarRef = useRef(null);   
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        console.log('Collection:', collection);
        console.log('Query Params:', queryParams);
        
        dispatch(fetchProductsByFilters({
            collection: collection !== "all" ? collection : undefined,
            ...queryParams
        }));
    }, [dispatch, collection, searchParams]);

    // Close sidebar when clicking outside on mobile
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsSidebarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filter Button (Mobile Only) */}
                <button
                    className="lg:hidden mb-4 flex items-center space-x-2 px-4 py-2 bg-white border rounded-lg shadow-sm"
                    onClick={() => setIsSidebarOpen(true)}
                >
                    <FaFilter />
                    <span>Filters</span>
                </button>

                <FilterSidebar 
                    isOpen={isSidebarOpen} 
                    onClose={() => setIsSidebarOpen(false)}
                    ref={sidebarRef}
                />
                <main className="flex-1 lg:ml-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                            {searchParams.get('gender') || 
                             searchParams.get('category') || 
                             'All Products'}
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                            {products?.length || 0} products available
                        </p>
                    </div>
                    <SortOptions />
                    <ProductGrid products={products} loading={loading} error={error} />
                </main>
            </div>
        </div>
    );
};

export default CollectionPage;