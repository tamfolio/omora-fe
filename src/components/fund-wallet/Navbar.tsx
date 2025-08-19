import { FiUser } from "react-icons/fi";
import { CiSettings } from "react-icons/ci";
import { FiBell } from "react-icons/fi";
import { CiSearch } from "react-icons/ci";
import Logo from "@/components/ui/Logo";
import Link from "next/link";

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
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-teal-600 font-medium transition-colors duration-200"
              >
                Dashboard
              </Link>
              <Link
                href="dashboard/investment"
                className="text-gray-700 hover:text-teal-600 font-medium transition-colors duration-200"
              >
                Investment
              </Link>
              <Link
                href="/news"
                className="text-gray-700 hover:text-teal-600 font-medium transition-colors duration-200"
              >
                News
              </Link>
              <Link
                href="/community"
                className="text-gray-700 hover:text-teal-600 font-medium transition-colors duration-200"
              >
                Community
              </Link>
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Action Buttons */}
          <div className="flex items-center gap-3">
  <Link
    href="/dashboard/fund-wallet"  // Fixed: added /dashboard
    className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200 shadow-sm"
  >
    Fund Wallet
  </Link>
  <Link
    href="/dashboard/wallet"  // Fixed: added /dashboard
    className="text-gray-600 hover:text-gray-900 px-4 py-2.5 text-sm font-medium transition-colors duration-200"
  >
    Wallet
  </Link>
  <Link
    href="/dashboard/portfolio"  // Fixed: added /dashboard
    className="text-gray-600 hover:text-gray-900 px-4 py-2.5 text-sm font-medium transition-colors duration-200"
  >
    Portfolio
  </Link>
</div>

            {/* Icon Actions */}
            <div className="flex items-center gap-1">
              <Link
                href="/search"
                className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <CiSearch className="w-5 h-5" />
              </Link>

              <Link
                href="/settings"
                className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <CiSettings className="w-5 h-5" />
              </Link>

              <Link
                href="/notifications"
                className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 relative"
              >
                <FiBell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              </Link>

              <Link
                href="/profile"
                className="ml-2 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm"
              >
                <FiUser className="w-4 h-4 text-gray-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
