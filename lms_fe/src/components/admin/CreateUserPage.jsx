import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "./CreateUserPage.css";
import { useTranslation } from "react-i18next";

function CreateUserPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Teacher",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const response = await api.post("/api/auth/create-user", formData, config);

      // Use translation with dynamic name
      alert(
        response.data.message ||
          t("createUser.success", { name: response.data.user.name })
      );

      setFormData({ name: "", email: "", password: "", role: "Teacher" });
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Create user error:", error);
      const errorMsg =
        error.response && error.response.data && error.response.data.error
          ? error.response.data.error
          : error.message;
      alert(`${t("createUser.failed")}: ${errorMsg}`);
    }
  };

  return (
    <div className="create-user-container">
      <form className="create-user-form" onSubmit={handleSubmit}>
        <h2>{t("createUser.title")}</h2>

        <input
          type="text"
          name="name"
          placeholder={t("createUser.namePlaceholder")}
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder={t("createUser.emailPlaceholder")}
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder={t("createUser.passwordPlaceholder")}
          value={formData.password}
          onChange={handleChange}
          required
        />

        <select name="role" value={formData.role} onChange={handleChange} required>
          <option value="Teacher">{t("createUser.roleTeacher")}</option>
          <option value="Admin">{t("createUser.roleAdmin")}</option>
        </select>

        <button type="submit" className="btn-create-user">
          {t("createUser.createButton")}
        </button>
      </form>
    </div>
  );
}

export default CreateUserPage;
