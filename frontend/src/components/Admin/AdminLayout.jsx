import React from 'react'
import { Outlet } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
const [isSidebarOpen, setIsSidebarOpen] = useState(false);

const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
};

  return (
    <div className='min-h-screen flex flrc-col md:flex-row relative'>
        {/*Mobile Toggle Button*/} 
        <div className='flex md:hidden p-4 bg-gray-900 text-white z-20'>
            <button onClick={toggleSidebar}>
                <FaBars size={24}/>
            </button>
            <h1 className='ml-4 text-xl font-medium'>Admin Dashboard</h1>
        </div>
        
        {/*Overlay for mobile sidebar*/}
        {isSidebarOpen && (
            <div className='fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden' 
            onClick={toggleSidebar}></div>
        )}

        {/*Sidebar*/}

        <div className={`bg-gray-800 min-h-screen text-white w-64 absolute md:relative p-4 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:translate-x-0 md:static z-20`}>
            <AdminSidebar />
        </div>

        {/*Main Content*/}
        <div className='flex-grow p-4 overflow-auto'>
            <Outlet />
        </div>
    </div>
  )
}

export default AdminLayout
