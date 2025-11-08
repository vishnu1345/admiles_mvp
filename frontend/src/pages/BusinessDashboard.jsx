import React, { useEffect, useState } from "react";
import { api } from "../utils/api";
import CreateCampaignModal from "../components/CreateCampaginModal";
import "./BusinessDashboard.css"

export default function BusinessDashboard() {
  const [tab, setTab] = useState("campaigns");
  const [campaigns, setCampaigns] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const loadCampaigns = async () => {
    const { data } = await api.get("/api/campaigns");
    setCampaigns(data);
  };

  const loadApplications = async () => {
    const { data } = await api.get("/api/applications/business/all");
    setApplications(data);
  };

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
      <header className="navbar">
        <h2>🏢 AdMiles Agency</h2>
        <div>
          <span>Welcome back,</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

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
          Active Drivers
        </button>
        <button disabled>Analytics</button>
      </div>

      {tab === "campaigns" && (
        <section className="campaign-section">
          <div className="header">
            <h3>Campaign Management</h3>
            <button onClick={() => setShowModal(true)}>
              + Create Campaign
            </button>
          </div>

          <div className="campaign-grid">
            {campaigns.map((c) => (
              <div key={c._id} className="campaign-card">
                {c.imageUrl ? (
                  <img src={c.imageUrl} alt={c.title} />
                ) : (
                  <div className="placeholder">No Image</div>
                )}
                <div className="info">
                  <h4>{c.title}</h4>
                  <p>{c.category}</p>
                  <p>{c.description}</p>
                  <p>📍 {c.location}</p>
                  <p>🕓 {c.duration}</p>
                  <p>💸 ₹{c.earningPerKm}/km</p>
                  <span className={`status ${c.status}`}>{c.status}</span>
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

      {tab === "drivers" && (
        <section className="drivers-section">
          <h3>Active Drivers & Applications</h3>
          {applications.length === 0 ? (
            <p>No applications yet.</p>
          ) : (
            <div className="application-list">
              {applications.map((a) => (
                <div key={a._id} className="application-card">
                  <h4>{a.driver?.name}</h4>
                  <p>{a.driver?.email}</p>
                  <p>Campaign: {a.campaign?.title}</p>
                  <p>
                    {a.status === "pending"
                      ? "⏳ Pending Approval"
                      : "✅ Active"}
                  </p>
                  {a.status === "pending" && (
                    <button
                      className="approve-btn"
                      onClick={() => approveDriver(a._id)}
                    >
                      Approve
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
