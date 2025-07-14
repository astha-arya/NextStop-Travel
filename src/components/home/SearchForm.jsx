"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/utils/api';

export default function SearchForm() {
  const [activeTab, setActiveTab] = useState("stays");
  const [focusedField, setFocusedField] = useState(null);
  const [searchParams, setSearchParams] = useState({

    stayLocation: "",
    checkin: "",
    checkout: "",
    travelers: "1",
    
  
    departureAirport: "",
    departureAirportCode: "",
    arrivalAirport: "",
    arrivalAirportCode: "",
    departureDate: "",
    returnDate: "",
    flightTravelers: "1",
    tripType: "roundtrip"
  });
  
  const [airportSuggestions, setAirportSuggestions] = useState({
    departure: [],
    arrival: []
  });
  
  const [showSuggestions, setShowSuggestions] = useState({
    departure: false,
    arrival: false
  });
  
  const router = useRouter();
  const searchFormRef = useRef(null);


  useEffect(() => {
    function handleClickOutside(event) {
      if (searchFormRef.current && !searchFormRef.current.contains(event.target)) {
        setShowSuggestions({
          departure: false,
          arrival: false
        });
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (field, value) => {
    setSearchParams({
      ...searchParams,
      [field]: value
    });
    

    if (field === 'departureAirport' && value.length >= 2) {
      fetchAirportSuggestions('departure', value);
    } else if (field === 'arrivalAirport' && value.length >= 2) {
      fetchAirportSuggestions('arrival', value);
    }
  };
  
  const fetchAirportSuggestions = async (type, query) => {
    try {
      const results = await api.searchAirports(query);
      setAirportSuggestions({
        ...airportSuggestions,
        [type]: results
      });
      setShowSuggestions({
        ...showSuggestions,
        [type]: true
      });
    } catch (error) {
      console.error(`Error fetching ${type} airport suggestions:`, error);
    }
  };
  
  const selectAirport = (type, airport) => {
    if (type === 'departure') {
      setSearchParams({
        ...searchParams,
        departureAirport: `${airport.City} (${airport.Airport_Code})`,
        departureAirportCode: airport.Airport_Code
      });
    } else {
      setSearchParams({
        ...searchParams,
        arrivalAirport: `${airport.City} (${airport.Airport_Code})`,
        arrivalAirportCode: airport.Airport_Code
      });
    }
    
    setShowSuggestions({
      ...showSuggestions,
      [type]: false
    });
  };
  
  const handleSearch = () => {
    if (activeTab === "stays") {
 
      if (!searchParams.stayLocation) {
        alert("Please enter a destination");
        return;
      }
      
      router.push(
        `/packages?location=${encodeURIComponent(searchParams.stayLocation)}&checkin=${searchParams.checkin}&checkout=${searchParams.checkout}&travelers=${searchParams.travelers}`
      );
    } else if (activeTab === "flights") {
 
      if (!searchParams.departureAirportCode || !searchParams.arrivalAirportCode || !searchParams.departureDate) {
        alert("Please fill in all required flight details");
        return;
      }
      
      router.push(
        `/flights/search?from=${searchParams.departureAirportCode}&to=${searchParams.arrivalAirportCode}&departure=${searchParams.departureDate}${searchParams.tripType === 'roundtrip' && searchParams.returnDate ? `&return=${searchParams.returnDate}` : ''}&passengers=${searchParams.flightTravelers}`
      );
    }
  };

  return (
    <div ref={searchFormRef} className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-[85%] max-w-6xl bg-white rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl z-10">
      {/* Tabs */}
      <div className="px-10 pt-7">
        <div className="flex space-x-10 border-b border-gray-200">
          {[
            { id: "stays", label: "Stays" },
            { id: "flights", label: "Flights" },
            { id: "cars", label: "Cars" },
            { id: "things", label: "Things to do" }
          ].map(tab => (
            <button 
              key={tab.id}
              className={`pb-5 font-medium transition-all relative ${
                activeTab === tab.id 
                  ? "text-gray-900" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={(e) => {
                e.stopPropagation(); 
                setActiveTab(tab.id);
              }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 rounded-full transform scale-x-100 transition-transform"></span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Search Inputs */}
      {activeTab === "stays" ? (
        <div className="px-10 py-10 flex items-stretch gap-7">
          {/* Location */}
          <div 
            className={`flex items-center flex-1 rounded-xl p-3 transition-all duration-200 ${
              focusedField === 'stayLocation' 
                ? 'bg-blue-50 ring-1 ring-blue-200' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => setFocusedField('stayLocation')}
          >
            <div className={`transition-colors duration-200 mr-4 ${
              focusedField === 'stayLocation' ? 'text-blue-500' : 'text-gray-400'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="w-full">
              <p className="text-base font-medium text-gray-900 mb-1">Location</p>
              <input 
                type="text" 
                placeholder="Where are you going?" 
                className="text-sm w-full focus:outline-none bg-transparent" 
                value={searchParams.stayLocation}
                onChange={(e) => handleInputChange('stayLocation', e.target.value)}
                onFocus={() => setFocusedField('stayLocation')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
          </div>

          {/* Check in */}
          <div 
            className={`flex items-center flex-1 rounded-xl p-3 transition-all duration-200 ${
              focusedField === 'checkin' 
                ? 'bg-blue-50 ring-1 ring-blue-200' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => setFocusedField('checkin')}
          >
            <div className={`transition-colors duration-200 mr-4 ${
              focusedField === 'checkin' ? 'text-blue-500' : 'text-gray-400'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="w-full">
              <p className="text-base font-medium text-gray-900 mb-1">Check in</p>
              <input 
                type="date" 
                className="text-sm w-full focus:outline-none bg-transparent text-gray-600" 
                value={searchParams.checkin}
                onChange={(e) => handleInputChange('checkin', e.target.value)}
                onFocus={() => setFocusedField('checkin')}
                onBlur={() => setFocusedField(null)}
                placeholder="Add date"
              />
            </div>
          </div>

          {/* Check out */}
          <div 
            className={`flex items-center flex-1 rounded-xl p-3 transition-all duration-200 ${
              focusedField === 'checkout' 
                ? 'bg-blue-50 ring-1 ring-blue-200' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => setFocusedField('checkout')}
          >
            <div className={`transition-colors duration-200 mr-4 ${
              focusedField === 'checkout' ? 'text-blue-500' : 'text-gray-400'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="w-full">
              <p className="text-base font-medium text-gray-900 mb-1">Check out</p>
              <input 
                type="date" 
                className="text-sm w-full focus:outline-none bg-transparent text-gray-600" 
                value={searchParams.checkout}
                onChange={(e) => handleInputChange('checkout', e.target.value)}
                onFocus={() => setFocusedField('checkout')}
                onBlur={() => setFocusedField(null)}
                placeholder="Add date"
              />
            </div>
          </div>

          {/* Travelers */}
          <div className="flex items-center justify-between flex-1">
            <div 
              className={`flex items-center flex-grow rounded-xl p-3 transition-all duration-200 ${
                focusedField === 'travelers' 
                  ? 'bg-blue-50 ring-1 ring-blue-200' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => setFocusedField('travelers')}
            >
              <div className={`transition-colors duration-200 mr-4 ${
                focusedField === 'travelers' ? 'text-blue-500' : 'text-gray-400'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="w-full">
                <p className="text-base font-medium text-gray-900 mb-1">Travelers</p>
                <select
                  className="text-sm w-full focus:outline-none bg-transparent" 
                  value={searchParams.travelers}
                  onChange={(e) => handleInputChange('travelers', e.target.value)}
                  onFocus={() => setFocusedField('travelers')}
                  onBlur={() => setFocusedField(null)}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Traveler' : 'Travelers'}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Button */}
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white p-5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 ml-4 focus:outline-none"
              onClick={handleSearch}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      ) : activeTab === "flights" ? (
        <div className="px-10 py-10">
          {/* Flight Type */}
          <div className="flex space-x-4 mb-6">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio h-4 w-4 text-blue-600"
                name="tripType"
                value="roundtrip"
                checked={searchParams.tripType === 'roundtrip'}
                onChange={() => handleInputChange('tripType', 'roundtrip')}
              />
              <span className="ml-2 text-gray-700">Round Trip</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio h-4 w-4 text-blue-600"
                name="tripType"
                value="oneway"
                checked={searchParams.tripType === 'oneway'}
                onChange={() => handleInputChange('tripType', 'oneway')}
              />
              <span className="ml-2 text-gray-700">One Way</span>
            </label>
          </div>
        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Departure Airport */}
            <div className="relative">
              <div
                className={`flex items-center rounded-xl p-3 transition-all duration-200 ${
                  focusedField === 'departureAirport'
                    ? 'bg-blue-50 ring-1 ring-blue-200'
                    : 'hover:bg-gray-50 border border-gray-200'
                }`}
                onClick={() => setFocusedField('departureAirport')}
              >
                <div className={`transition-colors duration-200 mr-4 ${
                  focusedField === 'departureAirport' ? 'text-blue-500' : 'text-gray-400'
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <div className="w-full">
                  <p className="text-base font-medium text-gray-900 mb-1">From</p>
                  <input
                    type="text"
                    placeholder="City or Airport"
                    className="text-sm w-full focus:outline-none bg-transparent"
                    value={searchParams.departureAirport}
                    onChange={(e) => handleInputChange('departureAirport', e.target.value)}
                    onFocus={() => {
                      setFocusedField('departureAirport');
                      if (searchParams.departureAirport.length >= 2) {
                        setShowSuggestions({...showSuggestions, departure: true});
                      }
                    }}
                  />
                </div>
              </div>
              
              {/* Airport suggestions */}
              {showSuggestions.departure && airportSuggestions.departure.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto">
                  {airportSuggestions.departure.map((airport) => (
                    <div
                      key={airport.Airport_Code}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => selectAirport('departure', airport)}
                    >
                      <div className="font-medium">{airport.City} ({airport.Airport_Code})</div>
                      <div className="text-sm text-gray-500">{airport.Name}, {airport.Country}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Arrival Airport */}
            <div className="relative">
              <div
                className={`flex items-center rounded-xl p-3 transition-all duration-200 ${
                  focusedField === 'arrivalAirport'
                    ? 'bg-blue-50 ring-1 ring-blue-200'
                    : 'hover:bg-gray-50 border border-gray-200'
                }`}
                onClick={() => setFocusedField('arrivalAirport')}
              >
                <div className={`transition-colors duration-200 mr-4 ${
                  focusedField === 'arrivalAirport' ? 'text-blue-500' : 'text-gray-400'
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" transform="rotate(180 12 12)" />
                  </svg>
                </div>
                <div className="w-full">
                  <p className="text-base font-medium text-gray-900 mb-1">To</p>
                  <input
                    type="text"
                    placeholder="City or Airport"
                    className="text-sm w-full focus:outline-none bg-transparent"
                    value={searchParams.arrivalAirport}
                    onChange={(e) => handleInputChange('arrivalAirport', e.target.value)}
                    onFocus={() => {
                      setFocusedField('arrivalAirport');
                      if (searchParams.arrivalAirport.length >= 2) {
                        setShowSuggestions({...showSuggestions, arrival: true});
                      }
                    }}
                  />
                </div>
              </div>
              
              {/* Airport suggestions */}
              {showSuggestions.arrival && airportSuggestions.arrival.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto">
                  {airportSuggestions.arrival.map((airport) => (
                    <div
                      key={airport.Airport_Code}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => selectAirport('arrival', airport)}
                    >
                      <div className="font-medium">{airport.City} ({airport.Airport_Code})</div>
                      <div className="text-sm text-gray-500">{airport.Name}, {airport.Country}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Departure Date */}
            <div
              className={`flex items-center rounded-xl p-3 transition-all duration-200 ${
                focusedField === 'departureDate'
                  ? 'bg-blue-50 ring-1 ring-blue-200'
                  : 'hover:bg-gray-50 border border-gray-200'
              }`}
              onClick={() => setFocusedField('departureDate')}
            >
              <div className={`transition-colors duration-200 mr-4 ${
                focusedField === 'departureDate' ? 'text-blue-500' : 'text-gray-400'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="w-full">
                <p className="text-base font-medium text-gray-900 mb-1">Departure</p>
                <input
                  type="date"
                  className="text-sm w-full focus:outline-none bg-transparent text-gray-600"
                  value={searchParams.departureDate}
                  onChange={(e) => handleInputChange('departureDate', e.target.value)}
                  onFocus={() => setFocusedField('departureDate')}
                  onBlur={() => setFocusedField(null)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            
            {/* Return Date */}
            {searchParams.tripType === 'roundtrip' && (
              <div
                className={`flex items-center rounded-xl p-3 transition-all duration-200 ${
                  focusedField === 'returnDate'
                    ? 'bg-blue-50 ring-1 ring-blue-200'
                    : 'hover:bg-gray-50 border border-gray-200'
                }`}
                onClick={() => setFocusedField('returnDate')}
              >
                <div className={`transition-colors duration-200 mr-4 ${
                  focusedField === 'returnDate' ? 'text-blue-500' : 'text-gray-400'
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="w-full">
                  <p className="text-base font-medium text-gray-900 mb-1">Return</p>
                  <input
                    type="date"
                    className="text-sm w-full focus:outline-none bg-transparent text-gray-600"
                    value={searchParams.returnDate}
                    onChange={(e) => handleInputChange('returnDate', e.target.value)}
                    onFocus={() => setFocusedField('returnDate')}
                    onBlur={() => setFocusedField(null)}
                    min={searchParams.departureDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            )}
            
            {/* Travelers */}
            <div
              className={`flex items-center rounded-xl p-3 transition-all duration-200 ${
                focusedField === 'flightTravelers'
                  ? 'bg-blue-50 ring-1 ring-blue-200'
                  : 'hover:bg-gray-50 border border-gray-200'
              }`}
              onClick={() => setFocusedField('flightTravelers')}
            >
              <div className={`transition-colors duration-200 mr-4 ${
                focusedField === 'flightTravelers' ? 'text-blue-500' : 'text-gray-400'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="w-full">
                <p className="text-base font-medium text-gray-900 mb-1">Passengers</p>
                <select
                  className="text-sm w-full focus:outline-none bg-transparent"
                  value={searchParams.flightTravelers}
                  onChange={(e) => handleInputChange('flightTravelers', e.target.value)}
                  onFocus={() => setFocusedField('flightTravelers')}
                  onBlur={() => setFocusedField(null)}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Search Button */}
          <div className="flex justify-end">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-8 rounded-full transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none"
              onClick={handleSearch}
            >
              Search Flights
            </button>
          </div>
        </div>
      ) : (
        <div className="px-10 py-10 text-center">
          <p className="text-gray-500">Coming soon! This feature is under development.</p>
        </div>
      )}
    </div>
  );
}