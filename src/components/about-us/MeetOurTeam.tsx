"use client";

import Image from "next/image";

export default function MeetOurTeam() {
  const teamMembers = [
    {
      name: "Alisa Hester",
      role: "Founder & CEO",
      description:
        "Former co-founder of Opendoor. Early staff at Spotify and Clearbit.",
      image: "/assets/images/team/alisa-hester.jpg",
      social: {
        twitter: "#",
        linkedin: "#",
        dribbble: "#",
      },
    },
    {
      name: "Rich Wilson",
      role: "Engineering Manager",
      description: "Lead engineering teams at Figma, Pitch, and Protocol Labs.",
      image: "/assets/images/team/rich-wilson.jpg",
      social: {
        twitter: "#",
        linkedin: "#",
        dribbble: "#",
      },
    },
    {
      name: "Annie Stanley",
      role: "Product Manager",
      description: "Former PM for Airtable, Medium, Ghost, and Lumi.",
      image: "/assets/images/team/annie-stanley.jpg",
      social: {
        twitter: "#",
        linkedin: "#",
        dribbble: "#",
      },
    },
    {
      name: "Johnny Bell",
      role: "Frontend Developer",
      description: "Former frontend dev for Linear, Coinbase, and Postscript.",
      image: "/assets/images/team/johnny-bell.jpg",
      social: {
        twitter: "#",
        linkedin: "#",
        dribbble: "#",
      },
    },
    {
      name: "Mia Ward",
      role: "Backend Developer",
      description: "Lead backend dev at Clearbit. Former Clearbit and Loom.",
      image: "/assets/images/team/mia-ward.jpg",
      social: {
        twitter: "#",
        linkedin: "#",
        dribbble: "#",
      },
    },
    {
      name: "Archie Young",
      role: "Product Designer",
      description:
        "Founding design team at Figma. Former Pinterst, Dribbble and Tic.",
      image: "/assets/images/team/archie-young.jpg",
      social: {
        twitter: "#",
        linkedin: "#",
        dribbble: "#",
      },
    },
  ];

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (!img.dataset.fallbackUsed) {
      img.dataset.fallbackUsed = "true";
      img.src = "/assets/images/placeholder-avatar.jpg";
    }
  };

  return (
    <section className="bg-gray-50 py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            Meet our team
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our philosophy is simple — hire a team of diverse, passionate people
            and foster a culture that empowers you to do your best work.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <div key={member.name} className="group">
              <div className="relative overflow-hidden rounded-xl aspect-square mb-6">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={handleImageError}
                />
                {/* gradient & social links */}
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-teal-600 font-medium mb-2">{member.role}</p>
                <p className="text-sm text-gray-600">{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
