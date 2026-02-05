import './globals.css'
import AuthProvider from "@/components/SessionProvider"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import CookiesPopUp from '@/components/website/CookiesPopUp'

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
          {children}
          <CookiesPopUp />
        </AuthProvider>
      </body>
    </html>
  );
}