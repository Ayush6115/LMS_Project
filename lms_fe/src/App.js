import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import "./App.css";

import CreateUserPage from "./components/admin/CreateUserPage";
import UsersPage from "./components/admin/UsersPage";
import CreateCoursePage from "./components/teacher/CreateCoursePage";
import MyCoursesPage from "./components/teacher/MyCoursesPage";
import StudentCoursesPage from "./components/student/StudentCoursesPage";
import CoursePaymentPage from "./components/student/CoursePaymentPage";
import PaymentSuccessPage from "./components/student/PaymentSuccessPage";

import About from "./pages/About";
import Contact from "./pages/Contact";

import "./i18n";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import CreateAssignment from "./components/teacher/CreateAssignment";
import CreateQuiz from "./components/teacher/CreateQuiz";
import CourseDetailPage from "./components/teacher/CourseDetailPage";
import { AuthProvider } from "./context/AuthContext";
import StudentCourseDetailPage from "./components/student/StudentCourseDetailPage";

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <AuthProvider>
          <div className="layout">
            <Header />
            <main className="main">
              <Routes>
                {/* Public routes wrapped with PublicRoute */}
                <Route
                  path="/"
                  element={
                    <PublicRoute>
                      <Home />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/signup"
                  element={
                    <PublicRoute>
                      <Signup />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/about"
                  element={
                    <PublicRoute>
                      <About />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/contact"
                  element={
                    <PublicRoute>
                      <Contact />
                    </PublicRoute>
                  }
                />

                {/* Student routes */}
                <Route
                  path="/student/dashboard"
                  element={
                    <ProtectedRoute role="Student">
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/courses"
                  element={
                    <ProtectedRoute role="Student">
                      <StudentCoursesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/courses/payment/:courseId"
                  element={
                    <ProtectedRoute role="Student">
                      <CoursePaymentPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/courses/payment-success"
                  element={
                    <ProtectedRoute role="Student">
                      <PaymentSuccessPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/courses/:courseId"
                  element={
                    <ProtectedRoute role="Student">
                      <StudentCourseDetailPage />
                    </ProtectedRoute>
                  }
                />

                {/* Teacher routes */}
                <Route
                  path="/teacher/dashboard"
                  element={
                    <ProtectedRoute role="Teacher">
                      <TeacherDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher/create-course"
                  element={
                    <ProtectedRoute role="Teacher">
                      <CreateCoursePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher/courses"
                  element={
                    <ProtectedRoute role="Teacher">
                      <MyCoursesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher/courses/:courseId/assignments"
                  element={
                    <ProtectedRoute role="Teacher">
                      <CreateAssignment />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher/courses/:courseId/quizzes"
                  element={
                    <ProtectedRoute role="Teacher">
                      <CreateQuiz />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher/courses/:courseId"
                  element={
                    <ProtectedRoute role="Teacher">
                      <CourseDetailPage />
                    </ProtectedRoute>
                  }
                />

                {/* Admin routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute role="Admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/create-user"
                  element={
                    <ProtectedRoute role="Admin">
                      <CreateUserPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute role="Admin">
                      <UsersPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </Router>
    </I18nextProvider>
  );
}

export default App;
