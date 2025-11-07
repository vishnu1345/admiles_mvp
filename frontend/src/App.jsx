import { useEffect } from "react";
import { api } from "./utils/api";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DriverDashboard from "./pages/DriverDashboard";
import BusinessDashboard from "./pages/BusinessDashboard";
import RegisterDriver from "./pages/RegisterDriver";
import RegisterAgency from "./pages/RegisterAgency";
import ProtectedRoute from "./utils/ProtectedRoute";

function AutoRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/auth/me");
        if (data) {
          const redirect = data.completed
            ? `/${data.role}-dashboard`
            : `/register/${data.role}`;
          navigate(redirect);
        }
      } catch {
        // not logged in, stay on landing
      }
    })();
  }, [navigate]);

  return <LandingPage />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AutoRedirect />} />
        <Route
          path="/driver-dashboard"
          element={
            <ProtectedRoute allowedRole="driver">
              <DriverDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/business-dashboard"
          element={
            <ProtectedRoute allowedRole="business">
              <BusinessDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/register/driver" element={<RegisterDriver />} />
        <Route path="/register/business" element={<RegisterAgency />} />
      </Routes>
    </BrowserRouter>
  );
}
