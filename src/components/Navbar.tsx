"use client"
import React, { useState } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Search, Settings, Bell, User, Menu, X, LogOut } from "lucide-react";
import Logo from "@/components/ui/Logo";

// TypeScript interface for mock session
interface MockSession {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string; // Add optional image property
  };
  accessToken: string;
}

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  
  // TEMPORARY: Mock session for testing
  const mockSession: MockSession = {
    user: {
      id: "test-user-123",
      name: "Test User",
      email: "test@example.com",
      role: "user"
      // No image provided, so it will show the default User icon
    },
    accessToken: "mock-token"
  };
  
  // Use mock data instead of real session for testing
  const testSession = mockSession; // Change this back to `session` later
  const testStatus: "authenticated" | "unauthenticated" | "loading" = "authenticated"; // Change this back to `status` later
  
  const isAuthenticated = testStatus === "authenticated";
  const isLoading = "loading";
  console.log("testing");
  console.log("🔍 NAVBAR DEBUG:");
  console.log("Status:", status);
  console.log("Session:", session);
  console.log("Is authenticated:", isAuthenticated);
  console.log("Is loading:", isLoading);
  console.log("Current URL:", typeof window !== 'undefined' ? window.location.pathname : 'SSR');
  console.log("==================");

  // Navigation items for authenticated users
  const authenticatedNavItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Investment", href: "/dashboard/investments" },
    { name: "News", href: "/news" },
    { name: "Community", href: "/community" },
  ];

  // Navigation items for unauthenticated users
  const publicNavItems = [
    { name: "About", href: "/about" },
    { name: "Features", href: "/features" },
    { name: "News", href: "/news" },
    { name: "Community", href: "/community" },
  ];

  const rightMenuItems = [
    { name: "Wallet", href: "dashboard/wallet" },
    { name: "Portfolio", href: "dashboard/portfolio" },
  ];

  const navItems = isAuthenticated ? authenticatedNavItems : publicNavItems;

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

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
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-semibold transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right side menu */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                {/* Fund Wallet Button - Only for authenticated users */}
                <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                  Fund Wallet
                </button>

                {/* Authenticated Right Menu Items */}
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

                  {/* User Profile Dropdown - ALL FIXED TO USE testSession */}
                  <div className="relative group">
                    <button className="flex items-center space-x-2 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                      {testSession?.user?.image ? (
                        <img
                          src={testSession.user.image}
                          alt={testSession.user.name || "User"}
                          className="h-6 w-6 rounded-full"
                        />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                      {testSession?.user?.name && (
                        <span className="text-sm font-medium text-gray-700">
                          {testSession.user.name.split(" ")[0]}
                        </span>
                      )}
                    </button>

                    {/* Dropdown Menu - ALL FIXED TO USE testSession */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="py-1">
                        <div className="px-4 py-2 text-sm text-gray-500 border-b">
                          {testSession?.user?.email}
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
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {isAuthenticated &&
                rightMenuItems.map((item) => (
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

            {/* Mobile user section */}
            {testStatus === "authenticated" ? (
              <>
                {/* Mobile icons */}
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

                {/* Mobile user info - ALL FIXED TO USE testSession */}
                <div className="px-2 pb-3 border-t border-gray-200">
                  <div className="flex items-center px-3 py-2 space-x-3">
                    {testSession?.user?.image ? (
                      <img
                        src={testSession.user.image}
                        alt={testSession.user.name || "User"}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {testSession?.user?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {testSession?.user?.email}
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
              /* UNAUTHENTICATED SIDE - Mobile login buttons */
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