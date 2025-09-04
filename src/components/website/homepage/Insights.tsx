import React from 'react'
import { Button } from '../../ui/button'
import Image from 'next/image'

const insights = [
    {
        tag: "Design",
        title: "UX review presentations",
        description: "How do you create compelling presentations that wow your colleagues and impress your managers?",
        img: "/assets/images/website/insights/Image-1.png",
        date: "20 Jan 2025",
        name: "Olivia Rhye",
        userImg: "/assets/images/website/avatar-1.png"
    },
    {
        tag: "Product",
        title: "Migrating to Linear 101",
        description: "Linear helps streamline software projects, sprints, tasks, and bug tracking. Here's how to get started.",
        img: "/assets/images/website/insights/Image-2.png",
        date: "19 Jan 2025",
        name: "Phoenix Baker",
        userImg: "/assets/images/website/avatar-2.png"
    },
    {
        tag: "Software Engineering",
        title: "Building your API stack",
        description: "The rise of RESTful APIs has been met by a rise in tools for creating, testing, and managing them.",
        img: "/assets/images/website/insights/Image-3.png",
        date: "18 Jan 2025",
        name: "Lana Steiner",
        userImg: "/assets/images/website/avatar-3.png"
    },
]

export default function Insights() {
  return (
    <section className='py-24 px-[112px]'>
        <div className="flex items-start justify-between">
          <div>
            <h2 className='text-[#00717D] font-semibold text-base mb-3'>Our Insights</h2>
            <p className='text-[36px] text-[#181D27] font-semibold mb-5'>Curated by Omora just for you</p>
            <p className='text-[20px] font-normal mb-24'>Smart crypto insights curated by us, simplified for clarity and confident decisions</p>
          </div>
          <Button className='bg-[#008B99] hover:bg-[#008B99] px-[18px] py-3 rounded-[8px]'>View all posts</Button>
        </div>
        
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {insights.map((insight, index) => (
                <div className='flex flex-col justify-between min-h-[132px]' key={index}>
                    <Image className='rounded-2xl' src={insight.img} alt={insight.tag} width={384} height={256}/>
                    <span className='text-[#00717D] font-semibold text-base mt-4 mb-2 block'>{insight.tag}</span>
                    <div className='flex items-center justify-between mb-1'>
                        <h3 className='text-[#181D27] text-[18px] font-semibold'>{insight.title}</h3>
                        <Image src="/assets/images/website/arrow-up-right.svg" alt='forward' width={24} height={24}/>
                    </div>
                    <p className='text-[#535862] text-base font-normal mb-5'>{insight.description}</p>
                    <div className='flex items-center gap-2 mt-5'>
                        <Image src={insight.userImg} alt={insight.tag} width={40} height={40} />
                        <div>
                            <span className='block text-[#181D27] text-sm font-semibold'>{insight.name}</span>
                            <span className='block text-[#535862] text-sm font-normal'>{insight.date}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </section>
  )
}
