import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import register from '../assets/register.webp'
import { registerUser } from '../redux/slices/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { mergeCart } from '../redux/slices/cartSlice'

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const {user, guestId, loading } = useSelector((state) => state.auth);
    const {cart} = useSelector((state) => state.cart);

    //get redirect paramenter and check if it's checkoutor something
    const redirect = new URLSearchParams(location.search).get('redirect') || '/';
    const isCheckoutRedirect = redirect.includes("checkout");

    useEffect(() => {
        if(user){
            if (cart?.products.length > 0 && guestId){
                dispatch(mergeCart({guestId: guestId, user})).then(() => {
                    navigate(isCheckoutRedirect ? '/checkout' : '/');
                });
            } else {
                navigate(isCheckoutRedirect ? '/checkout' : '/');
            }
        }
    }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch]);


    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        dispatch(registerUser({ name, email, password }))
            .unwrap()
            .catch(err => setError(err.message))
            .finally(() => setIsLoading(false));
    }

    return (
        <div className='flex h-screen'>
            <div className='w-full md:w-1/2 flex flex-col justify-center items-center p-4 md:p-8'>
                <form onSubmit={handleSubmit} className='w-full max-w-md bg-white p-8 rounded-lg shadow-md'>
                    {error && (
                        <div className='mb-4 p-2 text-red-500 text-center bg-red-50 rounded'>
                            {error}
                        </div>
                    )}
                    <div className='flex justify-center mb-6'>
                        <h2 className='text-2xl font-medium'>Rabbit</h2>
                    </div>
                    <h2 className='text-2xl font-bold text-center mb-4'>Create Your Account</h2>
                    <p className='text-center text-gray-600 mb-6'>
                        Join us by filling out the form below
                    </p>
                    <div className='mb-4'>
                        <label className='block text-sm font-semibold mb-2'>Full Name</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black'
                            placeholder='Enter your full name'
                            required
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-sm font-semibold mb-2'>Email</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black'
                            placeholder='Enter your email address'
                            required
                        />
                    </div>
                    <div className='mb-6'>
                        <label className='block text-sm font-semibold mb-2'>Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black'
                            placeholder='Create a password'
                            required
                        />
                    </div>
                    <button 
                        type='submit' 
                        disabled={isLoading}
                        className='w-full bg-black text-white p-3 rounded-lg font-semibold hover:bg-gray-800 transition duration-200 disabled:bg-gray-400'
                    >
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </button>
                    <p className='mt-6 text-center text-sm text-gray-600'>
                        Already have an account?{' '}
                        <Link 
                            to={`/login?redirect=${encodeURIComponent(redirect)}`} 
                            className='text-blue-500 hover:text-blue-700 font-medium'
                        >
                            Login
                        </Link>
                    </p>
                </form>
            </div>
            <div className='hidden md:flex w-1/2 bg-gray-100'>
                <div className='h-full w-full flex justify-center items-center'>
                    <img 
                        src={register || null} 
                        alt="Register" 
                        className='h-full w-full object-cover'
                        onError={(e) => {
                            e.target.src = null;
                            e.target.alt = "Image not available";
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default Register