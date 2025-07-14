"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function MobileAppShowcase() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  return (
    <div className="bg-[#f0f7fb] py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Left content */}
          <div className="w-full lg:w-1/2 mb-12 lg:mb-0 pr-0 lg:pr-12">
            <div className="max-w-lg">
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">
                SUPERCHARGE YOUR PLANNING POWERS
              </p>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Travel to make memories all around the world
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Find and book amazing travel experiences with our mobile app. Get personalized recommendations and exclusive deals.
              </p>
              
              <div className="relative max-w-md">
                <input 
                  type="text" 
                  placeholder="Enter your phone number" 
                  className="w-full px-4 py-3 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button className="absolute right-1 top-1 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Right content - Mobile app illustration */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative w-full h-[600px]">
              {/* Colored circles background */}
              <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full opacity-70"></div>
                <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-orange-300 rounded-full opacity-70"></div>
                <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-green-200 rounded-full opacity-70"></div>
                <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-green-500 rounded-full"></div>
                <div className="absolute top-1/5 right-1/4 w-4 h-4 bg-white rounded-full"></div>
                <div className="absolute top-1/6 right-1/8 w-6 h-6 bg-blue-500 rounded-full"></div>
                <div className="absolute bottom-1/3 right-1/3 w-8 h-8 bg-white rounded-sm rotate-12"></div>
              </div>
              
              {/* Phone mockup */}
              <div className="relative z-10 w-[320px] h-[650px] mx-auto">
                <div className="absolute inset-0 bg-black rounded-[40px] shadow-xl overflow-hidden border-8 border-black">
                  {/* App screen */}
                  <div className="absolute inset-0 bg-white">
                    {/* App header */}
                    <div className="flex justify-between items-center p-4">
                      <div className="flex items-center">
                        <div className="bg-blue-600 h-8 w-8 rounded flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                        </div>
                        <span className="text-gray-900 font-bold text-xl ml-2">fleet</span>
                      </div>
                      <div className="h-8 w-8 bg-gray-300 rounded-full overflow-hidden">
                        <div className="bg-gray-300 h-full w-full"></div>
                      </div>
                    </div>
                    
                    {/* App content */}
                    <div className="px-4 pt-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Where do you want to explore?</h3>
                      
                      <div className="mb-4 relative">
                        <div className="absolute right-3 top-3 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                          1480
                        </div>
                      </div>
                      
                      {/* Search input */}
                      <div className="bg-gray-100 p-4 rounded-xl mb-4">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Location</p>
                            <p className="text-xs text-gray-500">Where are you going?</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Destination preview */}
                      <div className="flex justify-end">
                        <div className="flex flex-col items-end">
                          <div className="w-16 h-16 bg-gray-200 rounded-full mb-1 overflow-hidden relative">
                            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('/images/nearby/cabin-hill.jpg')` }}></div>
                          </div>
                          <p className="text-sm font-medium text-gray-900">MacGyverton</p>
                          <p className="text-xs text-gray-500">15 minutes drive</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* User bubble */}
                <div className="absolute bottom-20 left-0 transform -translate-x-1/2 bg-white rounded-full p-2 shadow-lg flex items-center z-20">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-2 overflow-hidden"></div>
                  <div>
                    <p className="text-sm font-medium">Antone Heller</p>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xs ml-1">4.8</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}