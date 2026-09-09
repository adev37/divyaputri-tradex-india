export default function Hero() {
  return (
    <section className="hero-section">
      <div className="wrap hero-grid">
        <div>
          <span className="scale-tag mono">10⁻⁹ M · NANO SCALE ENGINEERING</span>
          <h1>
            Nano technology, engineered into everyday products.
          </h1>
          <p className="lede">
            Divyaputri Tradex LLP applies nano-scale material science across
            electronics, consumer goods, medical equipment, sports
            equipment, railway components, and beyond — turning lab-grade
            technology into products people use every day.
          </p>
          <div className="hero-ctas">
            <a href="#contact" className="btn-primary">
              Talk to us
            </a>
            <a href="#products" className="btn-secondary">
              View products
            </a>
          </div>
        </div>

        <div>
          <svg
            className="diagram"
            viewBox="0 0 420 340"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.5"
              y="0.5"
              width="419"
              height="339"
              fill="none"
              stroke="#D7DEDC"
            />

            {/* zoom rings representing scale from macro to nano */}
            <circle cx="150" cy="130" r="110" fill="none" stroke="#D7DEDC" strokeWidth="1" />
            <circle cx="150" cy="130" r="78" fill="none" stroke="#D7DEDC" strokeWidth="1" />
            <circle cx="150" cy="130" r="48" fill="none" stroke="#0E7C7B" strokeWidth="1.4" />
            <circle cx="150" cy="130" r="22" fill="none" stroke="#0E7C7B" strokeWidth="1.4" />
            <circle cx="150" cy="130" r="4" fill="#0E7C7B" />

            <text x="150" y="30" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="9" fill="#57666B">
              1 m
            </text>
            <text x="150" y="60" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="9" fill="#57666B">
              1 mm
            </text>
            <text x="150" y="90" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="9" fill="#0E7C7B">
              1 μm
            </text>
            <text x="150" y="118" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="8" fill="#0E7C7B">
              1 nm
            </text>

            {/* connecting lines out to product categories */}
            <line x1="228" y1="90" x2="330" y2="50" stroke="#57666B" strokeWidth="1" />
            <line x1="238" y1="130" x2="345" y2="130" stroke="#57666B" strokeWidth="1" />
            <line x1="228" y1="170" x2="330" y2="210" stroke="#57666B" strokeWidth="1" />
            <line x1="180" y1="200" x2="230" y2="290" stroke="#57666B" strokeWidth="1" />

            <text x="335" y="46" fontFamily="IBM Plex Sans" fontSize="11" fill="#12181B">Electronics</text>
            <text x="350" y="134" fontFamily="IBM Plex Sans" fontSize="11" fill="#12181B">Medical</text>
            <text x="335" y="214" fontFamily="IBM Plex Sans" fontSize="11" fill="#12181B">Railway</text>
            <text x="200" y="305" fontFamily="IBM Plex Sans" fontSize="11" fill="#12181B">Sports</text>

            <circle cx="330" cy="43" r="2.5" fill="#5B4B8A" />
            <circle cx="345" cy="130" r="2.5" fill="#5B4B8A" />
            <circle cx="330" cy="207" r="2.5" fill="#5B4B8A" />
            <circle cx="230" cy="286" r="2.5" fill="#5B4B8A" />
          </svg>
          <div className="diagram-caption">
            One scale of technology, applied across product categories.
          </div>
        </div>
      </div>
    </section>
  );
}
