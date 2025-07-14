"use client";

import { useState, useEffect } from 'react';

export default function ExploreNearby() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  const firstRowDestinations = [
    {
      id: 1,
      name: "Thompsonbury",
      distance: "15 minutes drive",
      image: "/images/nearby/boat-dock.jpg",

    },
    {
      id: 2,
      name: "Hudsontown",
      distance: "2 hours drive",
      image: "/images/nearby/mountain-cabin.jpg",
    },
    {
      id: 3,
      name: "Lake Marcelle",
      distance: "15 minutes drive",
      image: "/images/nearby/beach-palm.jpg",

    },
    {
      id: 4,
      name: "New Keagan",
      distance: "15 minutes drive",
      image: "/images/nearby/beach-aerial.jpg",
    },
    {
      id: 5,
      name: "MacGyverton",
      distance: "2 hours drive",
      image: "/images/nearby/winter-cabin.jpg",
    }
  ];
  

  

  const DestinationCard = ({ destination }) => (
    <div className="bg-white p-5 rounded-lg hover:shadow-sm transition-shadow duration-300 cursor-pointer">
      <div className="relative mb-3">
        <div className="absolute top-2 left-2 bg-white py-0.5 px-2 text-gray-800 text-xs font-medium rounded">
          {destination.price}
        </div>
        <div className="w-full h-0 pb-[100%] rounded-full overflow-hidden bg-gray-200 relative">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${destination.image}')` }}
          ></div>
        </div>
      </div>
      
      <div className="text-center">
        <h3 className="text-base font-medium text-gray-900 mb-0.5">
          {destination.name}
        </h3>
        <p className="text-sm text-gray-500">
          {destination.distance}
        </p>
      </div>
    </div>
  );
  
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Explore nearby</h2>
          <p className="text-lg text-gray-600">10,789 beautiful places to go</p>
        </div>
        
        {/* First row - 5 destinations */}
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-6 mb-6">
          {firstRowDestinations.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>

      </div>
    </div>
  );
}