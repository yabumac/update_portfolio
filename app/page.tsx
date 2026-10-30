import Hero from "./components/Hero";
import Systems from "./components/Systems";
import Experience from "./components/Experience";
import Skills from "./components/Skills";
import Impact from "./components/Impact";
import Languages from "./components/Languages";
import References from "./components/References";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main id="top" className="flex-1">
      <Hero />
      <Systems />
      <Experience />
      <Skills />
      <Impact />
      <Languages />
      <References />
      <Contact />
      <Footer />
    </main>
  );
}
