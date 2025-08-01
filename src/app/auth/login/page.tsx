"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { FiEye, FiEyeOff } from "react-icons/fi"
import { RiCustomerServiceLine } from "react-icons/ri"
import Logo from "@/components/ui/Logo"
import Icon from "@/components/ui/Icon"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid Email or password. Please try again.")
        setLoading(false)
      } else {
        const session = await getSession()
        if (session) {
          // Check if first-time login
          const isFirstLogin = (session.user as any)?.isFirstLogin;
          if (isFirstLogin) {
            router.push("/firsttimelogin")
          } else {
            router.push("/dashboard")
          }
        }
      }
    } catch (error) {
      setError("An error occurred during sign in")
      setLoading(false)
    }
  }

  // Loading Screen Component
  if (loading) {
    return (
      <div className="h-screen bg-gray-50 flex flex-col relative overflow-hidden">
        <div className="h-full overflow-y-auto scrollbar-hide">
          {/* Customer Service Icon - Fixed Position */}
          <div className="fixed bottom-6 right-6 z-10">
            <button className="bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-full shadow-lg transition-colors duration-200">
              <RiCustomerServiceLine className="h-6 w-6" />
            </button>
          </div>

          {/* Content Container */}
          <div className="min-h-full flex flex-col">
            {/* Top Logo */}
            <div className="p-6">
              <Logo width={150} height={40} />
            </div>

            {/* Centered Loading Content */}
            <div className="flex-1 flex items-center justify-center px-8">
              <div className="w-full max-w-md text-center space-y-8">
                {/* Loading Icon */}
                <div className="mx-auto mb-6 w-16 h-16 flex items-center justify-center">
                  <Icon width={40} height={40} />
                </div>

                {/* Loading Text */}
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Signing you in...
                  </h2>
                  <p className="text-sm text-gray-600">
                    Please wait while we verify your credentials
                  </p>
                </div>

                {/* Loading Spinner */}
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col relative overflow-hidden">
      <div className="h-full overflow-y-auto scrollbar-hide">
        {/* Customer Service Icon - Fixed Position */}
        <div className="fixed bottom-6 right-6 z-10">
          <button className="bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-full shadow-lg transition-colors duration-200">
            <RiCustomerServiceLine className="h-6 w-6" />
          </button>
        </div>

        {/* Content Container */}
        <div className="min-h-full flex flex-col">
          {/* Top Logo */}
          <div className="p-6">
            <Logo width={150} height={40} />
          </div>

          {/* Centered Login Form */}
          <div className="flex-1 flex items-start justify-center pt-8 pb-16 px-8">
            <div className="w-full max-w-md space-y-8">
              {/* Center Logo */}
              <div className="text-center">
                <div className="mx-auto mb-6 w-16 h-16 flex items-center justify-center">
                  <Icon width={40} height={40} />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Log in to your account
                </h2>
                <p className="text-gray-600 text-sm">
                  Welcome back! Please enter your details.
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="text-red-500 text-sm text-center">
                    {error}
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                    placeholder="oliviathomas@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <FiEye className="h-4 w-4 text-gray-400" />
                      ) : (
                        <FiEyeOff className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember me and Forgot password */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                      disabled={loading}
                    />
                    <span className="ml-2 text-gray-600">Remember for 30 days</span>
                  </label>
                  <Link href="/auth/forgot-password" className="text-teal-600 hover:text-teal-500">
                    Forgot password
                  </Link>
                </div>

                {/* Sign in button */}
                <button
                  type="submit"
                  disabled={loading || !email || !password}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sign in
                </button>

                {/* Sign up link */}
                <div className="text-center text-sm">
                  <span className="text-gray-600">Don't have an account? </span>
                  <Link href="/auth/signup" className="text-teal-600 hover:text-teal-500 font-medium">
                    Sign up
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}