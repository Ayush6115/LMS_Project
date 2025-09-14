import React, { useEffect, useState } from "react";
import api from "../../api";
import { useTranslation } from "react-i18next";
import "./StudentWidgets.css";

function StudentWidgets() {
  const { t } = useTranslation();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Add token from localStorage if backend requires authentication
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const coursesRes = await api.get("/student/courses", config);
        setCourses(coursesRes.data);

        const assignmentsRes = await api.get("/student/assignments", config);
        setAssignments(assignmentsRes.data);

        const notificationsRes = await api.get("/student/notifications", config);
        setNotifications(notificationsRes.data);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="student-widgets">
      <h2>{t("studentWidgets.welcome")}</h2>

      <div className="widget">
        <h3>{t("studentWidgets.yourCourses")}</h3>
        <ul>
          {courses.map((course) => (
            <li key={course.id}>{course.name}</li>
          ))}
        </ul>
      </div>

      <div className="widget">
        <h3>{t("studentWidgets.assignments")}</h3>
        <ul>
          {assignments.map((assignment) => (
            <li key={assignment.id}>
              {assignment.title} - {t("studentWidgets.due")}: {assignment.dueDate}
            </li>
          ))}
        </ul>
      </div>

      <div className="widget">
        <h3>{t("studentWidgets.notifications")}</h3>
        <ul>
          {notifications.map((note) => (
            <li key={note.id}>{note.message}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default StudentWidgets;
