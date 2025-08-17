import NavBar from "@/components/website/NavBar"
import AboutUsHero from "@/components/about-us/AboutUsHero"
import OurValues from "@/components/about-us/OurValues"
import OurStory from "@/components/about-us/OurStory"
import MeetOurTeam from "@/components/about-us/MeetOurTeam"
import NewsLetter from "@/components/website/homepage/NewsLetter"
import Footer from "@/components/website/Footer"

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <AboutUsHero />
      <OurValues />
      <OurStory />
      <MeetOurTeam />
      <NewsLetter />
      <Footer />
    </div>
  )
}