import "./globals.css";
import AuthProvider from "@/components/SessionProvider";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { Inter } from "next/font/google";
import NavBar from "@/components/website/NavBar";
import Footer from "@/components/website/Footer";
import CookiesPopUp from "@/components/website/CookiesPopUp";

const inter = Inter({
  style: "normal",
  subsets: ["greek", "latin"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={`${inter.className} relative`}>
        <NavBar />
        <AuthProvider session={session}>{children}</AuthProvider>
        <CookiesPopUp />
        <Footer />
      </body>
    </html>
  );
}
