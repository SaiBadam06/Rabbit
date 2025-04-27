import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {useState} from 'react'
import PayPalButton from './PayPalButton'
import { useDispatch, useSelector } from 'react-redux'
import { createCheckout } from '../../redux/slices/checkoutSlice'
import axios from 'axios';




const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {cart, loading, error} = useSelector((state) => state.cart);
  const {user} = useSelector((state) => state.auth);

  const[checkoutId, setCheckoutId] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone:"",
  });

  // ensure cart is loaded before processing/proceeding
  useEffect(() => {
    if(!cart || !cart.products || !cart.products.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  const handleCreateCheckout = async (e) => {
    e.preventDefault();
    if(cart && cart.products.length > 0) {
      const res = await dispatch(
        createCheckout({
          checkoutItems : cart.products,
          shippingAddress,
          paymentMethod: "Paypal",
          totalPrice: cart.totalPrice
      })
    );
    if(res.payload && res.payload._id) {
      setCheckoutId(res.payload._id); //Set Checkout ID if checkout was sucessful
    }
  }
};

  const handlePaymentSucess = async (details) => {
    try{
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        { paymentStatus: "paid", paymentDetails: details },
        {
          headers:{
            Authorization :`Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
        handleFinalizeCheckout(checkoutId); //Finalize checkout if payment is successful
      
    } catch (error) {
      console.error(error);
    }
    navigate("/order-confirmation");

  };

  const handleFinalizeCheckout = async (checkoutId) => {
    try{
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/finalize`,
        { checkoutId },
        {
          headers:{
            Authorization :`Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
        navigate("/order-confirmation");
      
    } catch (error) {
      console.error(error);
    }
  };

  if(loading) return <div>Loading Cart ...</div>;
  if(error) return <div>Error: {error}</div>;
  if(!cart || !cart.products || cart.products.length === 0) {
    return <div>Your cart is empty</div>;
  }

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl max-auto py-10 px-6 tracking-tighter'>
      {/* Left section*/}
      <div className='bg-white p-6 rounded-lg shadow-lg'>
        <h2 className='text-2xl uppercase mb-6'>Checkout</h2>
        <form onSubmit={handleCreateCheckout}>
          <h3 className='text-lg mb-4'>
            Contact Details
          </h3>
          <div className='mb-4'>
            <label className='block text-gray-700'>Email</label>
            <input type="email" 
            value={user? user.email : ""}
            className='w-full p-2 border rounded'
            disabled />
          </div>
          <h3 className='text-lg mb-4'>Delivery</h3>
          <div className='mb-4 grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-gray-700'>First Name</label>
              <input type="text"
              value={shippingAddress.firstName}
              onChange={(e) => 
                setShippingAddress({...shippingAddress, firstName: e.target.value})}
               className='w-full p-2 border rounded'
               required />
            </div>
            <div>
              <label className='block text-gray-700'>Last Name</label>
              <input type="text"
              value={shippingAddress.lastName}
              onChange={(e) => 
                setShippingAddress({...shippingAddress, lastName: e.target.value})}
               className='w-full p-2 border rounded'
               required />
            </div>
          </div>

          <div className='mb-4'>
            <label className='block text-gray-700'>Address</label>
            <input type="text" 
            value={shippingAddress.address}
            onChange={(e) =>
              setShippingAddress({...shippingAddress, address: e.target.value})}
              className='w-full p-2 border rounded'
              required
            />
          </div>
          <div className='mb-4 grid grid-cols-2 gap-4'>
          <div>
              <label className='block text-gray-700'>City</label>
              <input type="text"
              value={shippingAddress.city}
              onChange={(e) => 
                setShippingAddress({...shippingAddress, city: e.target.value})}
               className='w-full p-2 border rounded'
               required />
            </div>
            <div>
              <label className='block text-gray-700'>Postal Code</label>
              <input type="text"
              value={shippingAddress.postalCode}
              onChange={(e) => 
                setShippingAddress({...shippingAddress, postalCode: e.target.value})}
               className='w-full p-2 border rounded'
               required />
            </div>
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700'>Country</label>
            <input 
                type="text" 
                value={shippingAddress.country}
                onChange={(e) =>
                    setShippingAddress({...shippingAddress, country: e.target.value})}
                className='w-full p-2 border rounded'
                required
            />
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700'>Phone</label>
            <input type="text" 
            value={shippingAddress.phone}
            onChange={(e) =>
              setShippingAddress({...shippingAddress, phone: e.target.value})}
              className='w-full p-2 border rounded'
              required
            />
          </div>
          <div className='mt-6'>
            {!checkoutId ? (
              <button
              type='submit'
              className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'
              >
                Continue to Payment
              </button>
            ) : (
              <div >
                <h3 className='text-lg mb-4 '>Pay With PayPal</h3>
                {/* PayPal Component */}
                <PayPalButton 
                amount={cart.totalPrice}
                onSucess={handlePaymentSucess} 
                onError={(err) => FiAlertTriangle("Payment Failed. Try again.")}/>
              </div>
            )}
          </div>
        </form>

      </div>
      <div className='bg-gray-50 p-6 rounded-lg'>
        <h3 className='text-lg mb-4'>Order Summary</h3>
        <div className='border-t py-4 mb-4'>
          {cart.products.map((product, index) => (
            <div key={index} className='flex items-start justify-between py-2 border-2 mb-2'>
              <div className='flex items-start'>
                <img src={product.image} alt={product.name} 
                className='w-20 h-25 object-cover mr-4' />
                
              <div>
                <h3 className='text-md'>{product.name}</h3>
                <p className='text-gray-600'>Size: {product.size}</p>
                <p className='text-gray-600'>Color: {product.color}</p>
              </div>
              
              </div>
              <p className='text-xl'>${product.price.toLocaleString()}</p>
            </div>
          ))}
        </div>

        <div className='flex items-center justify-between text-lg mb-4'>
          <p>Subtotal</p>
          <p>${cart.totalPrice.toLocaleString()}</p>
        </div>
        <div className='flex items-center justify-between text-lg mb-4'>
          <p>Shipping</p>
          <p>free</p>
        </div>
        <div className='flex items-center justify-between text-lg mt-4 border-t pt-4'>
          <p>Total</p>
          <p>${cart.totalPrice.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}

export default Checkout
