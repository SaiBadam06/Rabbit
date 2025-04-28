import React, { useState, useEffect, forwardRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IoMdClose } from 'react-icons/io';
import { IoFilterSharp } from 'react-icons/io5';

const FilterSidebar = forwardRef(({ isOpen, onClose }, ref) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const [filter, setFilters] = useState({
        category: "",
        collection: "",
        gender: "",
        color: "",
        size: [],
        material: [],
        brand: ["SRH Official"],
        minPrice: 0,
        maxPrice: 100000,
    });

    const categories = [
        "Jerseys",
        "Training Wear",
        "Accessories",
        "Collectibles"
    ];

    const collections = [
        "Match Day",
        "Practice",
        "Casual",
        "Limited Edition"
    ];

    const colors = [
        "Orange",
        "Black",
        "Navy",
        "Gray",
        "White",
        "Pink",
        "Blue",
        "Red",
        "Gold",
        "Brown",
        "Beige",
        "Yellow"
    ];

    const materials = [
        "Polyester",
        "Cotton",
        "Wool",
        "Silk",
        "Denim",
        "Leather",
        "Fleece",
        "Velvet",
        "Linen",
        "Metal",
        "Ceramic",
        "Paper"
    ];

    const genders = ["Men", "Women", "Kids", "Unisex"];
    
    const sizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

    const priceRanges = [
        { min: 0, max: 499, label: "Under ₹499" },
        { min: 500, max: 999, label: "₹500 - ₹999" },
        { min: 1000, max: 1999, label: "₹1000 - ₹1999" },
        { min: 2000, max: 4999, label: "₹2000 - ₹4999" },
        { min: 5000, max: 100000, label: "Above ₹5000" }
    ];

    useEffect(() => {
        const params = Object.fromEntries([...searchParams]);

        setFilters({
            category: params.category || "",
            collection: params.collection || "",
            gender: params.gender || "",
            color: params.color || "",
            size: params.size ? params.size.split(",") : [],
            material: params.material ? params.material.split(",") : [],
            brand: params.brand ? params.brand.split(",") : ["SRH Official"],
            minPrice: Number(params.minPrice) || 0,
            maxPrice: Number(params.maxPrice) || 100000,
        });
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

    const resetFilters = () => {
        setFilters({
            category: "",
            collection: "",
            gender: "",
            color: "",
            size: [],
            material: [],
            brand: ["SRH Official"],
            minPrice: 0,
            maxPrice: 100000,
        });
        updateURLParams({});
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />
            )}

            {/* Sidebar Container */}
            <div 
                ref={ref}
                className={`
                    fixed lg:sticky lg:top-20 left-0 top-0 h-full 
                    bg-white z-50 transform transition-transform duration-300
                    w-[280px] lg:w-[250px] lg:transform-none overflow-y-auto
                    shadow-lg rounded-r-lg lg:rounded-lg
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <div className="flex items-center">
                        <IoFilterSharp className="w-5 h-5 text-[var(--srh-orange)]" />
                        <h3 className="ml-2 text-xl font-bold text-gray-800">Filters</h3>
                    </div>
                    <button 
                        onClick={resetFilters}
                        className="text-sm text-[var(--srh-orange)] hover:text-[var(--srh-gold)]"
                    >
                        Reset All
                    </button>
                </div>

                {/* Filter Content */}
                <div className="p-4 space-y-6">
                    {/* Category Filter */}
                    <div className='filter-section'>
                        <h4 className='text-lg font-semibold text-gray-800 mb-3'>Category</h4>
                        <div className='space-y-2'>
                            {categories.map((category) => (
                                <div key={category} className='flex items-center'>
                                    <input
                                        type='radio'
                                        name='category'
                                        value={category}
                                        onChange={handleFilterChange}
                                        checked={filter.category === category}
                                        className='form-radio text-[var(--srh-orange)] border-gray-300'
                                    />
                                    <label className='ml-2 text-gray-600 hover:text-[var(--srh-orange)]'>
                                        {category}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Collection Filter */}
                    <div className='filter-section'>
                        <h4 className='text-lg font-semibold text-gray-800 mb-3'>Collection</h4>
                        <div className='space-y-2'>
                            {collections.map((collection) => (
                                <div key={collection} className='flex items-center'>
                                    <input
                                        type='radio'
                                        name='collection'
                                        value={collection}
                                        onChange={handleFilterChange}
                                        checked={filter.collection === collection}
                                        className='form-radio text-[var(--srh-orange)] border-gray-300'
                                    />
                                    <label className='ml-2 text-gray-600'>
                                        {collection}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Price Range Filter */}
                    <div className='filter-section'>
                        <h4 className='text-lg font-semibold text-gray-800 mb-3'>Price Range</h4>
                        <div className='space-y-2'>
                            {priceRanges.map((range) => (
                                <div key={range.label} className='flex items-center'>
                                    <input
                                        type='radio'
                                        name='priceRange'
                                        value={`${range.min}-${range.max}`}
                                        onChange={() => {
                                            setFilters({
                                                ...filter,
                                                minPrice: range.min,
                                                maxPrice: range.max
                                            });
                                            updateURLParams({
                                                ...filter,
                                                minPrice: range.min,
                                                maxPrice: range.max
                                            });
                                        }}
                                        checked={filter.minPrice === range.min && filter.maxPrice === range.max}
                                        className='form-radio text-[var(--srh-orange)] border-gray-300'
                                    />
                                    <label className='ml-2 text-gray-600'>
                                        {range.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Material Filter */}
                    <div className='filter-section'>
                        <h4 className='text-lg font-semibold text-gray-800 mb-3'>Material</h4>
                        <div className='grid grid-cols-2 gap-2'>
                            {materials.map((material) => (
                                <div key={material} className='flex items-center'>
                                    <input
                                        type='checkbox'
                                        name='material'
                                        value={material}
                                        onChange={handleFilterChange}
                                        checked={filter.material.includes(material)}
                                        className='form-checkbox text-[var(--srh-orange)] border-gray-300'
                                    />
                                    <label className='ml-2 text-gray-600 text-sm'>
                                        {material}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Gender Filter */}
                    <div className='filter-section'>
                        <h4 className='text-lg font-semibold text-gray-800 mb-3'>For Whom</h4>
                        <div className='grid grid-cols-2 gap-2'>
                            {genders.map((gender) => (
                                <button
                                    key={gender}
                                    onClick={() => handleFilterChange({
                                        target: { name: 'gender', value: gender, type: 'radio' }
                                    })}
                                    className={`
                                        p-2 border rounded-md text-center text-sm
                                        ${filter.gender === gender 
                                            ? 'bg-[var(--srh-orange)] text-white border-[var(--srh-orange)]'
                                            : 'border-gray-300 text-gray-600 hover:border-[var(--srh-orange)]'
                                        }
                                    `}
                                >
                                    {gender}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Size Filter with Grid Layout */}
                    <div className='filter-section'>
                        <h4 className='text-lg font-semibold text-gray-800 mb-3'>Size</h4>
                        <div className='grid grid-cols-3 gap-2'>
                            {sizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => handleFilterChange({
                                        target: { name: 'size', value: size, type: 'checkbox', checked: !filter.size.includes(size) }
                                    })}
                                    className={`
                                        p-2 border rounded-md text-center
                                        ${filter.size.includes(size) 
                                            ? 'bg-[var(--srh-orange)] text-white border-[var(--srh-orange)]'
                                            : 'border-gray-300 text-gray-600 hover:border-[var(--srh-orange)]'
                                        }
                                    `}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Filter with Color Circles */}
                    <div className='filter-section'>
                        <h4 className='text-lg font-semibold text-gray-800 mb-3'>Color</h4>
                        <div className='flex flex-wrap gap-2'>
                            {colors.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => handleFilterChange({
                                        target: { name: 'color', value: color, type: 'radio' }
                                    })}
                                    className={`
                                        w-8 h-8 rounded-full border-2
                                        ${filter.color === color ? 'ring-2 ring-[var(--srh-orange)]' : ''}
                                    `}
                                    style={{ backgroundColor: color.toLowerCase() }}
                                    title={color}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
});

FilterSidebar.displayName = 'FilterSidebar';

export default FilterSidebar;
