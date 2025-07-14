"use client";

import { useState, useEffect } from 'react';

export default function LiveAnywhere() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  const categories = [
    {
      id: 1,
      title: "Enjoy the great cold",
      properties: "6,879 properties",
      image: "/images/categories/winter-cabin.jpg"
    },
    {
      id: 2,
      title: "Pick up the earliest sunrise",
      properties: "6,879 properties",
      image: "/images/categories/countryside-home.jpg"
    },
    {
      id: 3,
      title: "Unique stay",
      properties: "6,879 properties",
      image: "/images/categories/lakeside-cabins.jpg"
    }
  ];
  
  return (
    <div className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Live anywhere</h2>
          <p className="text-xl text-gray-600">Keep calm & travel on</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div 
              key={category.id}
              className="rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
            >
              <div className="relative h-80">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${category.image}')` }}
                ></div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-1">{category.title}</h3>
                <p className="text-gray-500">{category.properties}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-12">
          <button className="flex items-center justify-center space-x-2 px-6 py-3 bg-white border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            <span>Load more</span>
          </button>
        </div>
      </div>
    </div>
  );
}