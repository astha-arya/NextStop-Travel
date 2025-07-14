"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { api } from '@/utils/api';

export default function DestinationsList() {
    const [destinations, setDestinations] = useState([]);
    const [filteredDestinations, setFilteredDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const [isLoaded, setIsLoaded] = useState(false);

  
    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const data = await api.getDestinations();
                
          
                const processedData = data.map(dest => ({
                    ...dest,
                    id: dest.Destination_ID,
                    name: dest.Name,
                    location: dest.Location,
                    description: dest.Description,
                    image: dest.Image_URL || '/images/packages/mountain-view.jpg',
                    category: dest.Category || 'other',
                    rating: dest.Rating || 4.5,
                    reviewCount: dest.Review_Count || 0,
               
                    popularAttractions: dest.Popular_Attractions ? 
                        dest.Popular_Attractions.split(',').map(item => item.trim()) : 
                        ['Attraction 1', 'Attraction 2', 'Attraction 3']
                }));
                
                setDestinations(processedData);
                setFilteredDestinations(processedData);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching destinations:", err);
                setError("Failed to load destinations");
                setLoading(false);
            }
        };

        fetchDestinations();
    }, []);

    useEffect(() => {
        setIsLoaded(true);
    }, []);


    useEffect(() => {
        let filtered = [...destinations];
        

        if (activeFilter !== "all") {
            filtered = filtered.filter(dest => dest.category === activeFilter);
        }
        
      
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(dest => 
                dest.name.toLowerCase().includes(query) ||
                dest.location.toLowerCase().includes(query) ||
                (dest.description && dest.description.toLowerCase().includes(query))
            );
        }
        
        setFilteredDestinations(filtered);
    }, [searchQuery, activeFilter, destinations]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-7xl mx-auto px-4 py-12 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading destinations...</p>
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
                            onClick={() => window.location.reload()} 
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            
            <main className="pt-6 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Hero section */}
                    <div className="relative h-[400px] rounded-3xl overflow-hidden mb-12">
                        <div className="absolute inset-0 bg-center bg-cover" style={{ backgroundImage: "url('/images/packages/beach-aerial.jpg')" }}></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-black/40 flex items-center">
                            <div className="px-8 md:px-12 w-full md:w-2/3 lg:w-1/2">
                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Discover Amazing Destinations</h1>
                                <p className="text-xl text-gray-200 mb-8">Explore our handpicked collection of the world's most breathtaking places</p>
                                
                                {/* Search box */}
                                <div className="relative max-w-md">
                                    <input 
                                        type="text" 
                                        placeholder="Search destinations..." 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full px-5 py-3 pr-12 rounded-full border-0 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <div className="absolute right-3 top-3 text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Filters */}
                    <div className="mb-8">
                        <div className="flex space-x-3 overflow-x-auto pb-2">
                            {[
                                { id: "all", label: "All Destinations" },
                                { id: "beaches", label: "Beaches" },
                                { id: "mountains", label: "Mountains" },
                                { id: "cities", label: "Cities" },
                            ].map(filter => (
                                <button
                                    key={filter.id}
                                    className={`flex items-center px-4 py-2.5 rounded-full transition-all duration-300 ${
                                        activeFilter === filter.id
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                    onClick={() => setActiveFilter(filter.id)}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {/* Destinations grid */}
                    {filteredDestinations.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredDestinations.map((destination) => (
                                <Link
                                    key={destination.id}
                                    href={`/destinations/${destination.id}`}
                                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
                                >
                                    <div className="relative h-56 overflow-hidden">
                                        <div className="absolute inset-0 bg-gray-200"></div>
                                        <div 
                                            className="absolute inset-0 bg-cover bg-center" 
                                            style={{ backgroundImage: `url('${destination.image}')` }}
                                        ></div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                        <div className="absolute bottom-4 left-4">
                                            <h3 className="text-xl font-bold text-white mb-1">{destination.name}</h3>
                                            <p className="text-gray-200 flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {destination.location}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="p-6 flex-grow">
                                        <p className="text-gray-600 mb-4">{destination.description}</p>
                                        
                                        <h4 className="text-sm font-medium text-gray-900 mb-2">Popular Attractions:</h4>
                                        <ul className="space-y-1 mb-4">
                                            {destination.popularAttractions.slice(0, 2).map((attraction, index) => (
                                                <li key={index} className="text-sm text-gray-600 flex items-start">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mr-1 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    {attraction}
                                                </li>
                                            ))}
                                            {destination.popularAttractions.length > 2 && (
                                                <li className="text-sm text-gray-600">
                                                    <span className="text-blue-600 ml-5">+ {destination.popularAttractions.length - 2} more</span>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                    
                                    <div className="p-4 border-t border-gray-100 mt-auto">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <span className="ml-1 text-gray-700 text-sm font-medium">{destination.rating}</span>
                                                <span className="ml-1 text-gray-500 text-sm">({destination.reviewCount} reviews)</span>
                                            </div>
                                            <div className="text-blue-600 text-sm font-medium">View Details</div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl p-8 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No destinations found</h3>
                            <p className="text-gray-600 mb-4">
                                We couldn't find any destinations matching your search. Try adjusting your filters or search terms.
                            </p>
                            <button 
                                onClick={() => { setSearchQuery(""); setActiveFilter("all"); }}
                                className="text-blue-600 font-medium"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                    

                    {filteredDestinations.length > 0 && (
                        <div className="flex justify-center mt-12">
                            <nav className="flex items-center">
                                <button className="h-10 w-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                
                                <div className="mx-2">
                                    <button className="h-10 w-10 flex items-center justify-center rounded-lg bg-blue-600 text-white">1</button>
                                </div>
                                <div className="mx-2">
                                    <button className="h-10 w-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">2</button>
                                </div>
                                
                                <button className="h-10 w-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </nav>
                        </div>
                    )}
                    
                    {/* Newsletter */}
                    <div className="mt-16 bg-blue-600 rounded-2xl overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/2 p-8 md:p-12">
                                <h2 className="text-3xl font-bold text-white mb-4">Get Travel Inspiration</h2>
                                <p className="text-blue-100 mb-6">Subscribe to our newsletter and receive exclusive offers, travel tips, and destination updates.</p>
                                
                                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                                    <input 
                                        type="email" 
                                        placeholder="Your email address" 
                                        className="px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 flex-grow"
                                    />
                                    <button className="bg-white text-blue-600 font-medium px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors">
                                        Subscribe
                                    </button>
                                </div>
                                
                                <p className="text-blue-200 text-sm mt-4">
                                    By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
                                </p>
                            </div>
                            
                            <div className="md:w-1/2 relative h-60 md:h-auto">
                                <div 
                                    className="absolute inset-0 bg-cover bg-center" 
                                    style={{ backgroundImage: "url('/images/packages/beach-resort.jpg')" }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}