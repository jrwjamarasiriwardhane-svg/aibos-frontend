import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AiChatWidget from "./components/ai/AiChatWidget";

import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

import CustomerLogin from "./pages/customer/LoginPage";
import CustomerRegister from "./pages/customer/RegisterPage";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import CustomerProfilePage from "./pages/customer/CustomerProfilePage";
import CustomerNotificationsPage from "./pages/customer/CustomerNotificationsPage";
import FindProfessionals from "./pages/customer/FindProfessionals";
import RequestService from "./pages/customer/RequestService";

import ProfessionalLogin from "./pages/professional/LoginPage";
import ProfessionalRegister from "./pages/professional/RegisterPage";
import ProfessionalDashboard from "./pages/professional/ProfessionalDashboard";
import ProfessionalProfile from "./pages/professional/ProfilePage";

import CompanyLogin from "./pages/company/LoginPage";
import CompanyRegister from "./pages/company/RegisterPage";
import CompanyDashBoard from "./pages/company/CompanyDashBoard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* ==============================
            GLOBAL AUTH
        ============================== */}

        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />

        <Route
          path="/verify-email"
          element={<VerifyEmailPage />}
        />

        <Route
          path="/auth/verify-email"
          element={<VerifyEmailPage />}
        />

        {/* ==============================
            ADMIN
        ============================== */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        {/* ==============================
            CUSTOMER
        ============================== */}

        <Route
          path="/customer/login"
          element={<CustomerLogin />}
        />

        <Route
          path="/customer/register"
          element={<CustomerRegister />}
        />

        <Route
          path="/customer/dashboard"
          element={<CustomerDashboard />}
        />

        <Route
          path="/customer/profile"
          element={<CustomerProfilePage />}
        />

        <Route
          path="/customer/notifications"
          element={<CustomerNotificationsPage />}
        />

        <Route
          path="/services/search"
          element={<FindProfessionals />}
        />

        <Route
          path="/customer/request-service"
          element={<RequestService />}
        />

        {/* ==============================
            REDIRECTS
        ============================== */}

        <Route
          path="/professionals"
          element={
            <Navigate
              to="/services/search"
              replace
            />
          }
        />

        <Route
          path="/request-service"
          element={
            <Navigate
              to="/customer/request-service"
              replace
            />
          }
        />

        <Route
          path="/customer/services"
          element={
            <Navigate
              to="/services/search"
              replace
            />
          }
        />

        {/* ==============================
            PROFESSIONAL
        ============================== */}

        <Route
          path="/professional/login"
          element={<ProfessionalLogin />}
        />

        <Route
          path="/professional/register"
          element={<ProfessionalRegister />}
        />

        <Route
          path="/professional/dashboard"
          element={<ProfessionalDashboard />}
        />

        <Route
          path="/professional/profile"
          element={<ProfessionalProfile />}
        />

        <Route
          path="/professional/jobs"
          element={
            <Navigate
              to="/professional/dashboard"
              replace
            />
          }
        />

        <Route
          path="/professional/applications"
          element={
            <Navigate
              to="/professional/dashboard"
              replace
            />
          }
        />

        <Route
          path="/professional/work"
          element={
            <Navigate
              to="/professional/dashboard"
              replace
            />
          }
        />

        <Route
          path="/professional/notifications"
          element={
            <Navigate
              to="/professional/dashboard"
              replace
            />
          }
        />

        <Route
          path="/professional/settings"
          element={
            <Navigate
              to="/professional/profile"
              replace
            />
          }
        />

        {/* ==============================
            COMPANY
        ============================== */}

        <Route
          path="/company/login"
          element={<CompanyLogin />}
        />

        <Route
          path="/company/register"
          element={<CompanyRegister />}
        />

        <Route
          path="/company/dashboard"
          element={<CompanyDashBoard />}
        />

        {/* ==============================
            404
        ============================== */}

        <Route
          path="*"
          element={<NotFoundPage />}
        />
      </Routes>

      {/* ==============================
          AI CHATBOT
          MUST BE INSIDE BrowserRouter
      ============================== */}

      <AiChatWidget />
    </BrowserRouter>
  );
}

export default App;