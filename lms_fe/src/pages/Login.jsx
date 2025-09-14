import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../pages/styles/Login.css";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login } = useAuth(); // get login method from context

  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/auth/login", formData);

      const token = response.data.token;
      login(token); // store token + update context

      // role-based redirect
      const decoded = JSON.parse(atob(token.split(".")[1])); // decode payload quickly
      if (decoded.role === "Student") navigate("/student/dashboard");
      else if (decoded.role === "Teacher") navigate("/teacher/dashboard");
      else if (decoded.role === "Admin") navigate("/admin/dashboard");
      else navigate("/");

      alert(t("login.success"));
    } catch (error) {
      console.error("Login error:", error);
      const errorMsg =
        error.response?.data?.error || error.message;
      alert(t("login.failed") + ": " + errorMsg);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>{t("login.title")}</h2>
        <input
          type="email"
          name="email"
          placeholder={t("login.emailPlaceholder")}
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder={t("login.passwordPlaceholder")}
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn-login">
          {t("login.submitBtn")}
        </button>
      </form>
    </div>
  );
}

export default Login;
