import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom'; // Import Link for client-side navigation
import axios from 'axios';
import adminNavbarCSS from './adminNavbar.module.css';
import { SERVERHOST } from '../../constant/constant';
import { toast } from 'react-toastify';

export default function AdminNavbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // To navigate after logout
  const location = useLocation(); // Get the current location

  const login_Check = async (authtoken) => {
    try {
      await axios.post(
        `${SERVERHOST}/api/infra-mgmt-app/auth/admin-1987/login-check`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: authtoken,
          },
        }
      );
      setIsLoggedIn(true);
    } catch (error) {
      console.log('Error during login check:', error);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    const checkAuthToken = async () => {
      const authtoken = localStorage.getItem('tokenAdmin');
      console.log('Retrieved token:', authtoken);
      if (authtoken) {
        await login_Check(authtoken);
      } else {
        setIsLoggedIn(false);
      }
    };
    checkAuthToken();
  }, [navigate]);

  const handleLogout = () => {
    // Clear the token from local storage
    localStorage.removeItem('tokenAdmin');

    // Set isLoggedIn to false
    setIsLoggedIn(false);

    // Redirect the user to the login page
    toast.success('Logged out successfully!');
    navigate('/admin-login');
  };

  return (
    <nav className={adminNavbarCSS.navbar}>
      <div className={adminNavbarCSS['navbar-brand']}>InfraMGMT-ADMIN</div>
      <ul className={adminNavbarCSS['navbar-links']}>
        {/* Show Register and Login links if user is not logged in */}
        {!isLoggedIn ? (
          <>
            <li>
              <Link
                to="/admin-register"
                className={`${location.pathname === '/admin-register' ? adminNavbarCSS.active : ''}`}
              >
                Register
              </Link>
            </li>
            <li>
              <Link
                to="/admin-login"
                className={`${location.pathname === '/admin-login' ? adminNavbarCSS.active : ''}`}
              >
                Login
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                to="/admin-dashboard"
                className={`${location.pathname === '/admin-dashboard' ? adminNavbarCSS.active : ''}`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/admin-classrooms"
                className={`${location.pathname === '/admin-classrooms' ? adminNavbarCSS.active : ''}`}
              >
                All Classrooms
              </Link>
            </li>
            <li>
              <Link
                to="/admin-labs"
                className={`${location.pathname === '/admin-labs' ? adminNavbarCSS.active : ''}`}
              >
                All Labs
              </Link>
            </li>
            <li>
              <Link
                to="/admin-halls"
                className={`${location.pathname === '/admin-halls' ? adminNavbarCSS.active : ''}`}
              >
                All Halls
              </Link>
            </li>
            <li>
              <Link
                to="/admin-create-resource"
                className={`${location.pathname === '/admin-create-resource' ? adminNavbarCSS.active : ''}`}
              >
                Create Resource
              </Link>
            </li>

            {/* Conditionally render "Updating Resource" link */}
            {location.pathname.startsWith('/admin-update-resource') && (
              <li>
                <Link
                  to="/admin-update-resource"
                  className={`${location.pathname.startsWith('/admin-update-resource') ? adminNavbarCSS.active : ''}`}
                >
                  Updating Resource
                </Link>
              </li>
            )}

            {location.pathname.startsWith('/admins-update-resources-fault') && (
              <li>
                <Link
                  to="/admins-update-resources-fault"
                  className={`${location.pathname.startsWith('/admins-update-resources-fault') ? adminNavbarCSS.active : ''}`}
                >
                  Updating Status
                </Link>
              </li>
            )}

            <li>
              <Link
                to="/admin-resource-faults"
                className={`${location.pathname === '/admin-resource-faults' ? adminNavbarCSS.active : ''}`}
              >
                Resource Faults
              </Link>
            </li>
            <li>
              <Link
                to="/admin-profile"
                className={`${location.pathname === '/admin-profile' ? adminNavbarCSS.active : ''}`}
              >
                Profile
              </Link>
            </li>
            <li>
              <span onClick={handleLogout} style={{ cursor: 'pointer' }}>
                Logout
              </span>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
