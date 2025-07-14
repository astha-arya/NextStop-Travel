import Header from '@/components/layout/Header';
import HeroSection from '@/components/home/HeroSection';
import SearchForm from '@/components/home/SearchForm';
import TourPackages from '@/components/home/TourPackages';
import ExploreNearby from '@/components/home/ExploreNearby';
import LiveAnywhere from '@/components/home/LiveAnywhere';
import MobileAppShowcase from '@/components/home/MobileAppShowcase';
import FeaturesSection from '@/components/home/FeaturesSection';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f9f5f5]">
   
      <div className="max-w-[1300px] mx-auto w-full px-10 py-4">
        <Header />
      </div>
      
    
      <div className="max-w-[1550px] mx-auto w-full px-3 relative mb-40">
        <HeroSection />
        <SearchForm />
      </div>
      

      <div className="w-full">
        <ExploreNearby />
      </div>
      

      <div className="w-full">
        <LiveAnywhere />
      </div>
      

      
      {/* Footer */}
      <Footer />
    </div>
  );
}