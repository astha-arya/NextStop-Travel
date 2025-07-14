"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import { api } from '@/utils/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <UserProfile />
    </ProtectedRoute>
  );
}

function UserProfile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    console.log("User object:", user);
  }, [user]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        if (activeTab === "bookings") {
          const bookingsData = await api.getUserBookings();
          console.log("Bookings data:", bookingsData);
          setBookings(bookingsData || []);
        } else if (activeTab === "wishlist") {
          const wishlistData = await api.getUserWishlist();
          console.log("Wishlist data:", wishlistData);
          setWishlist(wishlistData || []);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load user data");
        setLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [activeTab, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
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
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Unable to load user profile. Please try again later.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Reload
            </button>
          </div>
        </div>
      </div>
    );
  }


  const userName = user.Name || '';
  const userInitial = userName ? userName.charAt(0) : '?';

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-gray-100 text-gray-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };


  const mapBooking = (booking) => {
    return {
      id: booking.Booking_ID,
      packageId: booking.Package_ID,
      packageName: booking.Package_Name,
      destination: booking.Location,
      travelDate: booking.Travel_Date,
      totalPrice: booking.Total_Amount,
      status: booking.Payment_Status,
      image: booking.Image_URL || 'https://via.placeholder.com/300x200?text=No+Image'
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile header */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="bg-blue-600 h-32 md:h-48"></div>
            <div className="px-4 sm:px-6 lg:px-8 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end -mt-12">
                <div className="inline-block h-24 w-24 sm:h-32 sm:w-32 rounded-full ring-4 ring-white overflow-hidden bg-gray-200">
                  {user.profileImage ? (
                    <Image
                      src={user.profileImage}
                      alt={userName || 'User'}
                      width={128}
                      height={128}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-600 text-4xl font-bold">
                      {userInitial}
                    </div>
                  )}
                </div>
                <div className="mt-6 sm:mt-0 sm:ml-4 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{userName}</h1>
                      <p className="text-gray-600">Member since {formatDate(user.joinDate || user.Created_At)}</p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                      <button className="bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content tabs */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Tabs navigation */}
            <div className="border-b border-gray-200">
              <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex space-x-8">
                  {[
                    { id: "bookings", label: "My Bookings" },
                    { id: "wishlist", label: "Wishlist" },
                  ].map(tab => (
                    <button 
                      key={tab.id}
                      className={`py-4 font-medium transition-all relative ${
                        activeTab === tab.id 
                          ? "text-blue-600" 
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
            </div>
            
            {/* Tab content */}
            <div className="px-4 sm:px-6 lg:px-8 py-6">
              {/* My Bookings Tab */}
              {activeTab === "bookings" && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">My Bookings</h2>
                  
                  {bookings && bookings.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {bookings.map((booking) => {
                        const mappedBooking = mapBooking(booking);
                        return (
                          <div key={mappedBooking.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                            <div className="flex flex-col md:flex-row">
                              <div className="md:w-1/3 relative h-48 md:h-auto">
                                <div 
                                  className="absolute inset-0 bg-cover bg-center" 
                                  style={{ backgroundImage: `url('${mappedBooking.image}')` }}
                                ></div>
                                <div className={`absolute top-3 right-3 ${getStatusColor(mappedBooking.status)} text-xs font-semibold px-2.5 py-1 rounded-full`}>
                                  {mappedBooking.status}
                                </div>
                              </div>
                              <div className="p-5 md:w-2/3">
                                <h3 className="text-lg font-medium text-gray-900 mb-1">{mappedBooking.packageName}</h3>
                                <p className="text-gray-600 text-sm flex items-center mb-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  {mappedBooking.destination}
                                </p>
                                
                                <div className="space-y-1 mb-4">
                                  <div className="flex items-center text-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-gray-600">Travel Date: </span>
                                    <span className="ml-1 text-gray-900 font-medium">{formatDate(mappedBooking.travelDate)}</span>
                                  </div>
                                  <div className="flex items-center text-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span className="text-gray-600">Total Price: </span>
                                    <span className="ml-1 text-gray-900 font-medium">₹{mappedBooking.totalPrice}</span>
                                  </div>
                                  <div className="flex items-center text-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-gray-600">Booking ID: </span>
                                    <span className="ml-1 text-gray-900 font-medium">{mappedBooking.id}</span>
                                  </div>
                                </div>
                                
                                <div className="flex space-x-3">
                                  <Link 
                                    href={`/booking/details/${mappedBooking.id}`}
                                    className="text-blue-600 text-sm font-medium hover:text-blue-700"
                                  >
                                    View Details
                                  </Link>
                                  {mappedBooking.status === 'Confirmed' && (
                                    <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                                      Cancel Booking
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-8 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                      <p className="text-gray-600 mb-4">
                        You haven't made any bookings yet. Start planning your next adventure!
                      </p>
                      <Link 
                        href="/packages"
                        className="text-blue-600 font-medium hover:text-blue-700"
                      >
                        Explore Packages
                      </Link>
                    </div>
                  )}
                </div>
              )}
              
              {/* Wishlist Tab */}
              {activeTab === "wishlist" && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">My Wishlist</h2>
                  
                  {wishlist && wishlist.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlist.map((item) => (
                        <div key={item.Wishlist_ID} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                          <div className="relative h-48">
                            <div 
                              className="absolute inset-0 bg-cover bg-center" 
                              style={{ backgroundImage: `url('${item.Image_URL || 'https://via.placeholder.com/300x200?text=No+Image'}')` }}
                            ></div>
                          </div>
                          <div className="p-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-1">{item.Package_Name}</h3>
                            <p className="text-gray-600 text-sm flex items-center mb-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {item.Location}
                            </p>
                            <div className="space-y-1 mb-3">
                              <div className="flex items-center text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-gray-600">Duration: </span>
                                <span className="ml-1 text-gray-900 font-medium">{item.Duration} days</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span className="text-gray-600">Price: </span>
                                <span className="ml-1 text-gray-900 font-medium">₹{item.Price}</span>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Link 
                                href={`/packages/${item.Package_ID}`}
                                className="flex-1 bg-blue-600 text-white text-center text-sm font-medium py-2 rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                View Details
                              </Link>
                              <button
                                onClick={() => api.removeFromWishlist(item.Package_ID)}
                                className="flex-shrink-0 p-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition-colors"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-8 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                      <p className="text-gray-600 mb-4">
                        Save your favorite packages to plan your next adventure.
                      </p>
                      <Link 
                        href="/packages"
                        className="text-blue-600 font-medium hover:text-blue-700"
                      >
                        Explore Packages
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}