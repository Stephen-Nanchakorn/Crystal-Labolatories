import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Plugins from "./components/Plugins";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="bg-black text-white">
      <Navbar />
      <Hero />
      <Plugins />
      <Footer />
    </main>
  );
}