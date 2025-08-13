"use client"
import Navbar from '@/components/Navbar'
import Footer from '@/components/ui/Footer'
import MainPage from '@/components/ui/UserDashboard/MainPage'
import React from 'react'

function page() {
  return (
    <div>
      <Navbar/>
      <MainPage/>
      <Footer/>
    </div>
  )
}

export default page
