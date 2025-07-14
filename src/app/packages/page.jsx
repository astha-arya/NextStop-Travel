"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { api } from '@/utils/api';

export default function PackagesList() {
    const [packages, setPackages] = useState([]);
    const [filteredPackages, setFilteredPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const [sortBy, setSortBy] = useState("recommended");
    const [priceRange, setPriceRange] = useState([0, 5000]);
    const [duration, setDuration] = useState([1, 14]);
    const [isLoaded, setIsLoaded] = useState(false);
    
    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const data = await api.getPackages();
                

                const processedData = data.map(pkg => ({
                    ...pkg,
                    id: pkg.Package_ID,
                    title: pkg.Package_Name,
                    location: pkg.Location,
                    description: pkg.Description || 'Experience this amazing package.',
                    price: pkg.Price,
                    originalPrice: pkg.Original_Price,
                    duration: pkg.Duration || 7,
                    category: pkg.Category || 'adventure',
                    image: pkg.Image_URL || '/images/packages/mountain-view.jpg',
                    rating: pkg.Rating || 4.5,
                    activities: ['Hiking', 'Sightseeing', 'Cultural Tours'],
                    availability: ['June 2023', 'July 2023', 'August 2023']
                }));
                
                setPackages(processedData);
                setFilteredPackages(processedData);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching packages:", err);
                setError("Failed to load packages");
                setLoading(false);
            }
        };

        fetchPackages();
    }, []);

    useEffect(() => {
        setIsLoaded(true);
    }, []);
  

    useEffect(() => {
        let filtered = [...packages];
        
      
        if (activeFilter !== "all") {
            filtered = filtered.filter(pkg => pkg.category === activeFilter);
        }
        

        filtered = filtered.filter(pkg => pkg.price >= priceRange[0] && pkg.price <= priceRange[1]);
        
   
        filtered = filtered.filter(pkg => pkg.duration >= duration[0] && pkg.duration <= duration[1]);
        
  
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(pkg => 
                pkg.title.toLowerCase().includes(query) ||
                pkg.location.toLowerCase().includes(query) ||
                (pkg.description && pkg.description.toLowerCase().includes(query)) ||
                (pkg.activities && pkg.activities.some(activity => activity.toLowerCase().includes(query)))
            );
        }
        

        switch (sortBy) {
            case "price-low-high":
                filtered.sort((a, b) => a.price - b.price);
                break;
            case "price-high-low":
                filtered.sort((a, b) => b.price - a.price);
                break;
            case "duration-short-long":
                filtered.sort((a, b) => a.duration - b.duration);
                break;
            case "duration-long-short":
                filtered.sort((a, b) => b.duration - a.duration);
                break;
            case "rating":
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case "recommended":
            default:
     
                filtered.sort((a, b) => {
                    if (a.featured && !b.featured) return -1;
                    if (!a.featured && b.featured) return 1;
                    return b.rating - a.rating;
                });
                break;
        }
        
        setFilteredPackages(filtered);
    }, [searchQuery, activeFilter, sortBy, priceRange, duration, packages]);

    
    const handlePriceChange = (e) => {
        const value = parseInt(e.target.value);
        setPriceRange([0, value]);
    };
    

    const handleDurationChange = (e) => {
        const value = parseInt(e.target.value);
        setDuration([1, value]);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-7xl mx-auto px-4 py-12 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading packages...</p>
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
                        <div className="absolute inset-0 bg-center bg-cover" style={{ backgroundImage: "url('/images/packages/mountain-view.jpg')" }}></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-black/40 flex items-center">
                            <div className="px-8 md:px-12 w-full md:w-2/3 lg:w-1/2">
                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Find Your Perfect Trip</h1>
                                <p className="text-xl text-gray-200 mb-8">Browse our curated selection of premium travel packages</p>
                                
                                {/* Search box */}
                                <div className="relative max-w-md">
                                    <input 
                                        type="text" 
                                        placeholder="Search destinations, activities..." 
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
                    
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar filters */}
                        <div className="w-full lg:w-1/4">
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Filters</h2>
                                
                                {/* Category filter */}
                                <div className="mb-6">
                                    <h3 className="text-sm font-medium text-gray-900 mb-2">Package Type</h3>
                                    <div className="space-y-2">
                                        {[
                                            { id: "all", label: "All Packages" },
                                            { id: "adventure", label: "Adventure" },
                                            { id: "beach", label: "Beach" },
                                            { id: "cultural", label: "Cultural" },
                                            { id: "luxury", label: "Luxury" },
                                            { id: "city", label: "City Break" },
                                            { id: "cruise", label: "Cruise" }
                                        ].map(filter => (
                                            <label key={filter.id} className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="category"
                                                    checked={activeFilter === filter.id}
                                                    onChange={() => setActiveFilter(filter.id)}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="ml-2 text-gray-700">{filter.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Price range */}
                                <div className="mb-6">
                                    <h3 className="text-sm font-medium text-gray-900 mb-2">Price Range</h3>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-gray-600 text-sm">₹0</span>
                                        <span className="text-gray-600 text-sm">₹{priceRange[1]}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="5000"
                                        step="100"
                                        value={priceRange[1]}
                                        onChange={handlePriceChange}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="mt-2 text-sm text-gray-700">
                                        Max: ₹{priceRange[1]}
                                    </div>
                                </div>
                                
                                {/* Duration */}
                                <div className="mb-6">
                                    <h3 className="text-sm font-medium text-gray-900 mb-2">Duration (days)</h3>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-gray-600 text-sm">1</span>
                                        <span className="text-gray-600 text-sm">{duration[1]}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="14"
                                        step="1"
                                        value={duration[1]}
                                        onChange={handleDurationChange}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="mt-2 text-sm text-gray-700">
                                        Max: {duration[1]} days
                                    </div>
                                </div>
                                
                                {/* Reset filters */}
                                <button
                                    onClick={() => {
                                        setActiveFilter("all");
                                        setPriceRange([0, 5000]);
                                        setDuration([1, 14]);
                                        setSearchQuery("");
                                    }}
                                    className="w-full bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                        
                        {/* Main content */}
                        <div className="w-full lg:w-3/4">
                            {/* Sort options */}
                            <div className="flex justify-between items-center mb-6">
                                <p className="text-gray-700">
                                    <span className="font-medium">{filteredPackages.length}</span> packages found
                                </p>
                                
                                <div className="flex items-center">
                                    <label htmlFor="sort" className="text-sm text-gray-700 mr-2">Sort by:</label>
                                    <select
                                        id="sort"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="recommended">Recommended</option>
                                        <option value="price-low-high">Price: Low to High</option>
                                        <option value="price-high-low">Price: High to Low</option>
                                        <option value="duration-short-long">Duration: Short to Long</option>
                                        <option value="duration-long-short">Duration: Long to Short</option>
                                        <option value="rating">Rating</option>
                                    </select>
                                </div>
                            </div>
                            
                            {/* Packages grid */}
                            {filteredPackages.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredPackages.map((pkg) => (
                                        <Link
                                            key={pkg.id}
                                            href={`/packages/${pkg.id}`}
                                            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
                                        >
                                            <div className="relative h-48 overflow-hidden">
                                                <div 
                                                    className="absolute inset-0 bg-cover bg-center" 
                                                    style={{ backgroundImage: `url('${pkg.image}')` }}
                                                ></div>
                                                {pkg.featured && (
                                                    <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                                                        FEATURED
                                                    </div>
                                                )}
                                                <div className="absolute top-3 right-3 bg-white/80 text-gray-800 text-xs font-medium rounded py-0.5 px-2">
                                                ₹{pkg.price}
                                                </div>
                                            </div>
                                            
                                            <div className="p-5 flex-grow">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-lg font-medium text-gray-900">{pkg.title}</h3>
                                                    <div className="flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                        <span className="ml-1 text-gray-700 text-sm font-medium">{pkg.rating}</span>
                                                    </div>
                                                </div>
                                                
                                                <p className="text-gray-500 flex items-center text-sm mb-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    {pkg.location}
                                                </p>
                                                
                                                <p className="text-gray-600 text-sm mb-3">{pkg.description}</p>
                                                
                                                <div className="space-y-2">
                                                    <div className="flex items-center text-sm text-gray-700">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span>{pkg.duration} days / {pkg.duration - 1} nights</span>
                                                    </div>
                                                    
                                                    {pkg.activities && (
                                                        <div className="flex items-center text-sm text-gray-700">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <span>Includes: {pkg.activities.slice(0, 2).join(", ")}{pkg.activities.length > 2 ? "..." : ""}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="p-5 border-t border-gray-100 mt-auto">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        {pkg.originalPrice && <p className="text-gray-400 line-through text-xs">₹{pkg.originalPrice}</p>}
                                                        <p className="text-blue-600 font-bold">₹{pkg.price}</p>
                                                    </div>
                                                    <div className="bg-blue-600 text-white font-medium py-1.5 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                                                        View Details
                                                    </div>
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
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No packages found</h3>
                                    <p className="text-gray-600 mb-4">
                                        We couldn't find any packages matching your criteria. Try adjusting your filters or search terms.
                                    </p>
                                    <button 
                                        onClick={() => {
                                            setActiveFilter("all");
                                            setPriceRange([0, 5000]);
                                            setDuration([1, 14]);
                                            setSearchQuery("");
                                        }}
                                        className="text-blue-600 font-medium"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            )}
                            
       
                            {filteredPackages.length > 0 && (
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
                                        <div className="mx-2">
                                            <button className="h-10 w-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">3</button>
                                        </div>
                                        
                                        <button className="h-10 w-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Featured Banner */}
                    <div className="mt-16 bg-blue-600 rounded-2xl overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/2 p-8 md:p-12">
                                <div className="inline-block bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-6">
                                    BEST OFFER
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-4">Special Summer Deals</h2>
                                <p className="text-blue-100 mb-6">Book your summer vacation now and get up to 30% off on selected packages. Limited time offer!</p>
                                
                                <Link 
                                    href="/packages?filter=summer-deals"
                                    className="inline-block bg-white text-blue-600 font-medium px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
                                >
                                    View Deals
                                </Link>
                            </div>
                            
                            <div className="md:w-1/2 relative h-60 md:h-auto">
                                <div 
                                    className="absolute inset-0 bg-cover bg-center" 
                                    style={{ backgroundImage: "url('/images/packages/beach-chairs.jpg')" }}
                                ></div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Travel Tips */}
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Travel Tips</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="h-40 relative">
                                    <div 
                                        className="absolute inset-0 bg-cover bg-center" 
                                        style={{ backgroundImage: "url('/images/packages/mountain-view.jpg')" }}
                                    ></div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Packing Essentials</h3>
                                    <p className="text-gray-600 text-sm mb-4">Learn what to pack for different types of trips and destinations.</p>
                                    <a href="#" className="text-blue-600 font-medium text-sm flex items-center">
                                        Read more
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="h-40 relative">
                                    <div 
                                        className="absolute inset-0 bg-cover bg-center" 
                                        style={{ backgroundImage: "url('/images/packages/beach-palm.jpg')" }}
                                    ></div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Budget Travel</h3>
                                    <p className="text-gray-600 text-sm mb-4">Tips and tricks for traveling on a budget without compromising experiences.</p>
                                    <a href="#" className="text-blue-600 font-medium text-sm flex items-center">
                                        Read more
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="h-40 relative">
                                    <div 
                                        className="absolute inset-0 bg-cover bg-center" 
                                        style={{ backgroundImage: "url('/images/packages/mountain-cabin.jpg')" }}
                                    ></div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Travel Photography</h3>
                                    <p className="text-gray-600 text-sm mb-4">Capture amazing memories with these travel photography tips.</p>
                                    <a href="#" className="text-blue-600 font-medium text-sm flex items-center">
                                        Read more
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </a>
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