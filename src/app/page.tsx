import '@/styles/globals.css'
import React from 'react'
import { signIn } from "next-auth/react"

const page = () => {
  return (
    <div>yo!

<button onClick={() => signIn()}>
  Login
</button>

    </div>

    


  )
}

export default page