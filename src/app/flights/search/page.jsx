"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { api } from '@/utils/api';

export default function FlightSearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [searchCriteria, setSearchCriteria] = useState({
    departureAirport: searchParams.get('from') || '',
    arrivalAirport: searchParams.get('to') || '',
    departureDate: searchParams.get('departure') || '',
    returnDate: searchParams.get('return') || '',
    passengers: searchParams.get('passengers') || '1'
  });
  
  const [flights, setFlights] = useState({
    outbound: [],
    return: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedFlights, setSelectedFlights] = useState({
    outbound: null,
    return: null
  });
  
  
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  

  const formatTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
  };
  

  const calculateDuration = (departure, arrival) => {
    const departureTime = new Date(departure);
    const arrivalTime = new Date(arrival);
    
    const durationMs = arrivalTime - departureTime;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };
  

  useEffect(() => {
    const fetchFlights = async () => {
      if (!searchCriteria.departureAirport || !searchCriteria.arrivalAirport || !searchCriteria.departureDate) {
        setError('Missing search criteria');
        setLoading(false);
        return;
      }
      
      try {
        const data = await api.searchFlights({
          departureAirport: searchCriteria.departureAirport,
          arrivalAirport: searchCriteria.arrivalAirport,
          departureDate: searchCriteria.departureDate,
          returnDate: searchCriteria.returnDate,
          passengers: searchCriteria.passengers
        });
        
        setFlights({
          outbound: data.outboundFlights || [],
          return: data.returnFlights || []
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching flights:', err);
        setError('Failed to fetch flights. Please try again.');
        setLoading(false);
      }
    };
    
    fetchFlights();
  }, [searchCriteria]);
  
  const handleFlightSelection = (type, flight) => {
    setSelectedFlights({
      ...selectedFlights,
      [type]: flight
    });
    

    if (type === 'outbound' && searchCriteria.returnDate && !selectedFlights.return) {
      document.getElementById('return-flights')?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const handleBooking = () => {
    if (!selectedFlights.outbound) {
      alert('Please select an outbound flight');
      return;
    }
    
    if (searchCriteria.returnDate && !selectedFlights.return) {
      alert('Please select a return flight');
      return;
    }
    
    setShowBookingModal(true);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Searching for the best flights for you...</p>
              </div>
            </div>
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
        <div className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
              <p className="text-gray-700 mb-4">{error}</p>
              <button 
                onClick={() => router.back()} 
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search summary */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {searchCriteria.departureAirport} → {searchCriteria.arrivalAirport}
                  {searchCriteria.returnDate && ` → ${searchCriteria.departureAirport}`}
                </h1>
                <p className="text-gray-600">
                  {formatDate(searchCriteria.departureDate)}
                  {searchCriteria.returnDate && ` - ${formatDate(searchCriteria.returnDate)}`}
                  {' • '}{searchCriteria.passengers} {parseInt(searchCriteria.passengers) === 1 ? 'passenger' : 'passengers'}
                </p>
              </div>
              <button 
                onClick={() => router.back()}
                className="mt-4 sm:mt-0 text-blue-600 hover:text-blue-800 transition-colors"
              >
                Modify Search
              </button>
            </div>
          </div>

          {showBookingModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-8 max-w-md w-full">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Flight Booking Coming Soon</h3>
      <p className="text-gray-600 mb-6">
        Our flight booking system will be available soon! In the meantime, you can explore our destination or package booking options.
      </p>
      <div className="flex flex-col space-y-3">
        <button
          onClick={() => {
            setShowBookingModal(false);
            router.push(`/destinations?location=${searchCriteria.arrivalAirportCode}`);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
        >
          Continue with Destination Booking
        </button>
        <button
          onClick={() => {
            setShowBookingModal(false);
            router.push(`/packages?location=${searchCriteria.arrivalAirportCode}&checkin=${searchCriteria.departureDate}&checkout=${searchCriteria.returnDate || ''}&travelers=${searchCriteria.passengers}`);
          }}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors"
        >
          View Travel Packages
        </button>
        <button
          onClick={() => setShowBookingModal(false)}
          className="text-gray-600 hover:text-gray-800 py-2 px-4 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
          
          {/* Selected flights summary */}
          {(selectedFlights.outbound || selectedFlights.return) && (
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Selected Flights</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedFlights.outbound && (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500">Outbound Flight</p>
                        <p className="font-medium">{selectedFlights.outbound.Airline_Name}</p>
                        <p className="text-sm text-gray-700">{selectedFlights.outbound.Flight_Number}</p>
                      </div>
                      <p className="text-blue-600 font-bold">₹{selectedFlights.outbound.Base_Price}</p>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <div className="text-center">
                        <p className="font-bold">{formatTime(selectedFlights.outbound.Departure_Time)}</p>
                        <p className="text-sm text-gray-500">{selectedFlights.outbound.Departure_Code}</p>
                      </div>
                      <div className="flex-1 mx-4">
                        <div className="relative flex items-center">
                          <div className="h-0.5 bg-gray-300 w-full"></div>
                          <div className="absolute w-full text-center text-xs text-gray-500">
                            {calculateDuration(selectedFlights.outbound.Departure_Time, selectedFlights.outbound.Arrival_Time)}
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="font-bold">{formatTime(selectedFlights.outbound.Arrival_Time)}</p>
                        <p className="text-sm text-gray-500">{selectedFlights.outbound.Arrival_Code}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedFlights.return && (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500">Return Flight</p>
                        <p className="font-medium">{selectedFlights.return.Airline_Name}</p>
                        <p className="text-sm text-gray-700">{selectedFlights.return.Flight_Number}</p>
                      </div>
                      <p className="text-blue-600 font-bold">₹{selectedFlights.return.Base_Price}</p>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <div className="text-center">
                        <p className="font-bold">{formatTime(selectedFlights.return.Departure_Time)}</p>
                        <p className="text-sm text-gray-500">{selectedFlights.return.Departure_Code}</p>
                      </div>
                      <div className="flex-1 mx-4">
                        <div className="relative flex items-center">
                          <div className="h-0.5 bg-gray-300 w-full"></div>
                          <div className="absolute w-full text-center text-xs text-gray-500">
                            {calculateDuration(selectedFlights.return.Departure_Time, selectedFlights.return.Arrival_Time)}
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="font-bold">{formatTime(selectedFlights.return.Arrival_Time)}</p>
                        <p className="text-sm text-gray-500">{selectedFlights.return.Arrival_Code}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-between items-center">
                <div>
                  <p className="text-gray-700">Total:</p>
                  <p className="text-2xl font-bold text-blue-700">
                  ₹{(
                      (selectedFlights.outbound ? selectedFlights.outbound.Base_Price : 0) + 
                      (selectedFlights.return ? selectedFlights.return.Base_Price : 0)
                    ) * parseInt(searchCriteria.passengers)}
                  </p>
                </div>
                <button
                  onClick={handleBooking}
                  className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continue to Booking
                </button>
              </div>
            </div>
          )}
          
          {/* Outbound flights */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Outbound: {searchCriteria.departureAirport} to {searchCriteria.arrivalAirport}
              <span className="text-gray-500 font-normal ml-2">{formatDate(searchCriteria.departureDate)}</span>
            </h2>
            
            {flights.outbound.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {flights.outbound.map((flight) => (
                  <div 
                    key={flight.Flight_ID}
                    className={`bg-white rounded-lg shadow-md p-6 ${
                      selectedFlights.outbound?.Flight_ID === flight.Flight_ID 
                        ? 'border-2 border-blue-500' 
                        : ''
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex items-center mb-4 md:mb-0">
                        <div className="h-12 w-12 flex-shrink-0 mr-4">
                          {flight.Logo_URL ? (
                            <Image
                              src={flight.Logo_URL}
                              alt={flight.Airline_Name}
                              width={48}
                              height={48}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-gray-600 font-bold">{flight.Airline_Name.substring(0, 2)}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{flight.Airline_Name}</h3>
                          <p className="text-sm text-gray-500">Flight {flight.Flight_Number}</p>
                        </div>
                      </div>
                      
                      <div className="flex-1 mx-0 md:mx-6 my-4 md:my-0">
                        <div className="flex justify-between items-center">
                          <div className="text-center mr-4">
                            <p className="text-lg font-bold">{formatTime(flight.Departure_Time)}</p>
                            <p className="text-sm text-gray-500">{flight.Departure_Code}</p>
                          </div>
                          <div className="flex-1">
                            <div className="relative flex items-center">
                              <div className="h-0.5 bg-gray-300 w-full"></div>
                              <div className="absolute w-full text-center text-xs text-gray-500">
                                {calculateDuration(flight.Departure_Time, flight.Arrival_Time)}
                              </div>
                            </div>
                          </div>
                          <div className="text-center ml-4">
                            <p className="text-lg font-bold">{formatTime(flight.Arrival_Time)}</p>
                            <p className="text-sm text-gray-500">{flight.Arrival_Code}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:items-end">
                        <p className="text-lg font-bold text-blue-600">₹{flight.Base_Price}</p>
                        <p className="text-sm text-gray-500">per passenger</p>
                        <button
                          onClick={() => handleFlightSelection('outbound', flight)}
                          className={`mt-2 py-2 px-4 rounded-lg transition-colors ${
                            selectedFlights.outbound?.Flight_ID === flight.Flight_ID
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {selectedFlights.outbound?.Flight_ID === flight.Flight_ID
                            ? 'Selected'
                            : 'Select'
                          }
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <p className="text-gray-700">No flights available for this route and date. Please try different dates or destinations.</p>
              </div>
            )}
          </div>
          
          {/* Return flights */}
          {searchCriteria.returnDate && (
            <div id="return-flights">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Return: {searchCriteria.arrivalAirport} to {searchCriteria.departureAirport}
                <span className="text-gray-500 font-normal ml-2">{formatDate(searchCriteria.returnDate)}</span>
              </h2>
              
              {flights.return.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {flights.return.map((flight) => (
                    <div 
                      key={flight.Flight_ID}
                      className={`bg-white rounded-lg shadow-md p-6 ${
                        selectedFlights.return?.Flight_ID === flight.Flight_ID 
                          ? 'border-2 border-blue-500' 
                          : ''
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex items-center mb-4 md:mb-0">
                          <div className="h-12 w-12 flex-shrink-0 mr-4">
                            {flight.Logo_URL ? (
                              <Image
                                src={flight.Logo_URL}
                                alt={flight.Airline_Name}
                                width={48}
                                height={48}
                                className="rounded-full"
                              />
                            ) : (
                              <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-gray-600 font-bold">{flight.Airline_Name.substring(0, 2)}</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{flight.Airline_Name}</h3>
                            <p className="text-sm text-gray-500">Flight {flight.Flight_Number}</p>
                          </div>
                        </div>
                        
                        <div className="flex-1 mx-0 md:mx-6 my-4 md:my-0">
                          <div className="flex justify-between items-center">
                            <div className="text-center mr-4">
                              <p className="text-lg font-bold">{formatTime(flight.Departure_Time)}</p>
                              <p className="text-sm text-gray-500">{flight.Departure_Code}</p>
                            </div>
                            <div className="flex-1">
                              <div className="relative flex items-center">
                                <div className="h-0.5 bg-gray-300 w-full"></div>
                                <div className="absolute w-full text-center text-xs text-gray-500">
                                  {calculateDuration(flight.Departure_Time, flight.Arrival_Time)}
                                </div>
                              </div>
                            </div>
                            <div className="text-center ml-4">
                              <p className="text-lg font-bold">{formatTime(flight.Arrival_Time)}</p>
                              <p className="text-sm text-gray-500">{flight.Arrival_Code}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col md:items-end">
                          <p className="text-lg font-bold text-blue-600">₹{flight.Base_Price}</p>
                          <p className="text-sm text-gray-500">per passenger</p>
                          <button
                            onClick={() => handleFlightSelection('return', flight)}
                            className={`mt-2 py-2 px-4 rounded-lg transition-colors ${
                              selectedFlights.return?.Flight_ID === flight.Flight_ID
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            {selectedFlights.return?.Flight_ID === flight.Flight_ID
                              ? 'Selected'
                              : 'Select'
                            }
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <p className="text-gray-700">No return flights available for this route and date. Please try different dates.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}