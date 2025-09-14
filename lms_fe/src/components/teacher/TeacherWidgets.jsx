import React, { useEffect, useState } from "react";
import api from "../../api";
import { useTranslation } from "react-i18next";
import "./TeacherWidgets.css";

function TeacherWidgets() {
  const { t } = useTranslation();
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const classesRes = await api.get("/teacher/classes", config);
        setClasses(classesRes.data);

        const assignmentsRes = await api.get("/teacher/assignments", config);
        setAssignments(assignmentsRes.data);

        const messagesRes = await api.get("/teacher/messages", config);
        setMessages(messagesRes.data);
      } catch (error) {
        console.error(t("teacherWidgets.fetchError"), error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  return (
    <div className="interactive-dashboard">
      <h2 className="title">{t("teacherWidgets.welcome")}</h2>

      <div className="widgets-list">
        <div className="widget">
          <h3>{t("teacherWidgets.classes")}</h3>
          {classes.length ? (
            <ul>
              {classes.map((cls) => (
                <li key={cls.id}>{cls.name}</li>
              ))}
            </ul>
          ) : (
            <p className="empty">{t("teacherWidgets.noClasses")}</p>
          )}
        </div>

        <div className="widget">
          <h3>{t("teacherWidgets.assignments")}</h3>
          {assignments.length ? (
            <ul>
              {assignments.map((assignment) => (
                <li key={assignment.id}>{assignment.title}</li>
              ))}
            </ul>
          ) : (
            <p className="empty">{t("teacherWidgets.noAssignments")}</p>
          )}
        </div>

        <div className="widget">
          <h3>{t("teacherWidgets.messages")}</h3>
          {messages.length ? (
            <ul>
              {messages.map((msg) => (
                <li key={msg.id}>{msg.content}</li>
              ))}
            </ul>
          ) : (
            <p className="empty">{t("teacherWidgets.noMessages")}</p>
          )}
        </div>
      </div>

      {/* Mouse-follow blobs */}
      <div
        className="follower blob"
        style={{ left: mousePos.x - 25 + "px", top: mousePos.y - 25 + "px" }}
      ></div>
      <div
        className="follower blob small"
        style={{ left: mousePos.x - 15 + "px", top: mousePos.y - 15 + "px" }}
      ></div>
      <div
        className="follower blob tiny"
        style={{ left: mousePos.x - 10 + "px", top: mousePos.y - 10 + "px" }}
      ></div>
    </div>
  );
}

export default TeacherWidgets;
