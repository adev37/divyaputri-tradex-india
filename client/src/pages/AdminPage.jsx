import { useEffect, useState } from "react";
import { api } from "../api.js";

export default function AdminPage({ onLogout }) {
  const [contacts, setContacts] = useState([]); const [users, setUsers] = useState([]); const [error, setError] = useState("");
  useEffect(() => { Promise.all([api("/admin/contacts"), api("/admin/users")]).then(([c,u])=>{setContacts(c);setUsers(u)}).catch(e=>setError(e.message)); }, []);
  return <div className="admin-screen"><div className="admin-wrap"><header className="admin-header"><div><div className="brand-name">DIVYAPUTRI TRADEX LLP</div><h1>Admin Dashboard</h1></div><button className="btn-secondary" onClick={onLogout}>Logout</button></header>
    {error && <div className="auth-error">{error}</div>}
    <div className="admin-grid"><section className="admin-panel"><h2>Registered users ({users.length})</h2>{users.length===0?<p>No users yet.</p>:<div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Verified</th><th>Joined</th></tr></thead><tbody>{users.map(u=><tr key={u._id}><td>{u.name}</td><td>{u.email}</td><td>{u.isVerified?"Yes":"No"}</td><td>{new Date(u.createdAt).toLocaleDateString()}</td></tr>)}</tbody></table></div>}</section>
    <section className="admin-panel"><h2>Contact enquiries ({contacts.length})</h2>{contacts.length===0?<p>No enquiries yet.</p>:<div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Company</th><th>Message</th></tr></thead><tbody>{contacts.map(c=><tr key={c._id}><td>{c.name}</td><td>{c.email}</td><td>{c.company||"—"}</td><td>{c.message}</td></tr>)}</tbody></table></div>}</section></div>
  </div></div>;
}
