import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../components/styles/Header.css";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../context/AuthContext";
import { FaBars, FaTimes } from "react-icons/fa";

function Header() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { userRole, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="logo">
          <Link to="/">{t("nav.home")}</Link>
        </h1>
      </div>

      <div className={`header-center ${menuOpen ? "open" : ""}`}>
        {!userRole && (
          <>
            <Link to="/">{t("nav.home")}</Link>
            <Link to="/login">{t("nav.login")}</Link>
            <Link to="/signup">{t("nav.signup")}</Link>
            <Link to="/about">{t("nav.about")}</Link>
            <Link to="/contact">{t("nav.contact")}</Link>
          </>
        )}
        {userRole === "Student" && (
          <>
            <Link to="/student/dashboard">{t("nav.dashboard")}</Link>
            <Link to="/student/courses">{t("nav.courses")}</Link>
            <button className="btn-logout" onClick={handleLogout}>
              {t("nav.logout")}
            </button>
          </>
        )}
        {userRole === "Teacher" && (
          <>
            <Link to="/teacher/dashboard">{t("nav.dashboard")}</Link>
            <Link to="/teacher/courses">{t("nav.myCourses")}</Link>
            <Link to="/teacher/create-course">{t("nav.createCourse")}</Link>
            <button className="btn-logout" onClick={handleLogout}>
              {t("nav.logout")}
            </button>
          </>
        )}
        {userRole === "Admin" && (
          <>
            <Link to="/admin/dashboard">{t("nav.dashboard")}</Link>
            <Link to="/admin/users">{t("nav.manageUsers")}</Link>
            <Link to="/admin/create-user">{t("nav.createUser")}</Link>
            <button className="btn-logout" onClick={handleLogout}>
              {t("nav.logout")}
            </button>
          </>
        )}

        {/* Language switcher inside mobile menu */}
        <div className="lang-switcher mobile-lang">
          <button onClick={() => changeLanguage("en")} className={i18n.language === "en" ? "active" : ""}>
            EN
          </button>
          <button onClick={() => changeLanguage("ja")} className={i18n.language === "ja" ? "active" : ""}>
            日本語
          </button>
        </div>
      </div>

      <div className="header-right">
        {/* Hamburger icon */}
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={24} color="white" /> : <FaBars size={24} color="white" />}
        </div>
      </div>
    </header>
  );
}

export default Header;
