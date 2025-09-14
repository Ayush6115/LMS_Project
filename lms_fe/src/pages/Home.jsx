import { useNavigate } from "react-router-dom";
import "../pages/styles/Home.css";
import { FaBook, FaChalkboardTeacher, FaCertificate } from "react-icons/fa";
import { useTranslation } from "react-i18next";

function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">{t("home.heroTitle")}</h1>
          <p className="hero-subtitle">{t("home.heroSubtitle")}</p>
          <button className="btn-primary" onClick={() => navigate("/signup")}>
            {t("home.exploreBtn")}
          </button>
        </div>
        <div className="hero-animation">
          <div className="floating-shape shape1"></div>
          <div className="floating-shape shape2"></div>
          <div className="floating-shape shape3"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h3>{t("home.whyChoose")}</h3>
        <div className="feature-cards">
          <div className="card">
            <FaBook className="icon" />
            <h4>{t("home.feature1.title")}</h4>
            <p>{t("home.feature1.desc")}</p>
          </div>
          <div className="card">
            <FaChalkboardTeacher className="icon" />
            <h4>{t("home.feature2.title")}</h4>
            <p>{t("home.feature2.desc")}</p>
          </div>
          <div className="card">
            <FaCertificate className="icon" />
            <h4>{t("home.feature3.title")}</h4>
            <p>{t("home.feature3.desc")}</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <h3>{t("home.ctaTitle")}</h3>
        <button className="btn-primary btn-gradient" onClick={() => navigate("/signup")}>
          {t("home.ctaBtn")}
        </button>
      </section>
    </div>
  );
}

export default Home;
