import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

import CustomerLogin from "./pages/customer/LoginPage";
import CustomerRegister from "./pages/customer/RegisterPage";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import FindProfessionals from "./pages/customer/FindProfessionals";
import RequestService from "./pages/customer/RequestService";

import ProfessionalLogin from "./pages/professional/LoginPage";
import ProfessionalRegister from "./pages/professional/RegisterPage";
import ProfessionalDashboard from "./pages/professional/ProfessionalDashboard";
import ProfessionalProfile from "./pages/professional/ProfilePage";

import CompanyLogin from "./pages/company/LoginPage";
import CompanyRegister from "./pages/company/RegisterPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Customer */}
        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route path="/customer/register" element={<CustomerRegister />} />
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/services/search" element={<FindProfessionals />} />
        <Route path="/customer/request-service" element={<RequestService />} />

        {/* Redirect shorthand /request-service to customer route */}
        <Route 
          path="/request-service" 
          element={<Navigate to="/customer/request-service" replace />} 
        />

        {/* Professional */}
        <Route path="/professional/login" element={<ProfessionalLogin />} />
        <Route path="/professional/register" element={<ProfessionalRegister />} />
        <Route path="/professional/dashboard" element={<ProfessionalDashboard />} />
        <Route path="/professional/profile" element={<ProfessionalProfile />} />

        {/* Company */}
        <Route path="/company/login" element={<CompanyLogin />} />
        <Route path="/company/register" element={<CompanyRegister />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;