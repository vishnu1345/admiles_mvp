import React, { useEffect, useState } from "react";
import { api } from "../utils/api";
import DriverCampaignCard from "../components/DriverCampaignCard";

export default function DriverDashboard() {
  const [tab, setTab] = useState("browse");
  const [campaigns, setCampaigns] = useState([]);
  const [applications, setApplications] = useState([]);
  const [user, setUser] = useState(null);

  const loadUser = async () => {
    const { data } = await api.get("/auth/me");
    setUser(data);
  };

  const loadCampaigns = async () => {
    const { data } = await api.get("/api/applications/browse");
    setCampaigns(data);
  };

  const loadApplications = async () => {
    const { data } = await api.get("/api/applications");
    setApplications(data);
  };

  const handleApply = async (id) => {
    try {
      await api.post(`/api/applications/${id}`);
      alert("Applied successfully!");
      loadApplications();
    } catch (err) {
      alert(err.response?.data?.message || "Error applying");
    }
  };

  const logout = async () => {
    await api.get("/auth/logout");
    window.location.href = "/";
  };

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (tab === "browse") loadCampaigns();
    else loadApplications();
  }, [tab]);

  return (
    <div className="dashboard">
      <header className="navbar">
        <div className="left">
          <h2>🚖 AdMiles Driver</h2>
          {user && (
            <p className="welcome">Welcome back, {user.name?.split(" ")[0]}</p>
          )}
        </div>
        <button onClick={logout}>Logout</button>
      </header>

      <div className="tabs">
        <button
          className={tab === "browse" ? "active" : ""}
          onClick={() => setTab("browse")}
        >
          Browse Ads
        </button>
        <button
          className={tab === "applications" ? "active" : ""}
          onClick={() => setTab("applications")}
        >
          My Applications
        </button>
        <button disabled>Earnings</button>
      </div>

      {tab === "browse" && (
        <section className="campaign-section">
          <div className="header">
            <h3>Available Ad Campaigns</h3>
            <span>{campaigns.length} Active Campaigns</span>
          </div>

          <div className="campaign-grid">
            {campaigns.map((c) => (
              <DriverCampaignCard
                key={c._id}
                campaign={c}
                onApply={handleApply}
              />
            ))}
          </div>
        </section>
      )}

      {tab === "applications" && (
        <section className="applications-section">
          <h3>My Applications</h3>
          {applications.length === 0 ? (
            <p>No applications yet.</p>
          ) : (
            <div className="application-list">
              {applications.map((a) => (
                <div key={a._id} className="application-card">
                  <h4>{a.campaign?.title}</h4>
                  <p>Applied: {a.appliedDate.split("T")[0]}</p>
                  {a.status === "approved" && a.campaign && (
                    <>
                      <p>
                        Started: {a.startedDate?.split("T")[0] || "Pending"}
                      </p>
                      {a.photoVerified && (
                        <span className="verified">✔ Photo Verified</span>
                      )}
                    </>
                  )}
                  <span className={`status ${a.status}`}>{a.status}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
