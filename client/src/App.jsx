import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Products from "./components/Products.jsx";
import NanoAdvantage from "./components/NanoAdvantage.jsx";
import About from "./components/About.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <div className="App">
      <Header />
      <Hero />
      <Products />
      <NanoAdvantage />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}
