import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import "./CoursePaymentPage.css";
import { useTranslation } from "react-i18next";

function CoursePaymentPage() {
  const { t } = useTranslation();
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    fetchCourse();
  }, []);

  const fetchCourse = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await api.get(
        `/api/student/courses/${courseId}/preview`,
        config
      );
      setCourse(res.data);
    } catch (err) {
      console.error("Fetch course error:", err);
      alert(t("coursePayment.fetchError"));
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const res = await api.post(
        `/api/payments/create-session/${courseId}`,
        {},
        config
      );
      window.location.href = res.data.paymentUrl;
    } catch (err) {
      console.error("Payment error:", err);
      alert(t("coursePayment.paymentError"));
    }
  };

  if (loading) return <p>{t("coursePayment.loading")}</p>;
  if (!course) return <p>{t("coursePayment.notFound")}</p>;

  return (
    <div className="course-payment-page">
      <h2>
        {t("coursePayment.payFor")}: {course.title}
      </h2>
      <p>{course.description}</p>
      <span>
        {new Date(course.startDate).toLocaleDateString()} -{" "}
        {new Date(course.endDate).toLocaleDateString()}
      </span>
      <button onClick={handlePayment}>{t("coursePayment.payEnroll")}</button>
      <button onClick={() => navigate(-1)}>{t("coursePayment.cancel")}</button>
    </div>
  );
}

export default CoursePaymentPage;
