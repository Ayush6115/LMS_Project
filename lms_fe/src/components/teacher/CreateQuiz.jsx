import { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api"; // Make sure your axios instance is configured
import "./CreateQuiz.css";

function CreateQuiz({ onQuizCreated }) {
  const { courseId } = useParams();
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
    { questionText: "", options: ["", "", "", ""], correctAnswer: 0 },
  ]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    if (field === "questionText") newQuestions[index].questionText = value;
    else if (field.startsWith("option")) {
      const optIndex = parseInt(field.slice(-1));
      newQuestions[index].options[optIndex] = value;
    } else if (field === "correctAnswer") {
      newQuestions[index].correctAnswer = parseInt(value);
    }
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", options: ["", "", "", ""], correctAnswer: 0 },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to create a quiz.");
        setLoading(false);
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };

      const payload = {
        title,
        questions, // send as-is; backend should handle question structure
      };

      const res = await api.post(
        `/api/teacher/courses/${courseId}/quizzes`,
        payload,
        config
      );

      if (res.status >= 200 && res.status < 300) {
        setSuccess("Quiz created successfully!");
        setTitle("");
        setQuestions([{ questionText: "", options: ["", "", "", ""], correctAnswer: 0 }]);
        if (onQuizCreated) onQuizCreated(res.data);
      } else {
        setError("Failed to create quiz.");
      }
    } catch (err) {
      console.error(err.response?.data || err);
      setError("Failed to create quiz.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-quiz">
      <h2>Create Quiz for Course ID: {courseId}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Quiz Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {questions.map((q, index) => (
          <div key={index} className="question-block">
            <label>Question {index + 1}</label>
            <input
              type="text"
              value={q.questionText}
              onChange={(e) =>
                handleQuestionChange(index, "questionText", e.target.value)
              }
              required
            />
            {q.options.map((opt, i) => (
              <input
                key={i}
                type="text"
                placeholder={`Option ${i + 1}`}
                value={opt}
                onChange={(e) =>
                  handleQuestionChange(index, `option${i}`, e.target.value)
                }
                required
              />
            ))}
            <label>Correct Answer</label>
            <select
              value={q.correctAnswer}
              onChange={(e) =>
                handleQuestionChange(index, "correctAnswer", e.target.value)
              }
            >
              {q.options.map((_, i) => (
                <option key={i} value={i}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
        ))}

        <div className="button-group">
          <button type="button" onClick={addQuestion}>
            Add Question
          </button>
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Quiz"}
          </button>
        </div>
      </form>

      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default CreateQuiz;
