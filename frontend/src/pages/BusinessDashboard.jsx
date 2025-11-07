import React, { useEffect, useState } from "react";
import { api } from "../utils/api";
import CreateCampaignModal from "../components/CreateCampaginModal";
import "./BusinessDashboard.css"

export default function BusinessDashboard() {
  const [campaigns, setCampaigns] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const loadCampaigns = async () => {
    const { data } = await api.get("/api/campaigns");
    setCampaigns(data);
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const logout = async () => {
    await api.get("/auth/logout");
    window.location.href = "/";
  };

  return (
    <div className="dashboard">
      <div className="navbar">
        <h2>🏢 AdMiles Agency</h2>
        <div>
          <span>Welcome back,</span>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="tabs">
        <button className="active">My Campaigns</button>
        <button>Active Drivers</button>
        <button>Analytics</button>
      </div>

      <section className="campaign-section">
        <div className="header">
          <h3>Campaign Management</h3>
          <button onClick={() => setShowModal(true)}>+ Create Campaign</button>
        </div>

        <div className="campaign-grid">
          {campaigns.length === 0 ? (
            <p>No campaigns yet.</p>
          ) : (
            campaigns.map((c) => (
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
            ))
          )}
        </div>
      </section>

      {showModal && (
        <CreateCampaignModal
          onClose={() => setShowModal(false)}
          onCreated={loadCampaigns}
        />
      )}
    </div>
  );
}
