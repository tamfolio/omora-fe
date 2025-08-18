import { FiUser } from "react-icons/fi";
import { CiSettings } from "react-icons/ci";
import { FiBell } from "react-icons/fi";
import { CiSearch } from "react-icons/ci";
import Logo from "@/components/ui/Logo";

export default function Navbar() {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-10">
            <div className="flex items-center">
              <Logo width={150} height={40} />
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a 
                href="#" 
                className="text-gray-700 hover:text-teal-600 font-medium transition-colors duration-200"
              >
                Dashboard
              </a>
              <a 
                href="#" 
                className="text-gray-700 hover:text-teal-600 font-medium transition-colors duration-200"
              >
                Investment
              </a>
              <a 
                href="#" 
                className="text-gray-700 hover:text-teal-600 font-medium transition-colors duration-200"
              >
                News
              </a>
              <a 
                href="#" 
                className="text-gray-700 hover:text-teal-600 font-medium transition-colors duration-200"
              >
                Community
              </a>
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200 shadow-sm">
                Fund Wallet
              </button>
              <button className="text-gray-600 hover:text-gray-900 px-4 py-2.5 text-sm font-medium transition-colors duration-200">
                Wallet
              </button>
              <button className="text-gray-600 hover:text-gray-900 px-4 py-2.5 text-sm font-medium transition-colors duration-200">
                Portfolio
              </button>
            </div>

            {/* Icon Actions */}
            <div className="flex items-center gap-1">
              <button className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200">
                <CiSearch className="w-5 h-5" />
              </button>
               <button className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200">
                <CiSettings className="w-5 h-5" />
              </button>
              <button className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 relative">
                <FiBell className="w-5 h-5" />
                {/* Notification dot */}
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
             
              {/* User Avatar */}
              <button className="ml-2 w-9 h-9 rounded-full flex items-center justify-center  transition-all duration-200 shadow-sm">
                <FiUser className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}