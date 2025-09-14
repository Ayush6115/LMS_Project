import { useState, useEffect } from "react";
import api from "../../api";
import "./UsersPage.css";
import { useTranslation } from "react-i18next";

function UsersPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        alert(t("users.loginRequired"));
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await api.get("/api/auth/users", config);
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert(t("users.fetchFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm(t("users.confirmDelete"))) return;
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await api.delete(`/api/auth/users/${userId}`, config);
      alert(t("users.deleteSuccess"));
      fetchUsers();
    } catch (error) {
      console.error("Delete user error:", error);
      alert(t("users.deleteFailed"));
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers =
    filter === "all" ? users : users.filter((u) => u.role.toLowerCase() === filter);

  return (
    <div className="users-container">
      <h2>{t("users.title")}</h2>

      <div className="filter-buttons">
        {["all", "student", "teacher", "admin"].map((role) => (
          <button
            key={role}
            className={filter === role ? "active" : ""}
            onClick={() => setFilter(role)}
          >
            {t(`users.roles.${role}`)}
          </button>
        ))}
      </div>

      {loading ? (
        <p>{t("users.loading")}</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>{t("users.table.name")}</th>
              <th>{t("users.table.email")}</th>
              <th>{t("users.table.role")}</th>
              <th>{t("users.table.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{t(`users.roles.${user.role.toLowerCase()}`)}</td>
                <td>
                  <button className="btn-delete" onClick={() => handleDelete(user.id)}>
                    {t("users.deleteButton")}
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  {t("users.noUsers")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UsersPage;
