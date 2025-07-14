"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/utils/api';

export default function BookingsPage() {
  return (
    <ProtectedRoute>
      <UserBookings />
    </ProtectedRoute>
  );
}

function UserBookings() {
  const { user } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await api.getUserBookings();
        setBookings(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load your bookings");
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);


  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (e) {
      return dateString;
    }
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


  const filteredAndSortedBookings = () => {
    let result = [...bookings];
    
    
    if (filter !== 'all') {
      result = result.filter(booking => booking.Payment_Status?.toLowerCase() === filter);
    }
    
  
    result.sort((a, b) => {
      const dateA = new Date(a.Booking_Date || a.Created_At || 0);
      const dateB = new Date(b.Booking_Date || b.Created_At || 0);
      
      if (sortOrder === 'newest') {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });
    
    return result;
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    
    try {
      await api.cancelBooking(bookingId);

      setBookings(bookings.map(booking => {
        if (booking.Booking_ID === bookingId) {
          return { ...booking, Payment_Status: 'Cancelled' };
        }
        return booking;
      }));
    } catch (err) {
      console.error("Error cancelling booking:", err);
      alert("Failed to cancel booking. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your bookings...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
              <p className="text-gray-600">View and manage all your travel bookings</p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <Link
                href="/packages"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                Book New Trip
              </Link>
            </div>
          </div>
          
          {/* Filters */}
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      filter === 'all'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    All Bookings
                  </button>
                  <button
                    onClick={() => setFilter('pending')}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      filter === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setFilter('confirmed')}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      filter === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    Confirmed
                  </button>
                  <button
                    onClick={() => setFilter('cancelled')}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      filter === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    Cancelled
                  </button>
                  <button
                    onClick={() => setFilter('completed')}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      filter === 'completed'
                        ? 'bg-gray-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    Completed
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <label htmlFor="sort" className="text-sm text-gray-700">Sort by:</label>
                  <select
                    id="sort"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bookings list */}
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-red-800 mb-2">{error}</h3>
              <p className="text-red-700 mb-4">We encountered an error while trying to load your bookings.</p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          ) : filteredAndSortedBookings().length === 0 ? (
            <div className="bg-white shadow rounded-lg p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Bookings Found</h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all'
                  ? "You haven't made any bookings yet."
                  : `You don't have any ${filter} bookings.`}
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                {filter !== 'all' ? (
                  <button
                    onClick={() => setFilter('all')}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    View All Bookings
                  </button>
                ) : (
                  <Link
                    href="/packages"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Browse Packages
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredAndSortedBookings().map((booking) => (
                <div
                  key={booking.Booking_ID}
                  className="bg-white shadow rounded-lg overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 relative h-48 md:h-auto">
                      <div 
                        className="absolute inset-0 bg-cover bg-center" 
                        style={{ backgroundImage: `url('${booking.Image_URL || '/images/packages/mountain-view.jpg'}')` }}
                      ></div>
                      <div className={`absolute top-3 right-3 ${getStatusColor(booking.Payment_Status)} text-xs font-semibold px-2.5 py-1 rounded-full`}>
                        {booking.Payment_Status}
                      </div>
                    </div>
                    
                    <div className="p-6 md:w-2/3">
                      <div className="flex flex-col sm:flex-row justify-between mb-4">
                        <div>
                          <h2 className="text-xl font-bold text-gray-900 mb-1">{booking.Package_Name}</h2>
                          <p className="text-gray-600 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {booking.Location}
                          </p>
                        </div>
                        <div className="mt-3 sm:mt-0">
                          <p className="text-sm text-gray-500">Booking ID</p>
                          <p className="font-medium text-gray-900">{booking.Booking_ID}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <div>
                          <p className="text-sm text-gray-500">Travel Date</p>
                          <p className="font-medium text-gray-900">{formatDate(booking.Travel_Date)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Travelers</p>
                          <p className="font-medium text-gray-900">{booking.Number_Of_Travelers} {booking.Number_Of_Travelers === 1 ? 'person' : 'people'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total Amount</p>
                          <p className="font-medium text-blue-600">₹{booking.Total_Amount}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                        <div className="text-sm text-gray-500">
                          Booked on {formatDate(booking.Booking_Date)}
                        </div>
                        <div className="flex space-x-3">
                          <Link
                            href={`/booking/details/${booking.Booking_ID}`}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            View Details
                          </Link>
                          
                          {booking.Payment_Status === 'Pending' || booking.Payment_Status === 'Confirmed' ? (
                            <button
                              onClick={() => handleCancelBooking(booking.Booking_ID)}
                              className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                            >
                              Cancel
                            </button>
                          ) : booking.Payment_Status === 'Completed' ? (
                            <Link
                              href={`/reviews/create?packageId=${booking.Package_ID}`}
                              className="inline-flex items-center px-3 py-1.5 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50"
                            >
                              Write Review
                            </Link>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}