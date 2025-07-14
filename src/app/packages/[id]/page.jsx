"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { api } from '@/utils/api';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function PackageDetail() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { user } = useAuth();

  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [travelers, setTravelers] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchPackageData = async () => {
      try {
        const data = await api.getPackage(id);
        
      
        const processedData = {
          ...data,
          id: data.Package_ID,
          title: data.Package_Name,
          location: data.Location,
          description: data.Description || 'Experience this amazing package.',
          price: data.Price,
          currentPrice: data.Price,
          originalPrice: data.Original_Price,
          duration: data.Duration || 7,
          category: data.Category || 'adventure',
          images: [data.Image_URL || '/images/packages/mountain-view.jpg'],
          rating: data.Rating || 4.5,
          reviewCount: data.Review_Count || 0,
          activities: ['Hiking', 'Sightseeing', 'Cultural Tours'],
          includedItems: ['Accommodation', 'Breakfast', 'Airport Transfers', 'Local Guide'],
          availableDates: [
            { date: '2025-06-15', price: data.Price },
            { date: '2025-07-01', price: data.Price },
            { date: '2025-07-15', price: data.Price },
            { date: '2025-08-01', price: data.Price }
          ],
          hotelDetails: {
            name: 'Luxury Resort & Spa',
            stars: 4,
            amenities: ['Swimming Pool', 'Free WiFi', 'Spa', 'Restaurant']
          },
          flightDetails: {
            airline: 'Global Airways',
            departureAirport: 'JFK',
            arrivalAirport: data.Location + ' International Airport',
            duration: '3h 15m'
          },
          reviews: [
            {
              id: 'rev1',
              userName: 'John Doe',
              rating: 4.5,
              date: '2024-12-15',
              comment: 'Amazing experience! The accommodations were fantastic and the activities were well-organized.'
            },
            {
              id: 'rev2',
              userName: 'Jane Smith',
              rating: 5,
              date: '2024-11-20',
              comment: 'One of the best vacations I\'ve ever had. The views were breathtaking and the guides were very knowledgeable.'
            }
          ]
        };
        

        if (processedData.images.length < 4) {
          const defaultImages = [
            '/images/packages/mountain-view.jpg',
            '/images/packages/beach-aerial.jpg',
            '/images/packages/mountain-cabin.jpg',
            '/images/packages/beach-palm.jpg'
          ];
          
          processedData.images = [
            ...processedData.images,
            ...defaultImages.filter(img => !processedData.images.includes(img))
          ].slice(0, 4);
        }
        
        setPackageData(processedData);
        
   
        try {
          const reviewsData = await api.getPackageReviews(id);
          if (reviewsData && reviewsData.length > 0) {
            setReviews(reviewsData);
          } else {
            setReviews(processedData.reviews); 
          }
        } catch (err) {
          console.error("Error fetching reviews:", err);
          setReviews(processedData.reviews); 
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching package:", err);
        setError("Failed to load package details");
        setLoading(false);
      }
    };

    fetchPackageData();
  }, [id]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleBookNow = async () => {
    if (!user) {
    
      router.push(`/login?redirect=/packages/${id}`);
      return;
    }
    
    if (!selectedDate) {
      alert("Please select a travel date");
      return;
    }
    
    try {
      const bookingData = {
        packageId: id,
        travelDate: selectedDate,
        travelers: travelers
      };
      
      const response = await api.createBooking(bookingData);
      router.push(`/booking/confirmation?bookingId=${response.bookingId}`);
    } catch (error) {
      alert(`Booking failed: ${error.message || 'Please try again later'}`);
      console.error('Booking error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading package details...</p>
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

  if (!packageData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-6 pb-16">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Main image and gallery */}
            <div className="w-full md:w-2/3">
              <div className="relative h-96 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gray-200"></div>
                <div 
                  className="absolute inset-0 bg-cover bg-center" 
                  style={{ backgroundImage: `url('${packageData.images[0]}')` }}
                ></div>
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <button className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-gray-800 hover:bg-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-gray-800 hover:bg-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Image gallery */}
              <div className="grid grid-cols-3 gap-3 mt-3">
                {packageData.images.slice(1, 4).map((image, index) => (
                  <div key={index} className="relative h-28 rounded-xl overflow-hidden">
                    <div className="absolute inset-0 bg-gray-200"></div>
                    <div 
                      className="absolute inset-0 bg-cover bg-center" 
                      style={{ backgroundImage: `url('${image}')` }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Package info card */}
            <div className="w-full md:w-1/3">
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{packageData.title}</h1>
                    <p className="text-gray-600 flex items-center mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {packageData.location}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-gray-700 font-medium ml-1">{packageData.rating}</span>
                    <span className="text-gray-500 ml-1">({packageData.reviewCount} reviews)</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="flex items-baseline">
                    {packageData.originalPrice && (
                      <p className="text-gray-400 line-through text-sm mr-2">₹{packageData.originalPrice}</p>
                    )}
                    <p className="text-blue-600 font-bold text-2xl">₹{packageData.currentPrice}</p>
                    <span className="text-gray-500 ml-1">/ person</span>
                  </div>
                  
                  <div className="mt-4">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                      Select date
                    </label>
                    <select 
                      id="date" 
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
                      value={selectedDate || ""}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    >
                      <option value="" disabled>Choose a date</option>
                      {packageData.availableDates.map((dateOption) => (
                        <option key={dateOption.date} value={dateOption.date}>
                          {new Date(dateOption.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })} - ₹{dateOption.price}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mt-4">
                    <label htmlFor="travelers" className="block text-sm font-medium text-gray-700 mb-1">
                      Travelers
                    </label>
                    <div className="flex items-center">
                      <button 
                        className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center"
                        onClick={() => setTravelers(Math.max(1, travelers - 1))}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="w-16 text-center font-medium text-gray-700">{travelers}</span>
                      <button 
                        className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center"
                        onClick={() => setTravelers(travelers + 1)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-1">
                      Total price: <span className="font-medium text-gray-900">₹{selectedDate ? 
                        (packageData.availableDates.find(d => d.date === selectedDate)?.price || packageData.currentPrice) * travelers : 
                        packageData.currentPrice * travelers}</span>
                    </p>
                    <button 
                      className="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                      onClick={handleBookNow}
                    >
                      Book Now
                    </button>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500">You won't be charged yet</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Package details tabs */}
          <div className="mt-12">
            <div className="border-b border-gray-200">
              <div className="flex space-x-8">
                {[
                  { id: "overview", label: "Overview" },
                  { id: "itinerary", label: "Itinerary" },
                  { id: "includes", label: "What's Included" },
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
            
            <div className="py-8">
              {activeTab === "overview" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About this package</h2>
                  <p className="text-gray-600 mb-6">{packageData.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Duration</h3>
                      <p className="text-gray-600 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {packageData.duration} days / {packageData.duration - 1} nights
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Hotel Details</h3>
                      <div className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <div>
                          <p className="text-gray-600">{packageData.hotelDetails.name}</p>
                          <div className="flex items-center mt-1">
                            {[...Array(packageData.hotelDetails.stars)].map((_, i) => (
                              <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Flight Details</h3>
                      <div className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        <div>
                          <p className="text-gray-600">{packageData.flightDetails.airline}</p>
                          <p className="text-gray-600">
                            {packageData.flightDetails.departureAirport} to {packageData.flightDetails.arrivalAirport}
                          </p>
                          <p className="text-gray-600">Flight duration: {packageData.flightDetails.duration}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Cancellation Policy</h3>
                      <p className="text-gray-600 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Free cancellation up to 7 days before the trip
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === "itinerary" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Package Itinerary</h2>
                  
                  {[...Array(packageData.duration)].map((_, i) => (
                    <div key={i} className="mb-8 relative">
                      {i < packageData.duration - 1 && (
                        <div className="absolute left-4 top-12 bottom-0 w-0.5 bg-gray-200"></div>
                      )}
                      <div className="flex">
                        <div className="bg-blue-100 text-blue-600 font-bold rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 z-10">
                          {i + 1}
                        </div>
                        <div className="ml-6">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Day {i + 1}</h3>
                          <p className="text-gray-600 mb-4">
                            {i === 0 
                              ? "Arrival and welcome dinner" 
                              : i === packageData.duration - 1 
                                ? "Departure day with breakfast included" 
                                : `Exploring the mountains and local attractions - Day ${i + 1}`}
                          </p>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <ul className="space-y-2">
                              <li className="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-700">
                                  {i === 0 
                                    ? "Arrival at the airport and transfer to the hotel" 
                                    : i === packageData.duration - 1 
                                      ? "Breakfast at the hotel" 
                                      : "Breakfast at the hotel"}
                                </span>
                              </li>
                              <li className="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-700">
                                  {i === 0 
                                    ? "Check-in and time to rest" 
                                    : i === packageData.duration - 1 
                                      ? "Check-out and transfer to the airport" 
                                      : "Guided tour of the local attractions"}
                                </span>
                              </li>
                              <li className="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-700">
                                  {i === 0 
                                    ? "Welcome dinner at the hotel restaurant" 
                                    : i === packageData.duration - 1 
                                      ? "Departure flight back home" 
                                      : "Lunch at a local restaurant"}
                                </span>
                              </li>
                              {i !== packageData.duration - 1 && (
                                <li className="flex items-start">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span className="text-gray-700">
                                    {i === 0 
                                      ? "Introduction to the week's activities" 
                                      : "Dinner at the hotel restaurant"}
                                  </span>
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {activeTab === "includes" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        What's Included
                      </h3>
                      <ul className="space-y-3">
                        {packageData.includedItems.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Available Activities
                      </h3>
                      <ul className="space-y-3">
                        {packageData.activities.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Hotel Amenities
                      </h3>
                      <ul className="space-y-3">
                        {packageData.hotelDetails.amenities.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Not Included
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">Travel insurance</span>
                        </li>
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">Personal expenses</span>
                        </li>
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">Optional activities not mentioned in the itinerary</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === "reviews" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Guest Reviews</h2>
                    <button className="bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Write a Review
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border border-gray-200 rounded-xl p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start">
                            <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden mr-4"></div>
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">{review.userName}</h3>
                              <div className="flex items-center mt-1">
                              {Array.from({ length: 5 - Math.floor(review.rating) }).map((_, i) => (
  <svg key={i + Math.floor(review.rating)} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
))}

                                {review.rating % 1 !== 0 && (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                )}
                                <span className="text-gray-500 ml-1">{review.rating}</span>
                              </div>
                            </div>
                          </div>
                          <span className="text-gray-500 text-sm">{review.date}</span>
                        </div>
                        <p className="mt-4 text-gray-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-center mt-8">
                    <button className="flex items-center text-blue-600 font-medium">
                      See all reviews
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          

        </div>
      </main>
      <Footer />
    </div>
  );
}