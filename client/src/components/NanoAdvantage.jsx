const items = [
  {
    id: "01",
    title: "Higher strength-to-weight",
    text: "Nano-structured materials add strength without adding bulk.",
  },
  {
    id: "02",
    title: "Improved durability",
    text: "Surface treatments resist wear, corrosion and degradation over time.",
  },
  {
    id: "03",
    title: "Cross-industry reuse",
    text: "One material platform adapts across electronics, medical, sports and rail.",
  },
  {
    id: "04",
    title: "Performance at scale",
    text: "Nano-scale engineering translates into measurable gains in the finished product.",
  },
];

export default function NanoAdvantage() {
  return (
    <section id="advantage" className="block advantage">
      <div className="wrap">
        <div className="section-head">
          <div className="section-tag mono" style={{ color: "#4FD3C4" }}>
            WHY NANO
          </div>
          <h2>Small scale, wide application</h2>
          <p>
            Working at the nanometer scale gives our products properties
            that aren't possible with conventional materials alone.
          </p>
        </div>

        <div className="adv-grid">
          {items.map((item) => (
            <div className="adv-item" key={item.id}>
              <div className="num mono">{item.id}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
