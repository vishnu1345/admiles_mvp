import React from 'react'
import { api } from '../utils/api';
function DriverDashboard() {
  return (
    <>
      <div>DriverDashboard</div>
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

export default DriverDashboard