"use client";

import { useState, useEffect } from 'react';

export default function FeaturesSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  const features = [
    {
      id: "01",
      title: "Find trips that fit a flexible lifestyle",
      description: "Search for destinations and accommodations that match your schedule and preferences.",
      color: "bg-blue-100"
    },
    {
      id: "02",
      title: "Travel with more confidence",
      description: "Get detailed information about your destination, including safety tips and local guidelines.",
      color: "bg-purple-100"
    },
    {
      id: "03",
      title: "See what's really included",
      description: "Transparent pricing and amenities information so you know exactly what you're paying for.",
      color: "bg-green-100"
    }
  ];
  
  return (
    <div className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Air, sleep, dream</h2>
          <p className="text-xl text-gray-600">Find trips that fit a flexible lifestyle</p>
        </div>
        
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Left content - Features list */}
          <div className="w-full lg:w-1/2 mb-12 lg:mb-0 pr-0 lg:pr-12 space-y-12">
            {features.map((feature) => (
              <div key={feature.id} className="flex">
                <div className={`flex-shrink-0 ${feature.color} text-blue-600 font-semibold text-sm px-3 py-1 rounded-full mr-4`}>
                  {feature.id}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
            
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-full transition-colors mt-8">
              Start your search
            </button>
          </div>
          
          {/* Right content - Image */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-xl">
              {/* Main image */}
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('/images/flamingo.jpg')` }}></div>
              
              {/* Navigation controls */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white/80 text-gray-800 hover:bg-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white/80 text-gray-800 hover:bg-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              {/* User reviews */}
              <div className="absolute bottom-8 left-8">
                <div className="bg-white rounded-full p-2 shadow-lg flex items-center mb-3">
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
                
                <div className="bg-white rounded-full p-2 shadow-lg flex items-center mb-3 ml-12">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-2 overflow-hidden"></div>
                  <div>
                    <p className="text-sm font-medium">Sharon Moen</p>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xs ml-1">4.5</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-full p-2 shadow-lg flex items-center ml-6">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-2 overflow-hidden"></div>
                  <div>
                    <p className="text-sm font-medium">Chaya Bradtke</p>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xs ml-1">5.0</span>
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