const stats = [
  { label: "Core focus", value: "Nano Technology" },
  { label: "Product categories", value: "6+" },
  { label: "Key sectors", value: "Electronics, Medical, Rail" },
  { label: "Structure", value: "LLP" },
];

export default function About() {
  return (
    <section id="about" className="block">
      <div className="wrap about-grid">
        <div>
          <div className="section-tag mono">ABOUT</div>
          <h2 style={{ marginBottom: 18, fontSize: "clamp(24px,3vw,30px)" }}>
            Divyaputri Tradex LLP
          </h2>
          <p>
            Divyaputri Tradex LLP works at the nano scale to engineer
            material properties that carry across very different products —
            from electronics and consumer goods to medical equipment, sports
            gear, and railway components.
          </p>
          <p>
            Rather than building separate solutions for each industry, we
            develop one underlying nano-technology platform and adapt it to
            the performance requirements of each product category.
          </p>
        </div>

        <div className="stat-list">
          {stats.map((stat) => (
            <div className="stat" key={stat.label}>
              <span className="label">{stat.label}</span>
              <span className="value">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
