import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "./StudentCoursesPage.css";
import { useTranslation } from "react-i18next";

function StudentCoursesPage() {
  const { t } = useTranslation();
  const [allCourses, setAllCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  // Fetch all courses and enrolled courses IDs on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [allRes, enrolledRes] = await Promise.all([
          api.get("/api/student/courses/all", config),
          api.get("/api/student/courses/enrolled", config),
        ]);

        setAllCourses(allRes.data);
        setEnrolledCourseIds(enrolledRes.data.map((course) => course.id));
      } catch (err) {
        console.error("Fetch courses error:", err);
        alert(t("studentCourses.fetchError"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t]);

  const handleEnrollClick = (courseId) => {
    navigate(`/student/courses/payment/${courseId}`);
  };

  const handleCourseClick = (courseId) => {
    // Navigate to StudentDetailPage for enrolled courses
    navigate(`/student/courses/${courseId}`);
  };

  if (loading) return <p>{t("studentCourses.loading")}</p>;

  // Determine which courses to display based on active tab
  const displayedCourses =
    activeTab === "all"
      ? allCourses
      : allCourses.filter((course) => enrolledCourseIds.includes(course.id));

  return (
    <div className="student-courses-container">
      <div className="tabs">
        <button
          className={activeTab === "all" ? "active" : ""}
          onClick={() => setActiveTab("all")}
        >
          {t("studentCourses.allCourses")}
        </button>
        <button
          className={activeTab === "enrolled" ? "active" : ""}
          onClick={() => setActiveTab("enrolled")}
        >
          {t("studentCourses.enrolledCourses")}
        </button>
      </div>

      <div className="courses-list">
        {displayedCourses.length === 0 ? (
          <p>{t("studentCourses.noCourses")}</p>
        ) : (
          displayedCourses.map((course) => {
            const alreadyEnrolled = enrolledCourseIds.includes(course.id);
            return (
              <div
                key={course.id}
                className={`course-card ${alreadyEnrolled ? "clickable" : ""}`}
                onClick={() => alreadyEnrolled && handleCourseClick(course.id)}
              >
                {course.thumbnail && (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="course-thumbnail"
                  />
                )}
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <span>
                  {new Date(course.startDate).toLocaleDateString()} -{" "}
                  {new Date(course.endDate).toLocaleDateString()}
                </span>

                {activeTab === "all" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // prevent card click
                      handleEnrollClick(course.id);
                    }}
                    disabled={alreadyEnrolled}
                  >
                    {alreadyEnrolled
                      ? t("studentCourses.enrolled")
                      : t("studentCourses.payEnroll")}
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default StudentCoursesPage;
