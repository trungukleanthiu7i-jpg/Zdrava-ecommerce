import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const { loginUser } = useContext(UserContext);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    if (!token) {
      navigate("/auth");
      return;
    }

    // 1️⃣ Save token
    localStorage.setItem("token", token);

    // 2️⃣ Fetch user using token
    axios
      .get(`${API}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // 3️⃣ Save user in context
        loginUser(res.data);

        // 4️⃣ Redirect based on role
        if (res.data.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/auth");
      });
  }, [navigate, loginUser]);

  return <p style={{ textAlign: "center", marginTop: 50 }}>Logging you in…</p>;
}
