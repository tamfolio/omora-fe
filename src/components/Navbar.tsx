"use client"
import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Search, Settings, Bell, User, Menu, X, LogOut, PiggyBank } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { useUserData } from "@/contexts/UserDataContext";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  
  const { userData } = useUserData();
  
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  const authenticatedNavItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Investment", href: "/dashboard/investments" },
    { name: "Wallet", href: "/dashboard/fund-wallet" },
    { name: "News", href: "/newsroom" },
    { name: "Community", href: "/community" },
  ];

  const publicNavItems = [
    { name: "About", href: "/about-us" },
    { name: "Features", href: "/features" },
    { name: "News", href: "/newsroom" },
    { name: "Community", href: "/community" },
    { name: "Home", href: "/" },
  ];

  const navItems = isAuthenticated ? authenticatedNavItems : publicNavItems;

  const displayName = userData?.business?.businessName 
    ? userData.business.businessName 
    : session?.user?.name?.split(" ")[0] || "User";

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        
        
        <div className="flex justify-between items-center h-16">
          
          {/* LEFT SIDE: Logo & Links */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div className="flex gap-5">
              <Link href="/">
                <Logo width={150} height={40} />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
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

          {/* RIGHT SIDE: User Menu & Mobile Toggle */}
          <div className="flex items-center">
            
            {/* Desktop Right side menu */}
            <div className="hidden md:flex items-center space-x-6">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard/create-investment"
                    className="bg-[#008B99] !w-fit flex items-center gap-1 text-sm text-nowrap py-2.5 px-3.5 rounded-[8px] text-white"
                  >
                    <PiggyBank color="#66D7E5" size={20} />
                    Begin Investment
                  </Link>

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
                        {(session?.user as any)?.image ? (
                          <img
                            src={(session.user as any).image}
                            alt={displayName}
                            className="h-6 w-6 rounded-full"
                          />
                        ) : (
                          <User className="h-5 w-5" />
                        )}
                        <span className="text-sm font-medium text-gray-700">
                          {displayName}
                        </span>
                      </button>

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
                            onClick={handleSignOut}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Sign out</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </>
              ) : (
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

            {/* Mobile menu button (Now correctly aligned to the right side!) */}
            <div className="md:hidden ml-4">
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
        </div> {/* FIXED: Main flex wrapper ends here! */}

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900 block px-3 py-2 text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {isAuthenticated ? (
              <>
                <div className="px-2 pb-3 border-t border-gray-200">
                  <div className="flex items-center space-x-4 px-3 py-2">
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
                    <div className="w-2 h-2 bg-green-500 rounded-full ml-2"></div>
                  </div>
                </div>

                <div className="px-2 pb-3 border-t border-gray-200">
                  <div className="flex items-center px-3 py-2 space-x-3">
                    {(session?.user as any)?.image ? (
                      <img
                        src={(session.user as any).image}
                        alt={displayName}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {displayName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {session?.user?.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="px-2 pb-3 border-t border-gray-200">
                <div className="space-y-2 px-3 py-2">
                  <Link
                    href="/auth/signup"
                    className="block w-full bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                  <Link
                    href="/auth/login"
                    className="block w-full text-gray-600 hover:text-gray-900 px-4 py-2 text-sm font-medium transition-colors duration-200 border border-gray-300 rounded-lg text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;