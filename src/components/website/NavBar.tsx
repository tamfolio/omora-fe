"use client"
import React, { useState } from "react";
import { useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Search, Settings, Bell, User, LogOut, PiggyBank, Wallet, Briefcase, HelpCircle } from "lucide-react";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoCloseOutline } from "react-icons/io5";
import { FaLinkedin, FaWhatsapp } from "react-icons/fa";
import Logo from "@/components/ui/Logo";
import Logout from "@/components/ui/UserDashboard/Settings/Logout";

type ExtendedUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  image?: string | null;
  accessToken?: string;
  refreshToken?: string;
  isFirstLogin?: boolean;
};

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  
  const { data: session, status } = useSession();
  
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  
  const user = session?.user as ExtendedUser | undefined;

  const getDisplayName = () => {
    if (!user) return "User";
    
    if (user.name && !user.name.includes("@")) {
      return user.name;
    }
    
    if (user.email) {
      const emailName = user.email.split("@")[0];
      const formatted = emailName
        .replace(/[^a-zA-Z0-9]/g, "")
        .replace(/\d+/g, "");
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    }
    
    return "User";
  };

const [userName, setUserName] = useState("User");


useEffect(() => {
  const fetchUserName = async () => {
    try {
      const response = await fetch("/api/proxy/user/api/v1/me");
      const result = await response.json();
      
      if (result.status === "success" && result.data.user?.firstName) {
        const rawName = result.data.user.firstName;
        const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();
        setUserName(formattedName);
      }
    } catch (error) {
      console.error("Failed to fetch user name", error);
    }
  };

  fetchUserName();
}, []);

  const authenticatedNavItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Investment", href: "/dashboard/investments" },
    { name: "Wallet", href: "/dashboard/fund-wallet" },
    { name: "News", href: "/newsroom" },
    { name: "Community", href: "/community" },
  ];

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
            <div className="flex gap-5 items-center">
              <Logo width={150} height={40} />

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

            <div className="hidden lg:flex items-center space-x-6">
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

                    {/* Profile Dropdown */}
                    <div className="relative group">
                      <button className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-full transition-colors duration-200">
                        {user?.image ? (
                          <img
                            src={user.image}
                            alt={getDisplayName()}
                            className="h-8 w-8 rounded-full border-2 border-teal-500"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full border-2 border-teal-500 bg-teal-50 flex items-center justify-center">
                            <User className="h-4 w-4 text-teal-600" />
                          </div>
                        )}
                      </button>

                      {/*  Dropdown Menu */}
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        {/* Profile Header */}
                        <div className="p-4 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            {user?.image ? (
                              <img
                                src={user.image}
                                alt={getDisplayName()}
                                className="h-12 w-12 rounded-full"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center">
                                <User className="h-6 w-6 text-teal-600" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {userName}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {user?.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <Link
                            href="/dashboard/profile"
                            className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <User className="h-4 w-4 text-gray-400" />
                            <span>View profile</span>
                          </Link>
                          
                          <Link
                            href="/dashboard/settings"
                            className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Settings className="h-4 w-4 text-gray-400" />
                            <span>Settings</span>
                          </Link>
                          
                            <div className="border-t border-gray-100 my-2"></div>

                          <Link
                            href="/dashboard/wallet"
                            className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Wallet className="h-4 w-4 text-gray-400" />
                            <span>Wallet</span>
                          </Link>
                          
                          <Link
                            href="/dashboard/portfolio"
                            className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Briefcase className="h-4 w-4 text-gray-400" />
                            <span>Portfolio</span>
                          </Link>

                          <div className="border-t border-gray-100 my-2"></div>
                          
                          <Link
                            href="https://linkedin.com/company/omora"
                            target="_blank"
                            className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <FaLinkedin className="h-4 w-4 text-[#0077B5]" />
                            <span>LinkedIn Community</span>
                          </Link>
                          
                          <Link
                            href="https://wa.me/your-whatsapp-link"
                            target="_blank"
                            className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <FaWhatsapp className="h-4 w-4 text-[#25D366]" />
                            <span>WhatsApp Community</span>
                          </Link>
                          
                          <Link
                            href="/help"
                            className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                            <span>Help</span>
                          </Link>

                          <div className="border-t border-gray-100 my-2"></div>
                          
                          <button
                            onClick={() => setShowLogout(true)}
                            className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <LogOut className="h-4 w-4 text-gray-400" />
                            <span>Sign out</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* <div className="w-2 h-2 bg-green-500 rounded-full"></div> */}
                  </div>
                </>
              ) : (
                <>
                  {!isLoading && (
                    <div className="flex items-center space-x-4">
                      <Link
                        href="/"
                        className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors duration-200"
                      >
                        Login
                      </Link>
                      <Link
                        href="/"
                        className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>

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

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden absolute left-0 right-0 top-16 bg-teal-500 shadow-lg z-50">
              <div className="px-4 pt-4 pb-6 space-y-3">
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

                <div className="border-t border-teal-400 my-4"></div>

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
                        {user?.image ? (
                          <img
                            src={user.image}
                            alt={getDisplayName()}
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-teal-600" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-white">
                            {getDisplayName()}
                          </p>
                          <p className="text-xs text-teal-100">
                            {user?.email}
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

      <Logout 
        isOpen={showLogout} 
        onClose={() => setShowLogout(false)} 
      />
    </>
  );
}

export default Navbar;