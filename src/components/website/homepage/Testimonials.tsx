import React from 'react'
import Image from 'next/image'


const testimonials = [
    {
        name: "Segun A.",
        role: "Early Investor",
        testimonial: `What convinced me was how clear Omora&apos;s value proposition is. It's not just crypto hype. The team has built an actual portfolio automation engine for serious investors. My returns have been stable, and i finally feel in control without being glued to the charts.`,
        stars: 5,
        img: '/assets/images/website/avatar-1.png'
    },
    {
        name: "Adeleke O.",
        role: "Banker & Product Strategist",
        testimonial: "I've known the founder for years, and his brilliance shows in OMORA. He doesn't cut corners. The portfolio logic, the AI triggers and the user education are all intentional. i trust this more than  any exchange-based product i've seen.",
        stars: 5,
        img: '/assets/images/website/avatar-2.png'
    },
    {
        name: "Oluseyi A.",
        role: "Founding Engineer",
        testimonial: "Working on Omora has been different. It's one of the few products i've helped build that i'd also recommend to my own family. We've obsessively tested performance scenarios and risk handling and it shows in how smooth it feels.",
        stars: 5,
        img: '/assets/images/website/avatar-3.png'
    },
    {
        name: "Zainab R.",
        role: "Entrepreneur & Private Investor",
        testimonial: "As someone who invests across sectors, i need a platform that handles crypto volatility intelligently. Omora's AI powered rebalancing and yield strategies are a dream and i've already recommended it to my investment circle",
        stars: 5,
        img: '/assets/images/website/avatar-2.png'
    },
    {
        name: "Yinka J.",
        role: "Design Lead",
        testimonial: "From the beginning, we agreed Omora had to feel like wealth, not like another exchange. The UI was designed to feel personal and trustwortht, and watching people use what we've built with confidence has been deeply rewarding.",
        stars: 5,
        img: '/assets/images/website/avatar-2.png'
    },
    {
        name: "Anita O.",
        role: "Product Lead",
        testimonial: "To be honest, i've always found most crypto platforms too complicated with overwhelming charts and too many moving parts. I built this platform for people like me-people who want to invest in crypto smartly, without needing a PhD in blockchain, With Omora, you don’t have to know when to buy or what token is trending. You just set your goal, and we have handle the rest simply, transparently, and automatically.",
        stars: 5,
        img: '/assets/images/website/avatar-3.png'
    },
]

export default function Testimonials() {
  return (
    <div className='py-24 px-[112px] bg-[#005963] text-white'>
      <h2 className='text-center text-[36px] mb-16 font-semibold'>Testimonials</h2>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {testimonials.map((user, index) => (
            <div key={index} className='bg-[#00717D] rounded-xl min-h-[389px] p-8 flex flex-col justify-between'>
                <div>
                    <div className="flex mb-4">
                {Array.from({ length: user.stars }).map((_, i) => (
                    <Image
                    key={i}
                    src="/assets/images/website/star.svg"
                    alt="star"
                    width={20}
                    height={20}
                    />
                ))}
                </div>
                <p className='font-medium leading-6'>{user.testimonial}</p>
                </div>
                 
                <div className='flex gap-3 items-center mt-8'>
                    <Image src={user.img} alt="omora testimonial" width={48} height={48} />
                    <div>
                        <span className='block font-semibold text-base'>{user.name}</span>
                        <span className='block font-normal'>({user.role})</span>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  )
}
