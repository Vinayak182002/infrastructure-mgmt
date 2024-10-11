import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Registration from './pages/registration/registration';
import AdminRegistration from './pages/registration/adminRegistration';
import Login from './pages/login/Login';
import HomePage from './pages/homePage/homePage';
import AdminLogin from './pages/login/adminLogin';
import Navbar from './components/navbar/navbar';
import AdminNavbar from './components/navbar/adminNavbar';
import BookingFormPage from './pages/bookingSlot/bookSlot';
import AuthCheck from './constant/authCheck';
import AdminAuthCheck from './constant/adminAuthCheck';
import Profile from './pages/profile/profile';
import ReportFault from './pages/report-fault/reportFault';
import AdminDashboard from './pages/adminDashboard/adminDashboard';
import AllClassrooms from './pages/allClassrooms/allClassrooms';
import AllLabs from './pages/allLabs/allLabs';
import AllHalls from './pages/allHalls/allHalls';
import CreateResource from './pages/createResource/createResource';
import UpdateResource from './pages/updateResource/updateResource';
import AdminProfile from './pages/profile/adminProfile';
import SeeResourceFaults from './pages/resourceFaults/seeResourceFaults';
import UpdateResourceFault from './pages/resourceFaults/updateResourceFault';

const App = () => {
  const location = useLocation(); // Get the current location

  // Determine if the current path is for admin pages
  const isAdminRoute =
    location.pathname === '/admin-login' ||
    location.pathname === '/admin-register' ||
    location.pathname === '/admin-dashboard' ||
    location.pathname === '/admin-classrooms' ||
    location.pathname === '/admin-labs' ||
    location.pathname === '/admin-halls' ||
    location.pathname === '/admin-create-resource' ||
    location.pathname.startsWith('/admin-update-resource/') ||
    location.pathname === '/admin-profile' ||
    location.pathname === '/admin-resource-faults' ||
    location.pathname.startsWith('/admins-update-resources-fault/');

  return (
    <div>
      {isAdminRoute ? <AdminNavbar /> : <Navbar />}{' '}
      {/* Conditional rendering of Navbar */}
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
        <Route
          path="/report-resource-fault"
          element={
            <AuthCheck>
              <ReportFault />
            </AuthCheck>
          }
        />
        <Route path="/admin-register" element={<AdminRegistration />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/admin-dashboard"
          element={
            <AdminAuthCheck>
              <AdminDashboard />
            </AdminAuthCheck>
          }
        />
        <Route
          path="/admin-classrooms"
          element={
            <AdminAuthCheck>
              <AllClassrooms />
            </AdminAuthCheck>
          }
        />
        <Route
          path="/admin-labs"
          element={
            <AdminAuthCheck>
              <AllLabs />
            </AdminAuthCheck>
          }
        />
        <Route
          path="/admin-halls"
          element={
            <AdminAuthCheck>
              <AllHalls />
            </AdminAuthCheck>
          }
        />
        <Route
          path="/admin-create-resource"
          element={
            <AdminAuthCheck>
              <CreateResource />
            </AdminAuthCheck>
          }
        />

        <Route
          path="/admin-profile"
          element={
            <AdminAuthCheck>
              <AdminProfile />
            </AdminAuthCheck>
          }
        />
        <Route
          path="/admin-resource-faults"
          element={
            <AdminAuthCheck>
              <SeeResourceFaults />
            </AdminAuthCheck>
          }
        />

        <Route
          path="/admin-update-resource/:resourceName"
          element={
            <AdminAuthCheck>
              <UpdateResource />
            </AdminAuthCheck>
          }
        />

        <Route
          path="/admins-update-resources-fault/:id"
          element={
            <AdminAuthCheck>
              <UpdateResourceFault />
            </AdminAuthCheck>
          }
        />
      </Routes>
    </div>
  );
};

const AppWrapper = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default AppWrapper;
