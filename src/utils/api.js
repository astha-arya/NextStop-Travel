"use client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Helper function to get the auth token
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

// Generic fetch function with authentication
async function fetchWithAuth(endpoint, options = {}) {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle 401 Unauthorized
    if (response.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
      return null;
    }

    // Parse JSON response
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

// Export API functions
export const api = {
  // Auth
  login: async (email, password) => {
    const response = await fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return response;
  },
  
  register: async (userData) => {
    const response = await fetchWithAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response;
  },
  
  getCurrentUser: async () => {
    return fetchWithAuth('/auth/me');
  },
  
  // Destinations
  getDestinations: () => fetchWithAuth('/destinations'),
  getDestination: (id) => fetchWithAuth(`/destinations/${id}`),
  
  // Packages
  getPackages: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchWithAuth(`/packages${queryString ? `?${queryString}` : ''}`);
  },
  getPackage: (id) => fetchWithAuth(`/packages/${id}`),
  
  // Bookings
  createBooking: (bookingData) => fetchWithAuth('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  }),
  getBooking: (id) => fetchWithAuth(`/bookings/${id}`),
  cancelBooking: (id) => fetchWithAuth(`/bookings/${id}/cancel`, {
    method: 'PUT'
  }),
  getUserBookings: () => fetchWithAuth('/users/bookings'),
  
  // Reviews
  getPackageReviews: (packageId) => fetchWithAuth(`/reviews?packageId=${packageId}`),
  createReview: (reviewData) => fetchWithAuth('/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData),
  }),

  
  
  // Wishlist
  getUserWishlist: () => fetchWithAuth('/users/wishlist'),
  addToWishlist: (packageId) => fetchWithAuth('/users/wishlist', {
    method: 'POST',
    body: JSON.stringify({ packageId }),
  }),
  removeFromWishlist: (packageId) => fetchWithAuth('/users/wishlist', {
    method: 'DELETE',
    body: JSON.stringify({ packageId }),
  }),
  
  // Search
  search: (query) => fetchWithAuth(`/search?q=${encodeURIComponent(query)}`),


  searchAirports: async (query) => {
    try {
      return await fetchWithAuth(`/airports/search?query=${encodeURIComponent(query)}`);
    } catch (error) {
      console.error('Search airports error:', error);
      return [];
    }
  },
  
  searchFlights: async (params) => {
    try {
      const queryString = new URLSearchParams({
        departureAirport: params.departureAirport,
        arrivalAirport: params.arrivalAirport,
        departureDate: params.departureDate,
        returnDate: params.returnDate || '',
        passengers: params.passengers || 1
      }).toString();
      
      return await fetchWithAuth(`/flights/search?${queryString}`);
    } catch (error) {
      console.error('Search flights error:', error);
      throw error;
  
    }
  }
};