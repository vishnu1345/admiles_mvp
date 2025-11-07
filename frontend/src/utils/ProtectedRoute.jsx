import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { api } from "./api";

export default function ProtectedRoute({ allowedRole, children }) {
  const [state, setState] = useState({ loading: true, ok: false });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/auth/me");
        if (data && data.role === allowedRole)
          setState({ loading: false, ok: true });
        else setState({ loading: false, ok: false });
      } catch {
        setState({ loading: false, ok: false });
      }
    })();
  }, [allowedRole]);

  if (state.loading) return null; // show spinner if you want
  if (!state.ok) return <Navigate to="/" />;
  return children;
}
