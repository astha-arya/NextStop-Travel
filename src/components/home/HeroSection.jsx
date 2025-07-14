"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoverEffect, setHoverEffect] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    

    const timer = setTimeout(() => {
      setHoverEffect(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-3xl group">
      {/* Background color before image loads */}
      <div className="absolute inset-0 bg-gray-800"></div>
      
      {/* Hero image */}
      <div className="relative w-full h-[600px]">
        <Image
          src="/images/hero-cabin.jpg"
          alt="Yellow cabin with mountains in background"
          fill
          className="object-cover brightness-75"
          priority
          onLoad={() => setIsLoaded(true)}
        />
        


        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/10">
          {/* Animated particle effects */}
          <div className="absolute inset-0 overflow-hidden opacity-30">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className={`absolute rounded-full bg-white transform transition-transform duration-3000 ease-in-out ${
                  hoverEffect ? 'translate-y-[-100px]' : ''
                }`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 8 + 2}px`,
                  height: `${Math.random() * 8 + 2}px`,
                  opacity: Math.random() * 0.5 + 0.3,
                  transitionDelay: `${Math.random() * 2000}ms`,
                }}
              ></div>
            ))}
          </div>
          
          {/* Content section */}
          <div className="p-16 text-left h-full flex flex-col justify-center relative z-10">
            <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-block bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-6">
                DISCOVER AMAZING PLACES
              </div>
              <h1 className="text-7xl font-bold text-white mb-4">
                Air, sleep,<br />dream
              </h1>
              <p className="text-xl text-gray-200 mb-8 max-w-md">Find and book a great experience.</p>

            </div>
          </div>
          
          {/* Featured destination card */}
          <div className={`absolute bottom-36 right-16 bg-gray-900/60 backdrop-blur-lg p-5 rounded-2xl shadow-lg transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`} style={{ transitionDelay: '0.4s' }}>
            <div className="flex items-center">
              <div className="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-blue-400 font-medium">FEATURED DESTINATION</p>
                <p className="text-white font-medium">Lofoten Islands, Norway</p>
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-white text-xs ml-1">4.9 (2.5k)</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Floating illustrations */}
      <div className={`absolute top-24 left-1/2 w-16 h-16 transition-all duration-1000 ${isLoaded ? 'opacity-20 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '1s' }}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
          <path d="M3 17L9 11L13 15L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17 7H21V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}