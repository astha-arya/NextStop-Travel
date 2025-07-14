"use client";

import { useState, useEffect } from 'react';

export default function TourPackages() {
  const [filterActive, setFilterActive] = useState('featured');
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  const packages = [
    {
      id: 1,
      title: "The grand resort",
      location: "Karineside",
      originalPrice: "$599",
      currentPrice: "$548",
      dates: "Tue, Jul 20 - Fri, Jul 23",
      rating: 4.9,
      image: "/images/packages/winter-cabin.jpg",
      badge: "Trending"
    },
    {
      id: 2,
      title: "The grand resort",
      location: "East Barrett",
      originalPrice: "$355",
      currentPrice: "$288",
      dates: "Tue, Jul 20 - Fri, Jul 23",
      rating: 4.8,
      image: "/images/packages/beach-resort.jpg"
    },
    {
      id: 3,
      title: "The grand resort",
      location: "Steuberbury",
      originalPrice: "$385",
      currentPrice: "$367",
      dates: "Tue, Jul 20 - Fri, Jul 23",
      rating: 4.8,
      image: "/images/packages/wheat-field.jpg",
      badge: "Popular"
    },
    {
      id: 4,
      title: "The grand resort",
      location: "Idaview",
      originalPrice: "$355",
      currentPrice: "$288",
      dates: "Tue, Jul 20 - Fri, Jul 23",
      rating: 4.9,
      image: "/images/packages/mountain-view.jpg"
    },
    {
      id: 5,
      title: "The grand resort",
      location: "Yasminfurt",
      originalPrice: "$355",
      currentPrice: "$267",
      dates: "Tue, Jul 20 - Fri, Jul 23",
      rating: 4.7,
      image: "/images/packages/beach-aerial.jpg"
    },
    {
      id: 6,
      title: "The grand resort",
      location: "North Edenshire",
      originalPrice: "$599",
      currentPrice: "$288",
      dates: "Tue, Jul 20 - Fri, Jul 23",
      rating: 4.8,
      image: "/images/packages/island-view.jpg",
      badge: "Last minute"
    },
    {
      id: 7,
      title: "The grand resort",
      location: "Archibaldtown",
      originalPrice: "$599",
      currentPrice: "$548",
      dates: "Tue, Jul 20 - Fri, Jul 23",
      rating: 4.9,
      image: "/images/packages/winter-cabin-2.jpg"
    },
    {
      id: 8,
      title: "The grand resort",
      location: "West Gregoria",
      originalPrice: "$355",
      currentPrice: "$267",
      dates: "Tue, Jul 20 - Fri, Jul 23",
      rating: 4.7,
      image: "/images/packages/mountain-cabin.jpg"
    }
  ];


  const filters = [
    { id: 'featured', label: 'Featured', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
    { id: 'family', label: 'Family-friendly', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { id: 'sale', label: 'On sale', icon: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z' },
    { id: 'subnav', label: 'Sub nav', icon: 'M4 6h16M4 12h16M4 18h16' }
  ];
  
  return (
    <div className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3 transition-opacity duration-700 ease-in-out" style={{ opacity: isLoaded ? 1 : 0 }}>Go somewhere</h2>
          <p className="text-xl text-gray-600 transition-opacity duration-700 ease-in-out delay-100" style={{ opacity: isLoaded ? 1 : 0 }}>Let's go on an adventure</p>
        </div>
        
        <div className="flex flex-wrap justify-between items-center mb-10">
          {/* Filter tabs */}
          <div className="flex space-x-3 overflow-x-auto pb-2 transition-opacity duration-700 ease-in-out delay-200" style={{ opacity: isLoaded ? 1 : 0 }}>
            {filters.map(filter => (
              <button
                key={filter.id}
                className={`flex items-center px-4 py-2.5 rounded-full transition-all duration-300 ${
                  filterActive === filter.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setFilterActive(filter.id)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d={filter.icon} clipRule="evenodd" />
                </svg>
                {filter.label}
              </button>
            ))}
          </div>
          
          {/* Sort dropdown */}
          <div className="relative mt-4 sm:mt-0 transition-opacity duration-700 ease-in-out delay-300" style={{ opacity: isLoaded ? 1 : 0 }}>
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-200 rounded-full py-2.5 pl-4 pr-10 text-gray-700 cursor-pointer focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all">
                <option>Recently added</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Package grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-opacity duration-700 ease-in-out delay-400" style={{ opacity: isLoaded ? 1 : 0 }}>
          {packages.map((pkg, index) => (
            <div 
              key={pkg.id} 
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className="relative h-52 overflow-hidden group">
                <div className="absolute inset-0 bg-gray-200"></div>
                <div 
                  className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700" 
                  style={{ backgroundImage: `url('${pkg.image}')` }}
                ></div>
                {pkg.badge && (
                  <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    {pkg.badge}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{pkg.title}</h3>
                    <p className="text-gray-500 flex items-center text-sm mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {pkg.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 line-through text-xs">{pkg.originalPrice}</p>
                    <p className="text-blue-600 font-semibold">{pkg.currentPrice}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                  <p className="text-gray-500 text-sm">{pkg.dates}</p>
                  <div className="flex items-center bg-gray-50 px-2 py-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-gray-700 text-sm font-medium">{pkg.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}