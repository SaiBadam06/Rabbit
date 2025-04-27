import React from 'react';

const ProductDetails = () => {
    return (
        <div>
            {product && (
                <div>
                    <img 
                        src={product.image || null}  // Ensure null fallback
                        alt={product.name || "Product"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.onerror = null; // Prevent infinite loop
                            e.target.src = null;
                            e.target.alt = "Product image not available";
                        }}
                    />
                </div>
            )}
        </div>
    );
}

export default ProductDetails;