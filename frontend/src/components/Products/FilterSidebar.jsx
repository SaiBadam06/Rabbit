import React, { useState, useEffect, forwardRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IoMdClose } from 'react-icons/io';

const FilterSidebar = forwardRef(({ isOpen, onClose }, ref) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const [filter, setFilters] = useState({
        category: "",
        gender: "",
        color: "",
        size: [],
        material: [],
        brand: [],
        minPrice: 0,
        maxPrice: 100,
    });

    const [priceRange, setPriceRange] = useState([0, 100]);

    const categories = ["Top Wear", "Bottom Wear"];
    const colors = ["Red", "Blue", "Green", "Yellow", "Black", "Gray", "White", "Pink", "Beige", "Navy"];
    const genders = ["Men", "Women"];
    const sizes = ["S", "M", "L", "XL", "XXL"];
    const materials = ["Cotton", "Polyester", "Wool", "Silk", "Denim", "Linen", "Fleece", "Cashmere", "Leather", "Velvet"];
    const brands = ["Nike", "Adidas", "Puma", "Reebok", "Under Armour", "New Balance", "Converse", "Vans", "Skechers", "Timberland"];

    useEffect(() => {
        const params = Object.fromEntries([...searchParams]);

        setFilters({
            category: params.category || "",
            gender: params.gender || "",
            color: params.color || "",
            size: params.size ? params.size.split(",") : [],
            material: params.material ? params.material.split(",") : [],
            brand: params.brand ? params.brand.split(",") : [],
            minPrice: Number(params.minPrice) || 0,
            maxPrice: Number(params.maxPrice) || 100,
        });

        setPriceRange([0, Number(params.maxPrice) || 100]);
    }, [searchParams]);

    const handleFilterChange = (e) => {
        const { name, value, checked, type } = e.target;
        let newFilters = { ...filter };

        if (type === "checkbox") {
            if (checked) {
                newFilters[name] = [...newFilters[name], value];
            } else {
                newFilters[name] = newFilters[name].filter((item) => item !== value);
            }
        } else {
            newFilters[name] = value;
        }

        setFilters(newFilters);
        updateURLParams(newFilters);
    };

    const updateURLParams = (newFilters) => {
        const params = new URLSearchParams();

        Object.keys(newFilters).forEach((key) => {
            if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
                params.set(key, newFilters[key].join(","));
            } else if (newFilters[key]) {
                params.set(key, newFilters[key]);
            }
        });

        setSearchParams(params);
        navigate(`?${params.toString()}`);
    };

    const handlePriceChange = (e) => {
        const newMaxPrice = Number(e.target.value);
        setPriceRange([0, newMaxPrice]);

        const newFilters = { ...filter, minPrice: 0, maxPrice: newMaxPrice };
        setFilters(newFilters);
        updateURLParams(newFilters);
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <div 
                ref={ref}
                className={`
                    fixed lg:sticky lg:top-20 left-0 top-0 h-full 
                    bg-white z-50 transform transition-transform duration-300 ease-in-out
                    w-[280px] lg:w-[250px] lg:transform-none overflow-y-auto
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Mobile Close Button */}
                <div className="flex justify-between items-center p-4 lg:hidden">
                    <h3 className="text-xl font-medium text-gray-800">Filters</h3>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full"
                    >
                        <IoMdClose className="w-6 h-6" />
                    </button>
                </div>

                {/* Filter Content */}
                <div className="p-4">
                    <h3 className='text-xl font-medium text-gray-800 mb-4'>Filter</h3>

                    {/* Category Filter */}
                    <div className='mb-6'>
                        <label className='block text-gray-600 font-medium mb-2'>Category</label>
                        {categories.map((category) => (
                            <div key={category} className='flex items-center mb-2'>
                                <input
                                    type='radio'
                                    name='category'
                                    value={category}
                                    onChange={handleFilterChange}
                                    checked={filter.category === category}
                                    className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300'
                                />
                                <span className='text-gray-700'>{category}</span>
                            </div>
                        ))}
                    </div>

                    {/* Gender Filter */}
                    <div className='mb-6'>
                        <label className='block text-gray-600 font-medium mb-2'>Gender</label>
                        {genders.map((gender) => (
                            <div key={gender} className='flex items-center mb-2'>
                                <input
                                    type='radio'
                                    name='gender'
                                    value={gender}
                                    onChange={handleFilterChange}
                                    checked={filter.gender === gender}
                                    className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300'
                                />
                                <span className='text-gray-700'>{gender}</span>
                            </div>
                        ))}
                    </div>

                    {/* Color Filter */}
                    <div className='mb-6'>
                        <label className='block text-gray-600 font-medium mb-2'>Color</label>
                        <div className='flex flex-wrap gap-2'>
                            {colors.map((color) => (
                                <button
                                    key={color}
                                    name="color"
                                    value={color}
                                    onClick={() => handleFilterChange({ target: { name: "color", value: color, type: "radio" } })}
                                    className={`w-8 h-8 rounded-full border border-gray-300 cursor-pointer transition hover:scale-105 ${filter.color === color ? "ring-2 ring-blue-500" : ""}`}
                                    style={{ backgroundColor: color.toLowerCase() }}
                                ></button>
                            ))}
                        </div>
                    </div>

                    {/* Size Filter */}
                    <div className='mb-6'>
                        <label className='block text-gray-600 font-medium mb-2'>Size</label>
                        {sizes.map((size) => (
                            <div key={size} className='flex items-center mb-2'>
                                <input
                                    type='checkbox'
                                    name='size'
                                    value={size}
                                    onChange={handleFilterChange}
                                    checked={filter.size.includes(size)}
                                    className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300'
                                />
                                <span className='text-gray-700'>{size}</span>
                            </div>
                        ))}
                    </div>

                    {/* Material Filter */}
                    <div className='mb-6'>
                        <label className='block text-gray-600 font-medium mb-2'>Material</label>
                        {materials.map((material) => (
                            <div key={material} className='flex items-center mb-2'>
                                <input
                                    type='checkbox'
                                    name='material'
                                    value={material}
                                    onChange={handleFilterChange}
                                    checked={filter.material.includes(material)}
                                    className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300'
                                />
                                <span className='text-gray-700'>{material}</span>
                            </div>
                        ))}
                    </div>

                    {/* Brand Filter */}
                    <div className='mb-6'>
                        <label className='block text-gray-600 font-medium mb-2'>Brand</label>
                        {brands.map((brand) => (
                            <div key={brand} className='flex items-center mb-2'>
                                <input
                                    type='checkbox'
                                    name='brand'
                                    value={brand}
                                    onChange={handleFilterChange}
                                    checked={filter.brand.includes(brand)}
                                    className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300'
                                />
                                <span className='text-gray-700'>{brand}</span>
                            </div>
                        ))}
                    </div>

                    {/* Price Filter */}
                    <div className='mb-8'>
                        <label className='block text-gray-600 font-medium mb-2'>Price Range</label>
                        <input
                            type='range'
                            min={0}
                            max={100}
                            value={priceRange[1]}
                            onChange={handlePriceChange}
                            className='w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer'
                        />
                        <div className='flex justify-between mt-2 text-gray-500'>
                            <span>$0</span>
                            <span>${priceRange[1]}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
});

FilterSidebar.displayName = 'FilterSidebar';

export default FilterSidebar;
