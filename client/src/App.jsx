import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Registration from './pages/registration/registration';
import AdminRegistration from './pages/registration/adminRegistration';
import Login from './pages/login/Login';
import HomePage from './pages/homePage/homePage';
import AdminLogin from './pages/login/adminLogin';
import Navbar from './components/navbar/navbar';
import BookingFormPage from './pages/bookingSlot/bookSlot';
import AuthCheck from './constant/authCheck';
import Profile from './pages/profile/profile';

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route
            path="/dashboard"
            element={
              <AuthCheck>
                <HomePage />
              </AuthCheck>
            }
          />
          <Route
            path="/booking-slot"
            element={
              <AuthCheck>
                <BookingFormPage />
              </AuthCheck>
            }
          />
          <Route
            path="/profile"
            element={
              <AuthCheck>
                <Profile />
              </AuthCheck>
            }
          />
          <Route path="/admin-register" element={<AdminRegistration />} />
          <Route path="/admin-login" element={<AdminLogin />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
