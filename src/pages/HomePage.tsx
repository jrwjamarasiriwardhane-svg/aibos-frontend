import Navbar from "../components/layout/Navbar";
import Hero from "../components/common/Hero";
import RoleCards from "../components/common/RoleCard";
import Features from "../components/common/Features";
import Stats from "../components/common/Stats";
import Cta from "../components/common/Cta";
import Footer from "../components/layout/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <RoleCards />
        <Features />
        <Stats />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}