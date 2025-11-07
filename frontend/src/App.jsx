import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DriverDashboard from "./pages/DriverDashboard";
import BusinessDashboard from "./pages/BusinessDashboard";
import ProtectedRoute from "./utils/ProtectedRoute";
import RegisterDriver from "./pages/RegisterDriver";
import RegisterAgency from "./pages/RegisterAgency";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
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
