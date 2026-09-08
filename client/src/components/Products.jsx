const categories = [
  {
    title: "Electronics",
    text: "Nano-coated components and materials for improved conductivity, durability and thermal performance.",
  },
  {
    title: "Consumer Goods",
    text: "Everyday products upgraded with nano-scale surface treatments for durability, hygiene and finish.",
  },
  {
    title: "Medical Equipment",
    text: "Biocompatible nano-materials for equipment surfaces, coatings and precision components.",
  },
  {
    title: "Sports Equipment",
    text: "Lightweight, high-strength nano-composite materials engineered for performance gear.",
  },
  {
    title: "Railway Components",
    text: "Wear-resistant and corrosion-resistant nano-engineered materials for rail infrastructure parts.",
  },
  {
    title: "And More",
    text: "Our nano-technology platform extends into new product categories as applications emerge.",
  },
];

export default function Products() {
  return (
    <section id="products" className="block">
      <div className="wrap">
        <div className="section-head">
          <div className="section-tag mono">PRODUCTS</div>
          <h2>One technology platform, many industries</h2>
          <p>
            The same core nano-technology is engineered into products across
            these categories, each adapted to its industry's specific
            performance needs.
          </p>
        </div>

        <div className="products-grid">
          {categories.map((cat) => (
            <div className="product-card" key={cat.title}>
              <svg className="product-icon" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="15" stroke="#0E7C7B" strokeWidth="1.3" />
                <circle cx="20" cy="20" r="7" stroke="#0E7C7B" strokeWidth="1.3" />
                <circle cx="20" cy="20" r="1.6" fill="#5B4B8A" />
              </svg>
              <h3>{cat.title}</h3>
              <p>{cat.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
