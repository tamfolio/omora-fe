"use client"

import React, { useState } from 'react'
import { Button } from '../ui/button'

export default function CookiesPopUp() {
    const [hasAcceptedCookies, setHasAcceptedCookies] = useState(false);


  return (
    <div className={`fixed z-20 bottom-8 right-8 rounded-[20px] bg-[#00717D] p-6 text-[#ECFEFF] w-[488px] ${hasAcceptedCookies ? "hidden" : "block"}`}>
      <h1 className='text-[20px] font-semibold mb-3'>Omora Uses Cookies</h1>
      <p className='text-[18px]'>We use cookies to enhance your experience, analyze site traffic, and serve targeted content. By continuing to use Omora, you consent to our <span className='underline'>use of cookies</span>.</p>

      <p className='underline mt-2 text-[18px]'>View our Privacy Policy</p>

      <div className='border-t border-dashed my-6 border-[#ECFEFF]'></div>

      <div className='flex justify-between'>
        <Button onClick={() => setHasAcceptedCookies(true)} className='w-[212px] px-[18px] py-3 rounded-[8px] text-base hover:bg-[#008B99] bg-[#008B99]'>Reject non-essentials</Button>
        <Button className='w-[212px] px-[18px] py-3 rounded-[8px] text-base hover:bg-white bg-white text-[#155E75]'>Accept</Button>
      </div>
    </div>
  )
}
