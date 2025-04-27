import React, { useEffect } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import login from '../assets/login.webp'
import { loginUser } from '../redux/slices/authSlice'
import { useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { mergeCart } from '../redux/slices/cartSlice'

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const {user, guestId, loading} = useSelector((state) => state.auth);
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
        // Handle login logic here
        dispatch(loginUser({ email, password }));
    }

    return (
        <div className='flex h-screen'>
            <div className='w-full md:w-1/2 flex flex-col justify-center items-center p-4 md:p-8'>
                <form onSubmit={handleSubmit} className='w-full max-w-md bg-white p-8 rounded-lg shadow-md'>
                    <div className='flex justify-center mb-6'>
                        <h2 className='text-2xl font-medium'>Rabbit</h2>
                    </div>
                    <h2 className='text-2xl font-bold text-center mb-4'>Hey There!</h2>
                    <p className='text-center text-gray-600 mb-6'>
                        Enter username and password to login
                    </p>
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
                            placeholder='Enter your password'
                            required
                        />
                    </div>
                    <button 
                        type='submit' 
                        className='w-full bg-black text-white p-3 rounded-lg font-semibold hover:bg-gray-800 transition duration-200'
                    >
                        {loading ? "loading ..." : "Sign In"}
                    </button>
                    <p className='mt-6 text-center text-sm text-gray-600'>
                        Don't have an account? {' '}
                        <Link 
                            to={`/register?redirect=${encodeURIComponent(redirect)}`} 
                            className='text-blue-500 hover:text-blue-700 font-medium'
                        >
                            Register
                        </Link>
                    </p>
                </form>
            </div>
            <div className='hidden md:flex w-1/2 bg-gray-100'>
                <div className='h-full w-full flex justify-center items-center'>
                    <img 
                        src={login} 
                        alt="Login" 
                        className='h-full w-full object-cover'
                    />
                </div>
            </div>
        </div>
    )
}

export default Login