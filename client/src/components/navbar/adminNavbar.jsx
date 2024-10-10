import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'; // Don't forget to import axios
import './navbar.css';
import { SERVERHOST } from '../../constant/constant'; // Assuming SERVERHOST is defined in your constants file

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
    navigate('/admin-login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">InfraMGMT-ADMIN</div>
      <ul className="navbar-links">
        {/* Show Register and Login links if user is not logged in */}
        {!isLoggedIn ? (
          <>
            <li>
              <a
                href="/admin-register"
                className={location.pathname === '/admin-register' ? 'active' : ''}
              >
                Register
              </a>
            </li>
            <li>
              <a
                href="/admin-login"
                className={location.pathname === '/admin-login' ? 'active' : ''}
              >
                Login
              </a>
            </li>
          </>
        ) : (
          <>
            <li>
              <a
                href="/admin-dashboard"
                className={location.pathname === '/admin-dashboard' ? 'active' : ''}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/admin-classrooms"
                className={location.pathname === '/admin-classrooms' ? 'active' : ''}
              >
                All Classrooms
              </a>
            </li>
            <li>
              <a
                href="/admin-labs"
                className={location.pathname === '/admin-labs' ? 'active' : ''}
              >
                All Labs
              </a>
            </li>
            <li>
              <a
                href="/admin-halls"
                className={location.pathname === '/admin-halls' ? 'active' : ''}
              >
                All Halls
              </a>
            </li>
            <li>
              <a onClick={handleLogout} style={{ cursor: 'pointer' }}>
                Logout
              </a>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
