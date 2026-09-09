import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "#products", label: "Products" },
    { href: "#advantage", label: "Nano Advantage" },
    { href: "#about", label: "About" },
  ];

  return (
    <header>
      <div className="wrap nav">
        <div className="brand">
          <div className="brand-mark">D</div>
          <div>
            <div className="brand-name">DIVYAPUTRI TRADEX LLP</div>
            <div className="brand-sub">Nano Technology · Products</div>
          </div>
        </div>

        <button
          className="menu-toggle"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label="Toggle navigation menu"
        >
          {open ? "Close" : "Menu"}
        </button>

        <nav className={`nav-links ${open ? "open" : ""}`}>
          <ul>
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={() => setOpen(false)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a href="#contact" className="nav-cta">
          Get in touch
        </a>
      </div>
    </header>
  );
}
