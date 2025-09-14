import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api";
import "./PaymentSuccessPage.css";
import { useTranslation } from "react-i18next";

function PaymentSuccessPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const searchParams = new URLSearchParams(location.search);
  const courseId = searchParams.get("courseId");
  const sessionId = searchParams.get("sessionId");
  console.log("courseId:", courseId, "sessionId:", sessionId);

  useEffect(() => {
    confirmPayment();
  }, []);

  const confirmPayment = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Using token:", token);

      const res = await api.post(
        `/api/payments/confirm/${courseId}`,
        { sessionId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.message || t("paymentSuccess.successMessage"));
    } catch (err) {
      console.error(
        "Payment confirmation error:",
        err.response?.data || err.message
      );
      setMessage(t("paymentSuccess.failureMessage"));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>{t("paymentSuccess.loading")}</p>;

  return (
    <div className="payment-success-page">
      <h2>{t("paymentSuccess.status")}</h2>
      <p>{message}</p>
      <button
        onClick={() =>
          navigate("/student/courses", { state: { activeTab: "enrolled" } })
        }
      >
        {t("paymentSuccess.goToCourses")}
      </button>
    </div>
  );
}

export default PaymentSuccessPage;
