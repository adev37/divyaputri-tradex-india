import { useState } from "react";
import { api } from "../api.js";

export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [verify, setVerify] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", code: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setError(""); setMessage(""); setBusy(true);
    try {
      if (verify) {
        await api("/auth/verify", { method: "POST", body: JSON.stringify({ email: form.email, code: form.code }) });
        setMessage("Email verified. Please sign in."); setVerify(false); setMode("login");
      } else if (mode === "signup") {
        await api("/auth/signup", { method: "POST", body: JSON.stringify(form) });
        setVerify(true); setMessage("Verification code sent. Check your email.");
      } else {
        const data = await api("/auth/login", { method: "POST", body: JSON.stringify({ email: form.email, password: form.password }) });
        localStorage.setItem("token", data.token); localStorage.setItem("user", JSON.stringify(data.user)); onLogin(data.user);
      }
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  };

  return <div className="auth-screen"><div className="auth-card">
    <div className="auth-brand"><div className="brand-mark">D</div><div><strong>DIVYAPUTRI TRADEX LLP</strong><span>Secure access</span></div></div>
    {!verify && <div className="auth-tabs"><button className={mode === "login" ? "active" : ""} onClick={() => {setMode("login");setError("")}}>Sign in</button><button className={mode === "signup" ? "active" : ""} onClick={() => {setMode("signup");setError("")}}>Sign up</button></div>}
    <h1>{verify ? "Verify your email" : mode === "login" ? "Welcome back" : "Create your account"}</h1>
    <p className="auth-muted">{verify ? "Enter the 6-digit code sent to your email address." : "You must sign in before accessing the website."}</p>
    <form onSubmit={submit}>
      {!verify && mode === "signup" && <input required placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>} 
      <input required type="email" placeholder="Email address" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
      {verify ? <input required inputMode="numeric" maxLength="6" placeholder="6-digit code" value={form.code} onChange={e=>setForm({...form,code:e.target.value.replace(/\D/g,"")})}/> : <input required minLength="8" type="password" placeholder="Password (minimum 8 characters)" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>} 
      {error && <div className="auth-error">{error}</div>}{message && <div className="auth-success">{message}</div>}
      <button className="btn-primary auth-submit" disabled={busy}>{busy ? "Please wait…" : verify ? "Verify email" : mode === "login" ? "Sign in" : "Create account"}</button>
    </form>
    {verify && <button className="auth-link" onClick={()=>{setVerify(false);setMode("signup")}}>← Back to sign up</button>}
    <a className="admin-entry" href="/admin">Admin sign in</a>
  </div></div>;
}
