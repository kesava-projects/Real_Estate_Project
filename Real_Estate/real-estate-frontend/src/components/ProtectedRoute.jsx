import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children, roles }) {
  const location = useLocation();
  const token = localStorage.getItem("access");
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles?.length && user?.role && !roles.includes(user.role)) {
    return <Navigate to="/properties" replace />;
  }

  return children;
}

export default ProtectedRoute;
