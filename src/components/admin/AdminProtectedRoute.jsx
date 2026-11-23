
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";

const AdminProtectedRoute = ({ children }) => {
  const location = useLocation();
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let active = true;

    const verifyAdmin = async () => {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        if (active) {
          setStatus("unauthorized");
        }
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const user = response.data?.data;

        if (!active) return;

        if (response.data?.success && user?.role === "admin") {
          setStatus("authorized");
        } else {
          localStorage.removeItem("adminToken");
          setStatus("unauthorized");
        }
      } catch {
        if (!active) return;

        localStorage.removeItem("adminToken");
        setStatus("unauthorized");
      }
    };

    verifyAdmin();

    return () => {
      active = false;
    };
  }, []);

  if (status === "checking") {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <p className="text-muted">Verifying admin access...</p>
      </div>
    );
  }

  if (status === "unauthorized") {
    return (
      <Navigate
        to="/admin"
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
};

export default AdminProtectedRoute;
