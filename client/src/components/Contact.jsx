import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;
const initialForm = { name: "", email: "", company: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: "loading", message: "" });

    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setStatus({
        state: "success",
        message: "Thanks — we've received your message and will get back to you soon.",
      });
      setForm(initialForm);
    } catch (err) {
      setStatus({ state: "error", message: err.message });
    }
  };

  return (
    <section id="contact" className="block">
      <div className="wrap contact-grid">
        <div>
          <div className="section-tag mono">GET IN TOUCH</div>
          <h2 style={{ marginBottom: 18, fontSize: "clamp(24px,3vw,30px)" }}>
            Talk to Divyaputri Tradex LLP
          </h2>
          <p>
            Interested in applying our nano-technology to your product line?
            Send us a note and we'll get back to you.
          </p>

          <div className="contact-details">
            <div className="row">
              <span>Company</span>
              <span>Divyaputri Tradex LLP</span>
            </div>
            <div className="row">
              <span>Focus area</span>
              <span>Nano Technology Products</span>
            </div>
            <div className="row">
              <span>Email</span>
              <span>divyaputritradex@gmail.com</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="company">Company (optional)</label>
            <input
              id="company"
              name="company"
              type="text"
              value={form.company}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              value={form.message}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={status.state === "loading"}
          >
            {status.state === "loading" ? "Sending..." : "Send message"}
          </button>

          {status.state === "success" && (
            <p className="form-status success">{status.message}</p>
          )}
          {status.state === "error" && (
            <p className="form-status error">{status.message}</p>
          )}
        </form>
      </div>
    </section>
  );
}
