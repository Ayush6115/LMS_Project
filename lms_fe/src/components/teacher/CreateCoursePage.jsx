import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "./CreateCoursePage.css";
import { useTranslation } from "react-i18next";

// TipTap imports
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Youtube from "@tiptap/extension-youtube";
import Placeholder from "@tiptap/extension-placeholder";

function CreateCoursePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    startDate: "",
    endDate: "",
    thumbnail: "",
  });
  const [loading, setLoading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Youtube,
      Placeholder.configure({
        placeholder: "Write your course content here...",
      }),
    ],
    content: "<p></p>",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (!form.title.trim()) {
      alert(t("createCourse.enterTitle"));
      return false;
    }
    if (!form.startDate || !form.endDate) {
      alert(t("createCourse.setDates"));
      return false;
    }
    if (new Date(form.startDate) > new Date(form.endDate)) {
      alert(t("createCourse.startAfterEnd"));
      return false;
    }
    if (form.thumbnail) {
      try {
        new URL(form.thumbnail);
      } catch {
        alert(t("createCourse.invalidThumbnail"));
        return false;
      }
    }
    if (!editor || !editor.getHTML().trim()) {
      alert("Please enter course content.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        alert(t("createCourse.loginRequired"));
        return;
      }

      const payload = {
        title: form.title,
        content: editor.getHTML(),
        startDate: form.startDate,
        endDate: form.endDate,
        thumbnail: form.thumbnail,
      };

      await api.post("/api/teacher/courses/create-course", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(t("createCourse.success"));
      navigate("/teacher/courses");
    } catch (err) {
      console.error("Create course error:", err);
      const errorMsg =
        err.response?.data?.error || err.message || t("createCourse.failed");
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!editor) return null;

  return (
    <div className="create-course-container">
      <form className="create-course-form" onSubmit={handleSubmit}>
        <h2>{t("createCourse.title")}</h2>

        <input
          type="text"
          name="title"
          placeholder={t("createCourse.courseTitle")}
          value={form.title}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="thumbnail"
          placeholder={t("createCourse.thumbnailURL")}
          value={form.thumbnail}
          onChange={handleChange}
        />

        <div className="editor-toolbar">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            Bold
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            Italic
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            Bullet List
          </button>
        </div>

        <div className="editor-wrapper">
          <EditorContent editor={editor} />
        </div>

        <div className="dates-row">
          <label>
            {t("createCourse.start")}
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            {t("createCourse.end")}
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <button type="submit" className="btn-create" disabled={loading}>
          {loading ? t("createCourse.creating") : t("createCourse.createCourse")}
        </button>
      </form>
    </div>
  );
}

export default CreateCoursePage;
