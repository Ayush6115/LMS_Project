import { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import "./CreateAssignment.css";

function CreateAssignment({ onAssignmentCreated }) {
  const { courseId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to create an assignment.");
        setLoading(false);
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };

      const payload = {
        title,
        description,
        dueDate: new Date(dueDate).toISOString(),
      };

      const res = await api.post(
        `/api/teacher/courses/${courseId}/assignments`,
        payload,
        config
      );

      if (res.status >= 200 && res.status < 300) {
        setSuccess("Assignment created successfully!");
        setTitle("");
        setDescription("");
        setDueDate("");

        if (onAssignmentCreated) {
          onAssignmentCreated(res.data);
        }
      } else {
        setError("Failed to create assignment.");
      }
    } catch (err) {
      console.error(err.response?.data || err);
      if (err.response && err.response.status === 201) {
        setSuccess("Assignment created successfully!");
        setTitle("");
        setDescription("");
        setDueDate("");

        if (onAssignmentCreated) {
          onAssignmentCreated(err.response.data);
        }
      } else {
        setError("Failed to create assignment.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-assignment">
      <h2>Create Assignment for Course ID: {courseId}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Assignment"}
        </button>
      </form>

      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default CreateAssignment;
