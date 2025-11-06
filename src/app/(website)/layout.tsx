import Footer from "@/components/website/Footer";
import NavBar from "@/components/website/NavBar";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar />
      {children}
      <Footer />
    </>
  );
}
