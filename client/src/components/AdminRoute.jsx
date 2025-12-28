import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const AdminRoute = ({ children }) => {
  const { user } = useContext(UserContext);

  // ⏳ Still loading context
  if (user === undefined) return null;

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // ❌ Logged in but not admin
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // ✅ Admin allowed
  return children;
};

export default AdminRoute;
