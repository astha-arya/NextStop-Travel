"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/utils/api';

export default function BookingConfirmation() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const bookingId = searchParams.get('bookingId');
  
  useEffect(() => {
    if (!bookingId) {
      setError("Booking ID not found");
      setLoading(false);
      return;
    }
    
    const fetchBookingDetails = async () => {
      try {
        const data = await api.getBooking(bookingId);
        setBookingData(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching booking details:", err);
        setError("Failed to load booking details");
        setLoading(false);
      }
    };
    
    fetchBookingDetails();
  }, [bookingId]);
  

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (e) {
      return dateString;
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-12 pb-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading booking details...</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (error || !bookingData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-12 pb-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Information Unavailable</h1>
                <p className="text-gray-600 mb-8">{error || "We couldn't find the booking details you're looking for."}</p>
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link 
                    href="/profile/bookings" 
                    className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    View My Bookings
                  </Link>
                  <Link 
                    href="/" 
                    className="inline-flex items-center justify-center px-5 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Return to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  

  const { booking, package: packageInfo, payment } = bookingData;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-12 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Success header */}
            <div className="bg-green-600 px-6 py-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-xl font-medium text-white">Booking Successful!</h3>
                  <p className="text-green-100 text-sm">Your booking has been confirmed and is ready for you.</p>
                </div>
              </div>
            </div>
            
            {/* Booking details */}
            <div className="px-6 py-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank You, {user?.name || user?.Name || 'Traveler'}!</h1>
                <p className="text-gray-600">
                  Your booking ({booking.Booking_ID}) was successful. You'll receive a confirmation email shortly.
                </p>
              </div>
              
              <div className="flex justify-center mb-8">
                <div className="h-0.5 w-24 bg-gray-200"></div>
              </div>
              
              {/* Package info section */}
              <div className="flex flex-col md:flex-row border border-gray-200 rounded-lg overflow-hidden mb-8">
                <div className="md:w-1/3 relative h-48 md:h-auto">
                  <div 
                    className="absolute inset-0 bg-cover bg-center" 
                    style={{ backgroundImage: `url('${packageInfo.Image_URL || '/images/packages/mountain-view.jpg'}')` }}
                  ></div>
                </div>
                <div className="p-6 md:w-2/3">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{packageInfo.Package_Name}</h2>
                  <p className="text-gray-600 flex items-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {packageInfo.Location}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Travel Date</p>
                      <p className="font-medium text-gray-900">{formatDate(booking.Travel_Date)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-medium text-gray-900">{packageInfo.Duration} days / {packageInfo.Duration - 1} nights</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Travelers</p>
                      <p className="font-medium text-gray-900">{booking.Number_Of_Travelers} {booking.Number_Of_Travelers === 1 ? 'person' : 'people'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Booking Date</p>
                      <p className="font-medium text-gray-900">{formatDate(booking.Booking_Date)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Payment info */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-medium text-gray-900">
                      {payment?.Payment_Method || 'Credit Card'}
                      {payment?.Card_Last_Four && ` ending in ${payment.Card_Last_Four}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Status</p>
                    <p className={`font-medium ${
                      (payment?.Payment_Status === 'Completed' || booking.Payment_Status === 'Completed') 
                        ? 'text-green-600' 
                        : 'text-yellow-600'
                    }`}>
                      {payment?.Payment_Status || booking.Payment_Status || 'Pending'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Transaction ID</p>
                    <p className="font-medium text-gray-900">{payment?.Transaction_ID || 'Pending'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Date</p>
                    <p className="font-medium text-gray-900">{formatDate(payment?.Payment_Date || booking.Booking_Date)}</p>
                  </div>
                </div>
              </div>
              
              {/* Price summary */}
              <div className="border-t border-gray-200 pt-6 mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Price Summary</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <p className="text-gray-600">Package Price ({booking.Number_Of_Travelers} × ₹{packageInfo.Price})</p>
                    <p className="text-gray-900">₹{packageInfo.Price * booking.Number_Of_Travelers}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600">Taxes & Fees</p>
                    <p className="text-gray-900">Included</p>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <p className="font-medium text-gray-900">Total</p>
                    <p className="font-bold text-blue-600">₹{booking.Total_Amount}</p>
                  </div>
                </div>
              </div>
              
              {/* What's next section */}
              <div className="bg-blue-50 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">What's Next?</h3>
                
                <div className="space-y-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 bg-blue-200 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">1</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">Check your email</p>
                      <p className="text-gray-600">A booking confirmation has been sent to your email address.</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 bg-blue-200 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">2</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">Review your booking details</p>
                      <p className="text-gray-600">You can view your booking details in your profile at any time.</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 bg-blue-200 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">3</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">Get ready for your trip!</p>
                      <p className="text-gray-600">Start packing and prepare for an amazing experience.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link 
                  href={`/profile/bookings`} 
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  View My Bookings
                </Link>
                <Link 
                  href="/" 
                  className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}