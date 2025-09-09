"use client";

import Link from "next/link";
import Image from 'next/image'; // Add this import

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      {/* <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Logo width={150} height={40} />
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/products" className="text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors flex items-center">
                Products
                <svg className="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <Link href="/services" className="text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors flex items-center">
                Services
                <svg className="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <Link href="/pricing" className="text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors">
                Pricing
              </Link>
              <Link href="/resources" className="text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors flex items-center">
                Resources
                <svg className="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors">
                About
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link 
                href="/auth/login" 
                className="px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:text-teal-600 hover:border-teal-300 transition-colors"
              >
                Log in
              </Link>
              <Link 
                href="/auth/signup" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </header> */}

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-24 sm:py-32 lg:px-8">
        <div className="max-w-6xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-left">
              <p className="text-base font-semibold text-teal-600 mb-4">
                404 error
              </p>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl mb-6">
                Page not found
              </h1>
              <p className="text-lg leading-7 text-gray-600 mb-10">
                Sorry, the page you are looking for doesn&lsquo;t exist or has been moved. Try searching our site.
              </p>
              <div className="flex items-center gap-x-6">
                <Link
                  href="/"
                  className="rounded-md bg-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 transition-colors"
                >
                  Take me home
                </Link>
                <button
                  onClick={() => window.history.back()}
                  className="text-sm font-semibold text-gray-900 hover:text-teal-600 flex items-center gap-2 transition-colors"
                >
                  <span aria-hidden="true">&larr;</span> Go back
                </button>
              </div>
            </div>

            {/* Right Column - 404 Illustration */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-md relative">
                <Image
                  src="/assets/images/logo/404-illustration.png"
                  alt="404 Page Not Found Illustration"
                  width={500}
                  height={500}
                  priority
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
