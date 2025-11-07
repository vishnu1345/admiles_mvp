import React from 'react'
import { api } from '../utils/api';
function BusinessDashboard() {
  return (
    <>
      <div>BusinessDashboard</div>
      <button
        onClick={() =>
          api.get("/auth/logout").then(() => (window.location.href = "/"))
        }
      >
        Logout
      </button>
    </>
  );
}

export default BusinessDashboard