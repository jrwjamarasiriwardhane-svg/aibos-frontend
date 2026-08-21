import Navbar from "../components/layout/Navbar";
import Hero from "../components/common/Hero";
import RoleCards from "../components/common/RoleCard";
import Features from "../components/common/Features";
import Stats from "../components/common/Stats";
import Cta from "../components/common/Cta";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <RoleCards />
      <Features />
      <Stats />
      <Cta />
    </>
  );
}