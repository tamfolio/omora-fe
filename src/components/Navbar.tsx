"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  Search,
  Settings,
  Bell,
  User,
  LogOut,
  PiggyBank,
  Wallet,
  Briefcase,
  HelpCircle,
} from "lucide-react";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoCloseOutline } from "react-icons/io5";
import { FaLinkedin, FaWhatsapp } from "react-icons/fa";
import Logo from "@/components/ui/Logo";
import Logout from "@/components/ui/user-dashboard/settings/Logout";
import { useUserData } from "@/contexts/UserDataContext";

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

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const { data: session, status } = useSession();
  const { userData } = useUserData();
  const pathname = usePathname();

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  const user = session?.user as ExtendedUser | undefined;

  // Smart Display Name Logic
  const getDisplayName = () => {
    if (userData?.business?.businessName) return userData.business.businessName;
    if (userData?.user?.firstName) {
      const rawName = userData.user.firstName;
      return rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();
    }
    if (user?.name && !user.name.includes("@")) return user.name;
    if (user?.email) {
      const emailName = user.email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "").replace(/\d+/g, "");
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    return "User";
  };

  // Dynamic Navigation Arrays
  const authenticatedNavItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Investment", href: "/dashboard/investments" },
    { name: "Wallet", href: "/dashboard/fund-wallet" },
    { name: "News", href: "/newsroom" },
    { name: "Community", href: "/community" },
  ];

  const publicNavItems = [
    { name: "About", href: "/about-us" },
    { name: "Insights", href: "/insights" },
    { name: "News", href: "/newsroom" },
    { name: "FAQs", href: "/frequently-asked-questions" },
  ];

  const navItems = isAuthenticated ? authenticatedNavItems : publicNavItems;

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* LEFT: Logo & Links */}
            <div className="flex gap-5 lg:gap-10 items-center">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                <Logo width={150} height={40} />
              </Link>

              <div className="hidden lg:block">
                <div className="flex items-baseline gap-6">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`px-1 py-2 text-sm font-semibold transition-colors duration-200 ${
                        pathname === item.href ? "text-[#008B99]" : "text-gray-700 hover:text-[#008B99]"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-6">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard/create-investment"
                    className="bg-[#008B99] hover:bg-[#007A86] transition-colors !w-fit flex items-center gap-2 text-sm text-nowrap py-2.5 px-4 rounded-[8px] text-white font-medium"
                  >
                    <PiggyBank color="#66D7E5" size={20} />
                    Begin Investment
                  </Link>

                  <div className="flex items-center space-x-3">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all">
                      <Search className="h-5 w-5" />
                    </button>
                    <Link href="/dashboard/settings" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all">
                      <Settings className="h-5 w-5" />
                    </Link>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all relative">
                      <Bell className="h-5 w-5" />
                      <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* Profile Dropdown */}
                    <div className="relative group ml-2">
                      <button className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded-full transition-colors duration-200">
                        {user?.image ? (
                          <img src={user.image} alt={getDisplayName()} className="h-8 w-8 rounded-full border-2 border-teal-500 object-cover" />
                        ) : (
                          <div className="h-8 w-8 rounded-full border-2 border-teal-500 bg-teal-50 flex items-center justify-center">
                            <User className="h-4 w-4 text-teal-600" />
                          </div>
                        )}
                      </button>

                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-[0px_8px_24px_rgba(0,0,0,0.12)] border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="p-4 border-b border-gray-100 bg-gray-50 rounded-t-lg">
                          <div className="flex items-center space-x-3">
                            {user?.image ? (
                              <img src={user.image} alt={getDisplayName()} className="h-10 w-10 rounded-full object-cover" />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                                <User className="h-5 w-5 text-teal-600" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">{getDisplayName()}</p>
                              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            </div>
                          </div>
                        </div>

                        <div className="py-2">
                          <Link href="/dashboard/profile" className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 transition-colors">
                            <User className="h-4 w-4 text-gray-400" /><span>View profile</span>
                          </Link>
                          <Link href="/dashboard/settings" className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 transition-colors">
                            <Settings className="h-4 w-4 text-gray-400" /><span>Settings</span>
                          </Link>
                          <Link href="/dashboard/fund-wallet" className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 transition-colors">
                            <Wallet className="h-4 w-4 text-gray-400" /><span>Wallet</span>
                          </Link>
                          <Link href="/dashboard/portfolio" className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 transition-colors">
                            <Briefcase className="h-4 w-4 text-gray-400" /><span>Portfolio</span>
                          </Link>

                          <div className="border-t border-gray-100 my-1"></div>

                          <Link href="#" className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 transition-colors">
                            <HelpCircle className="h-4 w-4 text-gray-400" /><span>Help Center</span>
                          </Link>

                          <div className="border-t border-gray-100 my-1"></div>

                          <button onClick={() => setShowLogout(true)} className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                            <LogOut className="h-4 w-4" /><span>Sign out</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                !isLoading && (
                  <div className="flex items-center space-x-4">
                    <Link href="/auth/login" className="text-gray-600 hover:text-[#008B99] font-medium transition-colors duration-200">
                      Log in
                    </Link>
                    <Link href="/auth/signup" className="bg-[#008B99] hover:bg-[#007A86] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200 shadow-sm">
                      Sign Up
                    </Link>
                  </div>
                )
              )}
            </div>

            {/* Mobile menu Toggle Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-900 hover:text-teal-600 transition-colors duration-200"
              >
                {isMobileMenuOpen ? <IoCloseOutline className="h-8 w-8" /> : <RxHamburgerMenu className="h-7 w-7" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="lg:hidden absolute left-0 right-0 top-16 bg-[#008B99] shadow-xl z-50 animate-in slide-in-from-top-2 border-t border-teal-600">
              <div className="px-4 py-6 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-white hover:bg-white/10 block px-4 py-3 rounded-lg text-base font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                <div className="border-t border-white/20 my-4"></div>

                {isAuthenticated ? (
                  <>
                    <Link
                      href="/dashboard/create-investment"
                      className="bg-white text-[#008B99] flex items-center justify-center gap-2 text-sm font-bold py-3.5 px-4 rounded-lg w-full mb-4 shadow-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <PiggyBank size={20} />
                      Begin Investment
                    </Link>

                    <div className="flex items-center space-x-3 px-4 py-3 bg-white/10 rounded-lg mb-4">
                      {user?.image ? (
                        <img src={user.image} alt={getDisplayName()} className="h-10 w-10 rounded-full object-cover" />
                      ) : (
                        <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-[#008B99]" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">{getDisplayName()}</p>
                        <p className="text-xs text-teal-100">{user?.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                        <Link href="/dashboard/settings" onClick={() => setIsMobileMenuOpen(false)} className="flex justify-center items-center gap-2 bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-lg text-sm transition-colors">
                            <Settings size={16} /> Settings
                        </Link>
                        <Link href="/dashboard/wallet" onClick={() => setIsMobileMenuOpen(false)} className="flex justify-center items-center gap-2 bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-lg text-sm transition-colors">
                            <Wallet size={16} /> Wallet
                        </Link>
                    </div>

                    <button
                      onClick={() => { setShowLogout(true); setIsMobileMenuOpen(false); }}
                      className="w-full bg-red-500/20 text-white hover:bg-red-500/30 py-3 rounded-lg text-base font-medium flex justify-center items-center space-x-2 transition-colors"
                    >
                      <LogOut className="h-5 w-5" /><span>Sign out</span>
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3 pt-2">
                    <Link
                      href="/auth/signup"
                      className="block w-full bg-white text-[#008B99] px-4 py-3.5 rounded-lg text-base font-bold shadow-sm text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                    <Link
                      href="/auth/login"
                      className="block w-full text-white hover:bg-white/10 px-4 py-3.5 text-base font-bold transition-colors border-2 border-white/20 rounded-lg text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Log in
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Logout Modal */}
      {showLogout && <Logout isOpen={showLogout} onClose={() => setShowLogout(false)} />}
    </>
  );
}