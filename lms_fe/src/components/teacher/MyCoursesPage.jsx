import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "./MyCoursesPage.css";
import { useTranslation } from "react-i18next";

function MyCoursesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    thumbnail: "",
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert(t("myCourses.loginRequired"));
        setLoading(false);
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await api.get("/api/teacher/courses/get-courses", config);
      setCourses(res.data);
    } catch (err) {
      console.error("Fetch courses error:", err);
      alert(t("myCourses.fetchFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (course) => {
    setEditingCourseId(course.id);
    setEditData({
      title: course.title,
      description: course.description,
      startDate: course.startDate.split("T")[0],
      endDate: course.endDate.split("T")[0],
      thumbnail: course.thumbnail || "",
    });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await api.put(
        `/api/teacher/courses/update-course/${editingCourseId}`,
        editData,
        config
      );
      setEditingCourseId(null);
      fetchCourses();
    } catch (err) {
      console.error("Update course error:", err);
      alert(t("myCourses.updateFailed"));
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm(t("myCourses.confirmDelete"))) return;
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await api.delete(`/api/teacher/courses/delete-course/${courseId}`, config);
      fetchCourses();
    } catch (err) {
      console.error("Delete course error:", err);
      alert(t("myCourses.deleteFailed"));
    }
  };

  if (loading) return <p className="loading-text">Loading...</p>;

  return (
    <div className="my-courses-container">
      <h2>{t("myCourses.title")}</h2>

      {courses.length === 0 ? (
        <p className="empty-text">{t("myCourses.empty")}</p>
      ) : (
        <div className="courses-list">
          {courses.map((course) => (
            <div
              key={course.id}
              className="course-card"
              onClick={() => navigate(`/teacher/courses/${course.id}`)}
              style={{ cursor: "pointer" }}
            >
              {editingCourseId === course.id ? (
                <form
                  onSubmit={handleEditSubmit}
                  className="edit-form"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    name="title"
                    value={editData.title}
                    onChange={handleEditChange}
                    required
                  />
                  <input
                    name="thumbnail"
                    placeholder={t("myCourses.thumbnailURL")}
                    value={editData.thumbnail}
                    onChange={handleEditChange}
                  />
                  <textarea
                    name="description"
                    value={editData.description}
                    onChange={handleEditChange}
                    required
                  />
                  <input
                    type="date"
                    name="startDate"
                    value={editData.startDate}
                    onChange={handleEditChange}
                    required
                  />
                  <input
                    type="date"
                    name="endDate"
                    value={editData.endDate}
                    onChange={handleEditChange}
                    required
                  />
                  <button type="submit">{t("myCourses.save")}</button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setEditingCourseId(null); }}
                  >
                    {t("myCourses.cancel")}
                  </button>
                </form>
              ) : (
                <>
                  {course.thumbnail && (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="course-thumbnail"
                    />
                  )}
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <span className="date">
                    {new Date(course.startDate).toLocaleDateString()} -{" "}
                    {new Date(course.endDate).toLocaleDateString()}
                  </span>
                  <div className="course-buttons">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEditClick(course); }}
                    >
                      {t("myCourses.edit")}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(course.id); }}
                    >
                      {t("myCourses.delete")}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/teacher/courses/${course.id}/assignments`); }}
                    >
                      Create Assignment
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/teacher/courses/${course.id}/quizzes`); }}
                    >
                      Create Quiz
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyCoursesPage;
