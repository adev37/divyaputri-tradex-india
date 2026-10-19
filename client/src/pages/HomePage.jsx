import Hero from '../components/home/Hero';
import Products from '../components/home/Products';
import NanoAdvantage from '../components/home/NanoAdvantage';
import AIDocumentReader from '../components/ai/AIDocumentReader';
import AIMarketAnalyzer from '../components/ai/AIMarketAnalyzer';
import About from '../components/home/About';
import Contact from '../components/home/Contact';
import AIVisionRecommendation from '../components/ai/AIVisionRecommendation';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Products />
      <NanoAdvantage />

      {/* ✅ AI TOOLS SECTION (About se pehle) */}
      <section className="section" id="ai-tools" style={{ background: 'var(--bg-soft)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <span className="products__eyebrow" style={{ marginBottom: '1rem', display: 'inline-block' }}>
              AI POWERED TOOLS
            </span>
            <h2 className="products__title">Instant Document Analysis</h2>
            <p className="products__subtitle">
              Upload your technical documents, and our AI will extract key insights instantly.
            </p>
          </div>
          
          <AIDocumentReader />
          <AIVisionRecommendation />
          
          <div style={{ marginTop: '4rem' }}>
            <AIMarketAnalyzer />
          </div>
        </div>
      </section>

      <About />
      <Contact />
    </>
  );
}