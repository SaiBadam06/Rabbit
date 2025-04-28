import React from 'react'
import heroImg from '../../assets/OAF_Logo-01[1].png'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <section className='relative'>
      <img 
        src= {heroImg} // Add SRH stadium/team image
        alt="SRH Hero"
        className='w-full h-[400px] md:h-[600px] lg:h-[700px] object-cover'
      />
      <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
        <div className='text-center text-white p-6'>
          <h1 className='text-4xl md:text-9xl font-bold tracking-tighter uppercase mb-4'>
            FanCharge<br/>
          </h1>
          <p className='text-sm md:text-lg tracking-tighter mb-6'>
            Show your support with Sunrisers Hyderabad merchandise
          </p>
          <Link 
            to="/collection/all" 
            className="bg-[var(--srh-orange)] text-white px-6 py-2 text-lg rounded-sm hover:bg-[var(--srh-gold)] transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Hero
