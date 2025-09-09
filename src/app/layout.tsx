import './globals.css'
import AuthProvider from "@/components/SessionProvider"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOptions"
// import Navbar from '@/components/Navbar'
import Navbar from '@/components/website/NavBar'
import Footer from '@/components/website/Footer'
import CookiesPopUp from '@/components/website/CookiesPopUp'
import NavBar from '@/components/website/NavBar'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans relative" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <AuthProvider session={session}>
          <NavBar/>
          {children}
        <CookiesPopUp />
        <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
