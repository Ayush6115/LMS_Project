import "../pages/styles/Contact.css";
import { useTranslation } from "react-i18next";

function Contact() {
  const { t } = useTranslation();

  return (
    <div className="contact-page">
      {/* Contact Heading */}
      <section className="contact-hero">
        <h2>{t("contact.title")}</h2>
        <p>{t("contact.subtitle")}</p>
      </section>

      {/* Contact Form */}
      <section className="contact-form-section">
        <div className="form-box">
          <form className="contact-form">
            <input type="text" placeholder={t("contact.form.name")} required />
            <input type="email" placeholder={t("contact.form.email")} required />
            <textarea
              placeholder={t("contact.form.message")}
              rows="6"
              required
            ></textarea>
            <button type="submit">{t("contact.form.button")}</button>
          </form>
        </div>
      </section>

      {/* Company Info */}
      <section className="contact-info">
        <h3>{t("contact.info.title")}</h3>
        <p>{t("contact.info.email")}: ayush@lms.com</p>
        <p>{t("contact.info.phone")}: 08 000 567 800</p>
        <p>{t("contact.info.address")}: 123 Ooizumi Gakuen, Nerima City Tokyo Japan</p>
      </section>
    </div>
  );
}

export default Contact;
