import React, { useState } from "react";
import Link from "next/link";
import { Search, Settings, Bell, User, Menu, X } from "lucide-react";
import Logo from "@/components/ui/Logo";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Investment", href: "/investment" },
    { name: "News", href: "/news" },
    { name: "Community", href: "/community" },
  ];

  const rightMenuItems = [
    { name: "Wallet", href: "/wallet" },
    { name: "Portfolio", href: "/portfolio" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex gap-5">
            <Logo width={150} height={40} />

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-#414651 hover:text-gray-900 px-3 py-2 text-sm font-semibold transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right side menu */}
          <div className="hidden md:flex items-center space-x-6">
          <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
              Fund Wallet
            </button>
            {/* Right menu items */}
            <div className="flex items-center space-x-6">
              {rightMenuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                <Search className="h-5 w-5" />
              </button>
              <Link href="/dashboard/settings" className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                <Settings className="h-5 w-5" />
              </Link>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                <User className="h-5 w-5" />
              </button>
              {/* Online indicator */}
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900 block px-3 py-2 text-base font-medium"
                >
                  {item.name}
                </Link>
              ))}
              {rightMenuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900 block px-3 py-2 text-base font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile icons */}
            <div className="px-2 pb-3 border-t border-gray-200">
              <div className="flex items-center space-x-4 px-3 py-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                  <Search className="h-5 w-5" />
                </button>
                <Link href="/settings" className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                  <Settings className="h-5 w-5" />
                </Link>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                  <User className="h-5 w-5" />
                </button>
                <div className="w-2 h-2 bg-green-500 rounded-full ml-2"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;