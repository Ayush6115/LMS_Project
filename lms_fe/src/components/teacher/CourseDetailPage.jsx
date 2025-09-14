import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import "./CourseDetailPage.css";

function CourseDetailPage() {
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState("content");
  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [studentAssignments, setStudentAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingAssignment, setEditingAssignment] = useState(null);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "" });

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  useEffect(() => {
    if (activeTab === "assignments") fetchAssignments();
    if (activeTab === "quizzes") fetchQuizzes();
    if (activeTab === "studentAssignments") fetchStudentAssignments();
  }, [activeTab, courseId]);

  const token = localStorage.getItem("token");

  const fetchCourse = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/teacher/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourse(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load course details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async () => {
    try {
      const res = await api.get(`/api/teacher/courses/${courseId}/assignments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignments(res.data);
    } catch {
      setAssignments([]);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const res = await api.get(`/api/teacher/courses/${courseId}/quizzes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuizzes(res.data);
    } catch {
      setQuizzes([]);
    }
  };

  const fetchStudentAssignments = async () => {
    try {
      const res = await api.get(`/api/teacher/courses/${courseId}/student-assignments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudentAssignments(res.data);
    } catch {
      setStudentAssignments([]);
    }
  };

  // Handle update and delete
  const startEdit = (item, type) => {
    setEditForm({ title: item.title, description: item.description || "" });
    if (type === "assignment") setEditingAssignment(item.id);
    if (type === "quiz") setEditingQuiz(item.id);
  };

  const cancelEdit = () => {
    setEditingAssignment(null);
    setEditingQuiz(null);
    setEditForm({ title: "", description: "" });
  };

  const saveEdit = async (id, type) => {
    try {
      const endpoint =
        type === "assignment"
          ? `/api/teacher/courses/${courseId}/assignments/${id}`
          : `/api/teacher/courses/${courseId}/quizzes/${id}`;

      await api.put(
        endpoint,
        { title: editForm.title, description: editForm.description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (type === "assignment") fetchAssignments();
      if (type === "quiz") fetchQuizzes();
      cancelEdit();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update.");
    }
  };

  const deleteItem = async (id, type) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    try {
      const endpoint =
        type === "assignment"
          ? `/api/teacher/courses/${courseId}/assignments/${id}`
          : `/api/teacher/courses/${courseId}/quizzes/${id}`;

      await api.delete(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (type === "assignment")
        setAssignments(assignments.filter((a) => a.id !== id));
      if (type === "quiz") setQuizzes(quizzes.filter((q) => q.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete.");
    }
  };

  // Helper to render HTML content and handle YouTube embeds
  const renderContent = (content) => {
    if (!content) return null;

    const parser = new DOMParser();
    const decoded = parser.parseFromString(content, "text/html");

    decoded.querySelectorAll("a").forEach((link) => {
      const url = link.href;
      if (url.includes("youtube.com/embed/")) {
        const iframe = document.createElement("iframe");
        iframe.width = "100%";
        iframe.height = "360";
        iframe.src = url;
        iframe.title = "YouTube video player";
        iframe.frameBorder = "0";
        iframe.allow =
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.allowFullscreen = true;
        link.parentNode.replaceChild(iframe, link);
      }
    });

    return <div dangerouslySetInnerHTML={{ __html: decoded.body.innerHTML }} />;
  };

  if (loading) return <p className="loading-text">Loading...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="course-detail-container">
      <h2 className="course-title">{course.title}</h2>

      <div className="tabs">
        {["content", "assignments", "quizzes", "studentAssignments"].map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "content"
              ? "Course Content"
              : tab === "assignments"
              ? "Created Assignments"
              : tab === "quizzes"
              ? "Created Quizzes"
              : "Student Assignments"}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === "content" && (
          <div className="course-content">{renderContent(course.content)}</div>
        )}

        {activeTab === "assignments" && (
          <div className="list">
            {assignments.length ? (
              <ul>
                {assignments.map((a) => (
                  <li key={a.id}>
                    {editingAssignment === a.id ? (
                      <>
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) =>
                            setEditForm((f) => ({ ...f, title: e.target.value }))
                          }
                        />
                        <textarea
                          value={editForm.description}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              description: e.target.value,
                            }))
                          }
                        />
                        <button onClick={() => saveEdit(a.id, "assignment")}>
                          Save
                        </button>
                        <button onClick={cancelEdit}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <strong>{a.title}</strong>
                        <p>{a.description}</p>
                        <button onClick={() => startEdit(a, "assignment")}>
                          Edit
                        </button>
                        <button onClick={() => deleteItem(a.id, "assignment")}>
                          Delete
                        </button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No assignments created yet.</p>
            )}
          </div>
        )}

        {activeTab === "quizzes" && (
          <div className="list">
            {quizzes.length ? (
              <ul>
                {quizzes.map((q) => (
                  <li key={q.id}>
                    {editingQuiz === q.id ? (
                      <>
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) =>
                            setEditForm((f) => ({ ...f, title: e.target.value }))
                          }
                        />
                        <textarea
                          value={editForm.description}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              description: e.target.value,
                            }))
                          }
                        />
                        <button onClick={() => saveEdit(q.id, "quiz")}>Save</button>
                        <button onClick={cancelEdit}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <strong>{q.title}</strong>
                        <p>{q.description}</p>
                        <button onClick={() => startEdit(q, "quiz")}>Edit</button>
                        <button onClick={() => deleteItem(q.id, "quiz")}>
                          Delete
                        </button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No quizzes created yet.</p>
            )}
          </div>
        )}

        {activeTab === "studentAssignments" && (
          <div className="list">
            {studentAssignments.length ? (
              <ul>
                {studentAssignments.map((sa) => (
                  <li key={sa.id}>
                    <strong>{sa.studentName}</strong> submitted: {sa.title}
                    {sa.submissionLink && (
                      <a
                        href={sa.submissionLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No student submissions yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseDetailPage;