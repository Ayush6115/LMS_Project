import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../pages/styles/Signup.css";
import { useTranslation } from "react-i18next";

function Signup() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/auth/register", formData);
      alert(response.data.message || t("signup.success"));
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);
      const errorMsg =
        error.response && error.response.data && error.response.data.error
          ? error.response.data.error
          : error.message;
      alert(t("signup.failed") + ": " + errorMsg);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>{t("signup.title")}</h2>
        <input
          type="text"
          name="name"
          placeholder={t("signup.namePlaceholder")}
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder={t("signup.emailPlaceholder")}
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder={t("signup.passwordPlaceholder")}
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn-signup">
          {t("signup.submitBtn")}
        </button>
      </form>
    </div>
  );
}

export default Signup;
