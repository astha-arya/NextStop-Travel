"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/utils/api';

export default function DestinationDetail() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  const [destinationData, setDestinationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchDestinationData = async () => {
      try {
        const data = await api.getDestination(id);
        setDestinationData(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching destination:", err);
        setError("Failed to load destination details");
        setLoading(false);
      }
    };

    fetchDestinationData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading destination details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-red-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => router.back()} 
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!destinationData) {
    return null;
  }


  const getPopularAttractions = () => {
    if (!destinationData.Popular_Attractions) return [];
    return destinationData.Popular_Attractions.split(',').map(item => item.trim());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-6 pb-16">
        {/* Hero section with main image and basic info */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Destination Hero */}
          <div className="relative h-[500px] rounded-3xl overflow-hidden mb-8">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${destinationData.Image_URL || '/images/packages/mountain-view.jpg'}')` }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
              <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                {destinationData.Featured && (
                  <div className="inline-block bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    FEATURED DESTINATION
                  </div>
                )}
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{destinationData.Name}</h1>
                <p className="text-xl text-gray-200 mb-4">{destinationData.Location}</p>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-white ml-2">{destinationData.Rating} ({destinationData.Review_Count}+ reviews)</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Destination content */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main content */}
            <div className="w-full lg:w-2/3">
              {/* Tabs navigation */}
              <div className="border-b border-gray-200 mb-6">
                <div className="flex space-x-8">
                  {[
                    { id: "overview", label: "Overview" },
                    { id: "attractions", label: "Attractions" },
                    { id: "reviews", label: "Reviews" },
                  ].map(tab => (
                    <button 
                      key={tab.id}
                      className={`pb-4 font-medium transition-all relative ${
                        activeTab === tab.id 
                          ? "text-gray-900" 
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                      {activeTab === tab.id && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full transform scale-x-100 transition-transform"></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Tab content */}
              <div className="mb-8">
                {activeTab === "overview" && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">About {destinationData.Name}</h2>
                    <p className="text-gray-700 mb-6">{destinationData.Long_Description || destinationData.Description}</p>
                    
                    {destinationData.Best_Season && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                          <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            Best Season to Visit
                          </h3>
                          <p className="text-gray-600">{destinationData.Best_Season}</p>
                        </div>
                        
                        {destinationData.Weather_Info && (
                          <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                              </svg>
                              Weather Information
                            </h3>
                            <p className="text-gray-600">{destinationData.Weather_Info}</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Image */}
                    <div className="mt-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Destination Image</h3>
                      <div className="relative h-64 rounded-xl overflow-hidden">
                        <div 
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url('${destinationData.Image_URL || '/images/packages/mountain-view.jpg'}')` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === "attractions" && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Attractions</h2>
                    
                    {getPopularAttractions().length > 0 ? (
                      <div className="grid grid-cols-1 gap-6">
                        {getPopularAttractions().map((attraction, index) => (
                          <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              {attraction.includes(' - ') ? attraction.split(' - ')[0] : attraction}
                            </h3>
                            <p className="text-gray-600">
                              {attraction.includes(' - ') ? attraction.split(' - ')[1] : `Experience this amazing attraction at ${destinationData.Name}.`}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white rounded-xl p-6 shadow-sm">
                        <p className="text-gray-600">No attractions information available for this destination.</p>
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab === "reviews" && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Traveler Reviews</h2>
                      <button className="bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Write a Review
                      </button>
                    </div>
                    
                    {/* Implement fetching reviews from API here */}
                    <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                      <p className="text-gray-600">
                        This destination has {destinationData.Review_Count || 0} reviews with an average rating of {destinationData.Rating || 'N/A'}.
                      </p>
                      <p className="text-gray-600 mt-2">
                        Please check back later as we're currently gathering more detailed reviews.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="w-full lg:w-1/3">
x
              
              {/* Travel info */}
              <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 mb-6">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Destination Information</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-600">
                        <span className="font-medium">Category:</span> {destinationData.Category || 'General'}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-600">
                        <span className="font-medium">Rating:</span> {destinationData.Rating || 'N/A'} ({destinationData.Review_Count || 0} reviews)
                      </span>
                    </li>
                    {destinationData.Best_Season && (
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-600">
                          <span className="font-medium">Best Time to Visit:</span> {destinationData.Best_Season}
                        </span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
              
              {/* Call to action */}
              <div className="bg-blue-50 rounded-xl overflow-hidden shadow-sm border border-blue-100">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Explore This Destination</h3>
                  <p className="text-gray-600 mb-4">
                    Ready to experience {destinationData.Name}? Check out our vacation packages and start planning your trip today.
                  </p>
                  <Link 
                    href={`/packages?destination=${destinationData.Destination_ID}`}
                    className="w-full block text-center bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse Available Packages
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}