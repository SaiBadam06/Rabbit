import React from 'react';
import { IoMdClose } from 'react-icons/io';
import CartContents from '../Cart/CartContents';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { removeFromCart, updateCartItemQuantity } from '../../redux/slices/cartSlice';


const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
  
  const navigate = useNavigate();
  const {user, guestId} = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const userId = user ? user._id : null;

  const handleCheckout = () => {
    toggleCartDrawer();
    // Implement checkout logic here
    if (!user) {
      navigate("/login?redirect=checkout");
    } else {
      navigate('/checkout');
    }
  };
  return (
    <div 
      className={`fixed inset-0 z-50 transition-all duration-300 ${drawerOpen ? 'visible bg-black bg-opacity-50' : 'invisible'}`}
      onClick={toggleCartDrawer} // Close when clicking outside
    >
      <div 
        className={`absolute top-0 right-0 h-full w-3/4 sm:w-1/2 md:w-1/3 lg:w-1/4 bg-white shadow-lg transform transition-transform duration-300 flex flex-col ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Header with close button */}
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-medium">Your Cart</h2>
          <button 
            onClick={toggleCartDrawer}
            className="p-1 text-gray-600 hover:text-black transition-colors"
            aria-label="Close cart"
          >
            <IoMdClose className="h-6 w-6 text-gray-600 hover:text-gray-800" />
          </button>
        </div>

        {/* Cart content with scrollable area */}
        <div className="flex-grow p-4 overflow-y-auto">
          
          <h2 className="text-xl font-semibold mb-4">Your cart</h2>
            {/* Cart items  */}
            {cart && cart?.products?.length > 0 ? (
              <CartContents cart={cart} userId={userId} guestId={guestId} />
            ) : (
              <p className="text-gray-500 text-center">Your cart is empty.</p>
            )}

        </div>

        {/* Checkout footer */}
        <div className="p-4 bg-white sticky bottom-0">
          {cart && cart?.products?.length > 0 && (
            <>
            <button onClick={handleCheckout} className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition">
            Checkout
          </button>
          <p className='text-sm tracking-tighter text-gray-500 mt-2 text-center'>
            Shipping, taxes, and disscount codes calculated at checkout.
          </p>
            </>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;