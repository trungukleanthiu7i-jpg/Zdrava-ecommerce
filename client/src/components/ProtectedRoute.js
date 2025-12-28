import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  // or "user" if you store user instead

  if (!isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

export default ProtectedRoute;
