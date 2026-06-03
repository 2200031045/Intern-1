import React, { useState } from "react";
import "./App.css";

const API = "http://localhost:5000/api";

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("landing");
  const [email, setEmail] = useState("user@test.com");
  const [password, setPassword] = useState("user123");
  const [application, setApplication] = useState(null);
  const [codes, setCodes] = useState([]);
  const [adminApps, setAdminApps] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [toast, setToast] = useState("");
  const [rejectReason, setRejectReason] = useState({});
  const [form, setForm] = useState({
    partnerType: "",
    businessName: "",
    phone: "",
    socialLink: "",
    audienceSize: "",
    description: "",
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const login = async () => {
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) return alert("Invalid Login");

      const data = await res.json();
      setUser(data);

      if (data.role === "admin") {
        setView("admin");
        loadAdmin();
      } else {
        loadPartner(data);
      }
    } catch {
      alert("Backend is not running. Start backend on port 5000.");
    }
  };

  const loadPartner = async (loggedUser = user) => {
    const res = await fetch(`${API}/partner/${loggedUser.id}`);
    const data = await res.json();

    setApplication(data.application);
    setCodes(data.codes);

    if (!data.application) setView("form");
    else if (data.application.status === "pending") setView("pending");
    else if (data.application.status === "rejected") setView("rejected");
    else if (data.application.status === "approved") setView("dashboard");
  };

  const submitApplication = async () => {
    const res = await fetch(`${API}/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        name: user.name,
        email: user.email,
        ...form,
      }),
    });

    if (!res.ok) return alert("Application failed");

    const data = await res.json();
    setApplication(data);
    setView("pending");
    showToast("Application submitted successfully");
  };

  const loadAdmin = async () => {
    const res = await fetch(`${API}/admin/applications`);
    const data = await res.json();
    setAdminApps(data);
  };

  const approve = async (id) => {
    await fetch(`${API}/admin/approve/${id}`, { method: "POST" });
    showToast("Application approved and discount code created");
    loadAdmin();
  };

  const reject = async (id) => {
    const reason = rejectReason[id];

    if (!reason) return;

    await fetch(`${API}/admin/reject/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });

    showToast("Application rejected");
    loadAdmin();
  };

  const toggleCode = async (id) => {
    await fetch(`${API}/admin/code-toggle/${id}`, { method: "POST" });
    showToast("Code status updated");
    loadAdmin();
  };

  const logout = () => {
    setUser(null);
    setApplication(null);
    setCodes([]);
    setView("landing");
  };

  const counts = {
    pending: adminApps.filter((a) => a.status === "pending").length,
    approved: adminApps.filter((a) => a.status === "approved").length,
    rejected: adminApps.filter((a) => a.status === "rejected").length,
    all: adminApps.length,
  };

  const filteredApps =
    filter === "all" ? adminApps : adminApps.filter((a) => a.status === filter);

  return (
    <div className="app">
      {toast && <div className="toast">{toast}</div>}

      <nav>
        <h2>Haett Partner Program</h2>
        {user && <button onClick={logout}>Logout</button>}
      </nav>

      {view === "landing" && (
        <section className="hero card">
          <h1>Grow with Haett</h1>
          <p>
            Join our affiliate programme and earn by sharing discount codes with
            your audience, gym members, customers, or community.
          </p>

          <div className="loginBox">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />

            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
            />

            <button onClick={login}>Login to Apply</button>
          </div>

          <p className="small">
            Admin: admin@test.com / admin123 | User: user@test.com / user123
          </p>
        </section>
      )}

      {view === "form" && (
        <section className="card">
          <h1>Partner Application</h1>

          <select
            value={form.partnerType}
            onChange={(e) =>
              setForm({ ...form, partnerType: e.target.value })
            }
          >
            <option value="">Select Partner Type</option>
            <option>Affiliate</option>
            <option>Influencer</option>
            <option>Gym</option>
            <option>Corporate</option>
            <option>Partner Associate</option>
          </select>

          <input
            placeholder="Business / Brand Name *"
            value={form.businessName}
            onChange={(e) =>
              setForm({ ...form, businessName: e.target.value })
            }
          />

          <input
            placeholder="Contact Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <input
            placeholder="Website / Social Media Link"
            value={form.socialLink}
            onChange={(e) => setForm({ ...form, socialLink: e.target.value })}
          />

          <input
            placeholder="Estimated Audience Size"
            value={form.audienceSize}
            onChange={(e) =>
              setForm({ ...form, audienceSize: e.target.value })
            }
          />

          <textarea
            maxLength="500"
            placeholder="Short description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <button
            disabled={!form.partnerType || !form.businessName}
            onClick={submitApplication}
          >
            Submit Application
          </button>
        </section>
      )}

      {view === "pending" && (
        <section className="card status">
          <h1>Application Under Review</h1>
          <p>You applied on {application?.appliedAt}</p>
          <p>Our team will contact you within a few business days.</p>
        </section>
      )}

      {view === "rejected" && (
        <section className="card status rejected">
          <h1>Application Rejected</h1>
          <p>Reason: {application?.rejectionReason}</p>

          <button
            onClick={() => {
              setForm({
                partnerType: "",
                businessName: "",
                phone: "",
                socialLink: "",
                audienceSize: "",
                description: "",
              });
              setView("form");
            }}
          >
            Reapply
          </button>
        </section>
      )}

      {view === "dashboard" && (
        <section className="card">
          <h1>Partner Dashboard</h1>
          <p>
            {application.partnerType} | Approved on {application.approvedAt}
          </p>

          <div className="summary">
            <div>
              <h2>{codes.length}</h2>
              <p>Total Codes</p>
            </div>

            <div>
              <h2>{codes.reduce((a, c) => a + c.used, 0)}</h2>
              <p>Total Uses</p>
            </div>

            <div>
              <h2>
                ₹{codes.reduce((a, c) => a + c.totalDiscount, 0)}
              </h2>
              <p>Total Discount</p>
            </div>
          </div>

          {codes.length === 0 ? (
            <p>No discount codes assigned yet.</p>
          ) : (
            codes.map((code) => (
              <div className="codeCard" key={code.id}>
                <b>{code.code}</b>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(code.code);
                    showToast("Code copied");
                  }}
                >
                  Copy
                </button>

                <p>
                  {code.active ? "Active" : "Inactive"} | {code.discount} |
                  Used {code.used} times | Expiry: {code.expiry}
                </p>
              </div>
            ))
          )}
        </section>
      )}

      {view === "admin" && (
        <section className="card">
          <h1>Admin Review Panel</h1>

          <div className="tabs">
            {["pending", "approved", "rejected", "all"].map((t) => (
              <button key={t} onClick={() => setFilter(t)}>
                {t.toUpperCase()} ({counts[t]})
              </button>
            ))}
          </div>

          {filteredApps.length === 0 && <p>No applications found.</p>}

          {filteredApps.map((app) => (
            <div className="adminCard" key={app.id}>
              <h3>👤 {app.name}</h3>

              <p>
                <b>Email:</b> {app.email}
              </p>

              <p>
                <b>Partner Type:</b> {app.partnerType}
              </p>

              <p>
                <b>Business:</b> {app.businessName}
              </p>

              <p>
                <b>Social Link:</b> {app.socialLink || "N/A"}
              </p>

              <p>
                <b>Audience:</b> {app.audienceSize || "N/A"}
              </p>

              <p>
                <b>Description:</b> {app.description || "N/A"}
              </p>

              <p>
                <b>Status:</b>{" "}
                <span
                  style={{
                    color:
                      app.status === "approved"
                        ? "green"
                        : app.status === "rejected"
                        ? "red"
                        : "orange",
                    fontWeight: "bold",
                  }}
                >
                  {app.status.toUpperCase()}
                </span>
              </p>

              {app.status === "pending" && (
                <>
                  <button onClick={() => approve(app.id)}>
                    ✅ Approve
                  </button>

                  <input
                    placeholder="Enter rejection reason..."
                    value={rejectReason[app.id] || ""}
                    onChange={(e) =>
                      setRejectReason({
                        ...rejectReason,
                        [app.id]: e.target.value,
                      })
                    }
                  />

                  <button
                    disabled={!rejectReason[app.id]}
                    onClick={() => reject(app.id)}
                  >
                    ❌ Reject
                  </button>
                </>
              )}

              {app.status === "approved" && (
                <div className="codeCard">
                  <p>
                    <b>Partner approved.</b> Discount code is created
                    automatically after approval.
                  </p>
                </div>
              )}

              {app.status === "rejected" && (
                <div className="codeCard">
                  <p>
                    <b>Rejection Reason:</b>{" "}
                    {app.rejectionReason || "No reason provided"}
                  </p>
                </div>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

export default App;