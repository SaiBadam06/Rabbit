import React, { useEffect } from 'react'
import Hero from '../components/Layout/Hero'
import GenderCollectionSection from '../components/Products/GenderCollectionSection'
import NewArrivals from '../components/Products/NewArrivals'
import ProductDetails from '../components/Products/ProductDetails'
import ProductGrid from '../components/Products/ProductGrid'
import FeaturedCollection from '../components/Products/FeaturedCollection'
import FeaturesSection from '../components/Products/FeaturesSection'
import { useDispatch } from 'react-redux'
import { fetchProductsByFilters } from '../redux/slices/productsSlice'
import { generateNewGuestId } from '../redux/slices/authSlice'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { useState } from 'react'

const Home = () => {

    const dispatch = useDispatch();
    const {products, loading, error } = useSelector((state) => state.products);
    const [bestSellerProduct, setBestSellerProduct] = useState(null);

    useEffect(() => {
        //Fetch products for a specific collection
        dispatch(fetchProductsByFilters({
            gender: "Women",
            category: "Bottom Wear",
            limit: 8,
        })
    );
    //Fetch the best seller product
    const fetchBestSeller = async () => {
        try{
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`
            );
            setBestSellerProduct(response.data);
        } catch(error){
            console.error(error);
        }
    };
    fetchBestSeller();
    }, [dispatch]);

  return (
    <div>
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />

      {/*Besr Seller*/}
      <h2 className="text-3xl text-center font-bold mb-4">Best Seller</h2>
      {bestSellerProduct ? (
        <ProductDetails productId={bestSellerProduct._id} />
      ) : (
        <p className='text-center'>Loading best seller product ...</p>
      )}
      
      {products?.map((product) => (
        <div key={product._id}>
          <img 
            src={product.image || null}  // Add null fallback
            alt={product.name || "Product"}
            className="w-full h-full object-cover"
            onError={(e) => {
                e.target.onerror = null; // Prevent infinite loop
                e.target.src = null;
                e.target.alt = "Image not available";
            }}
          />
        </div>
      ))}

      <div className='container mx-auto'>
      <h2 className='text-3xl text-center font-bold mb-4'> Top Wear for Women </h2>
      <ProductGrid products={products} loading={loading} error={error} />

      </div>
      <FeaturedCollection />
      <FeaturesSection />
    </div>
  )
}

export default Home;
