"use client";

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-white font-bold text-xl">NextStop</span>
          </div>
          
          <div className="mb-4 md:mb-0">
            <ul className="flex space-x-6">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white text-sm font-medium">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="text-gray-400 hover:text-white text-sm font-medium">
                  Destinations
                </Link>
              </li>
              <li>
                <Link href="/packages" className="text-gray-400 hover:text-white text-sm font-medium">
                  Packages
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-4 pt-4">
          <p className="text-gray-400 text-xs text-center">
            &copy; {new Date().getFullYear()} NextStop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}