import "../pages/styles/About.css";
import { useTranslation } from "react-i18next";

function AboutUs() {
  const { t } = useTranslation();

  const teamMembers = [
    {
      name: "Ayush Ranjan",
      role: t("about.team.founder"),
      img: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Ayush Ranjan",
      role: t("about.team.instructor"),
      img: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Ayush Ranjan",
      role: t("about.team.developer"),
      img: "https://randomuser.me/api/portraits/men/56.jpg",
    },
    {
      name: "Ayush Ranjan",
      role: t("about.team.manager"),
      img: "https://randomuser.me/api/portraits/women/68.jpg",
    },
  ];

  return (
    <div className="about-us">
      {/* Hero Section */}
      <section className="hero-about">
        <h2 className="hero-title">{t("about.heroTitle")}</h2>
        <p className="hero-subtitle">{t("about.heroSubtitle")}</p>
        <p className="hero-desc">{t("about.heroDesc")}</p>
      </section>

      {/* Values / Features Section */}
      <section className="values">
        <h3>{t("about.valuesTitle")}</h3>
        <div className="value-cards">
          <div className="value-card">{t("about.values.accessible")}</div>
          <div className="value-card">{t("about.values.interactive")}</div>
          <div className="value-card">{t("about.values.certified")}</div>
          <div className="value-card">{t("about.values.support")}</div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team">
        <h3>{t("about.teamTitle")}</h3>
        <div className="team-cards">
          {teamMembers.map((member, index) => (
            <div className="card" key={index}>
              <img src={member.img} alt={member.name} />
              <h4>{member.name}</h4>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
