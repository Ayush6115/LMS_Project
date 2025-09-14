import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import { useTranslation } from "react-i18next";
import "./StudentCourseDetailPage.css";

function StudentCourseDetailPage() {
  const { t } = useTranslation();
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState("content");
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [assignmentSubmission, setAssignmentSubmission] = useState({});
  const [submittedAssignments, setSubmittedAssignments] = useState({});
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizScores, setQuizScores] = useState({});
  const [submittedQuizzes, setSubmittedQuizzes] = useState({});

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/student/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;
        setCourse(data);

        const submittedAssignmentsInit = {};
        (data.Assignments || []).forEach((a) => {
          if (a.IsSubmitted) submittedAssignmentsInit[a.Id] = a.Submission;
        });
        setSubmittedAssignments(submittedAssignmentsInit);

        const submittedQuizzesInit = {};
        const quizScoresInit = {};
        (data.Quizzes || []).forEach((q) => {
          if (q.IsSubmitted) {
            submittedQuizzesInit[q.Id] = true;
            quizScoresInit[q.Id] = q.Submission;
          }
        });
        setSubmittedQuizzes(submittedQuizzesInit);
        setQuizScores(quizScoresInit);
      } catch (err) {
        console.error(err);
        setError(t("load_error"));
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId, token, t]);

  const handleAssignmentSubmit = async (assignmentId) => {
    try {
      const res = await api.post(
        `/api/student/courses/${courseId}/assignments/${assignmentId}/submit`,
        { content: assignmentSubmission[assignmentId] || "" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message);

      setSubmittedAssignments({
        ...submittedAssignments,
        [assignmentId]: assignmentSubmission[assignmentId] || "",
      });

      setAssignmentSubmission({ ...assignmentSubmission, [assignmentId]: "" });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || t("submit_error"));
    }
  };

  const handleAnswerChange = (quizId, questionId, value) => {
    if (submittedQuizzes[quizId]) return;
    setQuizAnswers({
      ...quizAnswers,
      [quizId]: {
        ...quizAnswers[quizId],
        [questionId]: value,
      },
    });
  };

  const handleQuizSubmit = async (quizId) => {
    try {
      const res = await api.post(
        `/api/student/courses/${courseId}/quizzes/${quizId}/submit`,
        { answers: quizAnswers[quizId] || {} },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setQuizScores({ ...quizScores, [quizId]: res.data.score });
      setSubmittedQuizzes({ ...submittedQuizzes, [quizId]: true });

      alert(t("quiz_submitted", { score: res.data.score }));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || t("submit_error"));
    }
  };

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

  if (loading) return <p className="loading-text">{t("loading")}</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!course) return <p>{t("no_course")}</p>;

  const assignments = course.Assignments || course.assignments || [];
  const quizzes = course.Quizzes || course.quizzes || [];

  return (
    <div className="course-detail-container">
      <h2 className="course-title">{course.Title || course.title}</h2>

      <div className="tabs">
        {["content", "assignments", "quizzes"].map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "content"
              ? t("course_content")
              : tab === "assignments"
              ? t("assignments")
              : t("quizzes")}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === "content" && (
          <div className="course-content">{renderContent(course.Content || course.content)}</div>
        )}

        {activeTab === "assignments" && (
          <div className="list">
            {assignments.length ? (
              <ul>
                {assignments.map((a) => (
                  <li key={a.Id || a.id}>
                    <strong>{a.Title || a.title}</strong> -{" "}
                    {new Date(a.DueDate || a.dueDate).toLocaleDateString()}
                    {a.Description && <p>{a.Description}</p>}

                    {a.IsSubmitted ? (
                      <p className="submitted">{a.Submission}</p>
                    ) : (
                      <>
                        <textarea
                          placeholder={t("write_submission")}
                          value={assignmentSubmission[a.Id || a.id] || ""}
                          onChange={(e) =>
                            setAssignmentSubmission({
                              ...assignmentSubmission,
                              [a.Id || a.id]: e.target.value,
                            })
                          }
                        />
                        <button onClick={() => handleAssignmentSubmit(a.Id || a.id)}>
                          {t("submit_assignment")}
                        </button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>{t("no_assignments")}</p>
            )}
          </div>
        )}

        {activeTab === "quizzes" && (
          <div className="list">
            {quizzes.length ? (
              quizzes.map((q) => (
                <div key={q.Id || q.id} className="quiz-block">
                  <h3>{q.Title || q.title}</h3>
                  {(q.Questions || q.questions || []).map((ques) => (
                    <div key={ques.Id || ques.id} className="quiz-question">
                      <p>{ques.QuestionText || ques.questionText}</p>
                      {(ques.Options || ques.options || []).map((opt, i) => (
                        <label key={i}>
                          <input
                            type="radio"
                            name={`quiz-${q.Id || q.id}-question-${ques.Id || ques.id}`}
                            value={i}
                            checked={quizAnswers[q.Id || q.id]?.[ques.Id || ques.id] === i}
                            onChange={() =>
                              handleAnswerChange(q.Id || q.id, ques.Id || ques.id, i)
                            }
                            disabled={q.IsSubmitted}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  ))}
                  {!q.IsSubmitted && (
                    <button onClick={() => handleQuizSubmit(q.Id || q.id)}>
                      {t("submit_quiz")}
                    </button>
                  )}
                  {q.IsSubmitted && (
                    <p className="submitted">
                      {t("score")}: {quizScores[q.Id || q.id]}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p>{t("no_quizzes")}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentCourseDetailPage;
