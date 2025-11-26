import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import ServicePage from './pages/ServicePage';
import AdminPage from './pages/AdminPage';
import BookingPage from './pages/BookingPage';
import DoctorCheckupPage from './pages/DoctorCheckupPage';
import PatientHistoryPage from './pages/PatientHistoryPage';
import CashierPage from './pages/CashierPage';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
        <Routes>
          {/* MainLayout bao bọc tất cả các trang con */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="services" element={<ServicePage />} />
            <Route path="booking" element={<BookingPage />} />
            <Route path="admin" element={<AdminPage />} />
            <Route path="admin/checkup" element={<DoctorCheckupPage />} />
            <Route path="my-records" element={<PatientHistoryPage />} />
            <Route path="/cashier" element={<CashierPage />} />
            <Route path="/login" element={<LoginPage />} />
           <Route path="/register" element={<RegisterPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
