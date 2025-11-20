"use client"
import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Search, Settings, Bell, User, LogOut, PiggyBank } from "lucide-react";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoCloseOutline } from "react-icons/io5";
import Logo from "@/components/ui/Logo";
import Logout from "@/components/ui/UserDashboard/Settings/Logout";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  
  // ✅ Use REAL session from NextAuth
  const { data: session, status } = useSession();
  
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  // Navigation items for authenticated users
  const authenticatedNavItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Investment", href: "/dashboard/investments" },
    { name: "Wallet", href: "/dashboard/fund-wallet" },
    { name: "News", href: "/newsroom" },
    { name: "Community", href: "/community" },
  ];

  // Navigation items for unauthenticated users
  const publicNavItems = [
    { name: "About", href: "/about" },
    { name: "Features", href: "/features" },
    { name: "News", href: "/news" },
    { name: "Community", href: "/community" },
  ];

  const navItems = isAuthenticated ? authenticatedNavItems : publicNavItems;

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex gap-5 items-center">
              <Logo width={150} height={40} />

              {/* Desktop Navigation */}
              <div className="hidden lg:block">
                <div className="flex items-baseline">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-semibold transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side menu */}
            <div className="hidden lg:flex items-center space-x-6">
              {isAuthenticated ? (
                <>
                  {/* Fund Wallet Button - Only for authenticated users */}
                  <Link
                    href="/dashboard/create-investment"
                    className="bg-[#008B99] !w-fit flex items-center gap-1 text-sm text-nowrap py-2.5 px-3.5 rounded-[8px] text-white"
                  >
                    <PiggyBank color="#66D7E5" size={20} />
                    Begin Investment
                  </Link>

                  {/* Icons for authenticated users */}
                  <div className="flex items-center space-x-3">
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                      <Search className="h-5 w-5" />
                    </button>
                    <Link
                      href="/dashboard/settings"
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      <Settings className="h-5 w-5" />
                    </Link>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 relative">
                      <Bell className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                    </button>

                    {/* User Profile Dropdown */}
                    <div className="relative group">
                      <button className="flex items-center space-x-2 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                        {session?.user?.image ? (
                          <img
                            src={session.user.image}
                            alt={session.user.name || "User"}
                            className="h-6 w-6 rounded-full"
                          />
                        ) : (
                          <User className="h-5 w-5" />
                        )}
                        {session?.user?.name && (
                          <span className="text-sm font-medium text-gray-700">
                            {session.user.name.split(" ")[0]}
                          </span>
                        )}
                      </button>

                      {/* Dropdown Menu */}
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="py-1">
                          <div className="px-4 py-2 text-sm text-gray-500 border-b">
                            {session?.user?.email}
                          </div>
                          <Link
                            href="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Profile
                          </Link>
                          <Link
                            href="/dashboard/settings"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Settings
                          </Link>
                          <button
                            onClick={() => setShowLogout(true)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Sign out</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Online indicator */}
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </>
              ) : (
                /* UNAUTHENTICATED SIDE - Login/Signup buttons */
                <>
                  {!isLoading && (
                    <div className="flex items-center space-x-4">
                      <Link
                        href="/auth/login"
                        className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors duration-200"
                      >
                        Login
                      </Link>
                      <Link
                        href="/auth/signup"
                        className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Mobile/Tablet menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-900 hover:text-teal-600 transition-colors duration-200 flex items-center justify-center"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <IoCloseOutline className="h-8 w-8" />
                ) : (
                  <RxHamburgerMenu className="h-7 w-7" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile/Tablet Dropdown Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden absolute left-0 right-0 top-16 bg-teal-500 shadow-lg z-50">
              <div className="px-4 pt-4 pb-6 space-y-3">
                {/* Navigation Links */}
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-white hover:text-teal-100 block px-3 py-2.5 text-base font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Divider */}
                <div className="border-t border-teal-400 my-4"></div>

                {/* Auth Buttons */}
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/dashboard/create-investment"
                      className="bg-white text-teal-600 flex items-center justify-center gap-2 text-sm font-semibold py-3 px-4 rounded-lg w-full"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <PiggyBank size={20} />
                      Begin Investment
                    </Link>
                    
                    <div className="flex items-center justify-between px-3 py-3 bg-teal-600 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {session?.user?.image ? (
                          <img
                            src={session.user.image}
                            alt={session.user.name || "User"}
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-teal-600" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-white">
                            {session?.user?.name}
                          </p>
                          <p className="text-xs text-teal-100">
                            {session?.user?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setShowLogout(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-white hover:text-teal-100 px-3 py-2.5 text-base font-medium flex items-center space-x-2 transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sign out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/signup"
                      className="block w-full bg-white text-teal-600 px-4 py-3 rounded-lg text-base font-semibold transition-colors duration-200 text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                    <Link
                      href="/auth/login"
                      className="block w-full text-white hover:text-teal-100 px-4 py-3 text-base font-medium transition-colors duration-200 border-2 border-white rounded-lg text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Logout Modal */}
      <Logout 
        isOpen={showLogout} 
        onClose={() => setShowLogout(false)} 
      />
    </>
  );
}

export default Navbar;