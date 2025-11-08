import React, { useEffect, useState } from "react";
import { api } from "../utils/api";
import CreateCampaignModal from "../components/CreateCampaginModal";
import "./BusinessDashboard.css";

export default function BusinessDashboard() {
  const [tab, setTab] = useState("campaigns");
  const [showModal, setShowModal] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [applications, setApplications] = useState([]);
  const [user, setUser] = useState(null);

  const loadUser = async () => {
    const { data } = await api.get("/auth/me");
    setUser(data);
  };

  const loadCampaigns = async () => {
    const { data } = await api.get("/api/campaigns");
    setCampaigns(data);
  };

  const loadApplications = async () => {
    const { data } = await api.get("/api/applications/business/all");
    setApplications(data);
  };

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (tab === "campaigns") loadCampaigns();
    else if (tab === "drivers") loadApplications();
  }, [tab]);

  const approveDriver = async (id) => {
    try {
      await api.put(`/api/applications/approve/${id}`);
      alert("Driver approved successfully!");
      loadApplications();
    } catch (err) {
      alert(err.response?.data?.message || "Error approving driver");
    }
  };

  const logout = async () => {
    await api.get("/auth/logout");
    window.location.href = "/";
  };

  return (
    <div className="dashboard">
      {/* Top Navbar */}
      <header className="navbar">
        <div className="logo-section">
          <h2>🏢 AdMiles Agency</h2>
          {user && (
            <p className="welcome">Welcome back, {user.name?.split(" ")[0]}</p>
          )}
        </div>
        <button className="logout-btn" onClick={logout}>
          ⎋ Logout
        </button>
      </header>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={tab === "campaigns" ? "active" : ""}
          onClick={() => setTab("campaigns")}
        >
          My Campaigns
        </button>
        <button
          className={tab === "drivers" ? "active" : ""}
          onClick={() => setTab("drivers")}
        >
           Drivers
        </button>
        <button disabled>Analytics</button>
      </div>

      {/* === Campaign Section === */}
      {tab === "campaigns" && (
        <section className="campaign-section">
          <div className="header">
            <h3>Campaign Management</h3>
            <button className="primary-btn" onClick={() => setShowModal(true)}>
              + Create Campaign
            </button>
          </div>

          <div className="campaign-grid">
            {campaigns.map((c) => (
              <div className="campaign-card" key={c._id}>
                <img src={`http://localhost:4000${c.imageUrl}`} alt={c.title} />
                <h4>{c.title}</h4>
                <span className="category">{c.category}</span>
                <p className="desc">{c.description}</p>
                <div className="meta">
                  <p>📍 {c.location}</p>
                  <p>🕒 {c.duration} days</p>
                  <p className="price">₹{c.earningPerKm}/km</p>
                </div>
              </div>
            ))}
          </div>

          {showModal && (
            <CreateCampaignModal
              onClose={() => setShowModal(false)}
              onCreated={loadCampaigns}
            />
          )}
        </section>
      )}

      {/* === Active Drivers Section === */}
      {tab === "drivers" && (
        <section className="drivers-section">
          <h3>Drivers</h3>
          {applications.length === 0 ? (
            <p>No active drivers yet.</p>
          ) : (
            <div className="drivers-list">
              {applications.map((a) => (
                <div key={a._id} className="driver-card">
                  <div>
                    <h4>{a.driver?.name}</h4>
                    <p>Vehicle: {a.driver?.rickshawNumber}</p>
                    <p>Campaign: {a.campaign?.title}</p>
                  </div>
                  <div className="driver-status">
                    {a.status === "pending" ? (
                      <button
                        className="approve-btn"
                        onClick={() => approveDriver(a._id)}
                      >
                        Approve
                      </button>
                    ) : (
                      <span className="active-status">Active ✅</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
