import Image from "next/image"

interface LogoProps {
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

export default function Icon({ 
  width = 50, 
  height = 50, 
  className = "object-contain",
  priority = false 
}: LogoProps) {
  return (
    <Image 
      src="/assets/images/logo/omora-icon.png" 
      alt="OMORA Logo" 
      width={width} 
      height={height}
      priority={priority}
      className={className}
    />
  )
}