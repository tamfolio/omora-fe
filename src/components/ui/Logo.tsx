import Image from "next/image"

interface LogoProps {
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

export default function Logo({ 
  width = 150, 
  height = 40, 
  className = "object-contain",
  priority = false 
}: LogoProps) {
  return (
    <Image 
      src="/assets/images/logo/omora-logo.png" 
      alt="OMORA Logo" 
      width={width} 
      height={height}
      priority={priority}
      className={className}
    />
  )
}