import Hero from '../components/home/Hero';
import Products from '../components/home/Products';
import NanoAdvantage from '../components/home/NanoAdvantage';
import About from '../components/home/About';
import Contact from '../components/home/Contact';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Products />
      <NanoAdvantage />
      <About />
      <Contact />
    </>
  );
}