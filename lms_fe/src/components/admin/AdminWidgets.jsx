import React, { useEffect, useState } from "react";
import api from "../../api";
import "./AdminWidgets.css";
import { useTranslation } from "react-i18next";

function AdminWidgets() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const usersRes = await api.get("/api/auth/users", config);
        setUsers(usersRes.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(t("adminWidgets.fetchError"));
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [t]);

  if (loading) return <p>{t("adminWidgets.loading")}</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="admin-dashboard">
      <h2>{t("adminWidgets.welcome")}</h2>

      <div className="dashboard-cards">
        <div className="card users-card">
          <h3>{t("adminWidgets.totalUsers")}</h3>
          <p>{users.length}</p>
          <ul>
            {users.length > 0 ? (
              users.map((user) => (
                <li key={user.id}>
                  {user.name} ({t(`users.roles.${user.role.toLowerCase()}`) || user.role})
                </li>
              ))
            ) : (
              <li>{t("users.noUsers")}</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminWidgets;
