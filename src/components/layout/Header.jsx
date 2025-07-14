"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname === path;
  };


  const getUserInitial = () => {
    if (user) {
    
      const name = user.name || user.Name;
      const email = user.email || user.Email;
      
      if (name && typeof name === 'string') {
        return name.charAt(0);
      } else if (email && typeof email === 'string') {
        return email.charAt(0);
      }
      return 'U'; 
    }
    return 'U';
  };

  return (
    <header className="flex items-center justify-between px-8 py-4">
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <div className="bg-blue-600 h-8 w-8 rounded flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <span className="text-gray-900 font-bold text-xl ml-2">NextStop</span>
        </Link>
      </div>
      
      {/* Navigation Links - Desktop */}
      <div className="hidden md:flex items-center space-x-6">
        <Link 
          href="/" 
          className={`${isActive('/') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'} transition-colors`}
        >
          Home
        </Link>
        <Link 
          href="/destinations" 
          className={`${isActive('/destinations') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'} transition-colors`}
        >
          Destinations
        </Link>
        <Link 
          href="/packages" 
          className={`${isActive('/packages') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'} transition-colors`}
        >
          Packages
        </Link>

      </div>
      
      <div className="flex items-center space-x-6">
        <Link href="/packages" className="bg-white border border-gray-300 rounded-full px-4 py-2 text-black hover:bg-gray-50 transition">
          Explore Packages
        </Link>
        
        {user ? (
          <div className="relative">
            <div 
              className="h-8 w-8 bg-gray-300 rounded-full overflow-hidden cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {user.profileImage ? (
                <Image 
                  src={user.profileImage} 
                  alt={user.name || user.Name || 'User'} 
                  width={32} 
                  height={32}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-600 text-sm font-bold">
                  {getUserInitial()}
                </div>
              )}
            </div>
            
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  My Profile
                </Link>
                <Link href="/profile/bookings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  My Bookings
                </Link>
                <Link href="/profile/wishlist" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Wishlist
                </Link>
                <button 
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }} 
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-gray-700 hover:text-blue-600 transition">
              Sign In
            </Link>
            <Link 
              href="/register" 
              className="bg-blue-600 text-white rounded-full px-4 py-2 hover:bg-blue-700 transition"
            >
              Sign Up
            </Link>
          </div>
        )}
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-gray-900" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg z-20 mt-2">
          <nav className="flex flex-col p-4">
            <Link 
              href="/" 
              className={`${isActive('/') ? 'text-blue-600' : 'text-gray-700'} py-2`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/destinations" 
              className={`${isActive('/destinations') ? 'text-blue-600' : 'text-gray-700'} py-2`}
              onClick={() => setIsMenuOpen(false)}
            >
              Destinations
            </Link>
            <Link 
              href="/packages" 
              className={`${isActive('/packages') ? 'text-blue-600' : 'text-gray-700'} py-2`}
              onClick={() => setIsMenuOpen(false)}
            >
              Packages
            </Link>
            <Link 
              href="/support" 
              className="text-gray-700 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Support
            </Link>
            
            {!user && (
              <>
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <Link 
                    href="/login" 
                    className="block py-2 text-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/register" 
                    className="block bg-blue-600 text-white rounded-lg py-2 px-4 text-center mt-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}