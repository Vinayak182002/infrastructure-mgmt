import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'; // Don't forget to import axios
import './navbar.css';
import { SERVERHOST } from '../../constant/constant'; // Assuming SERVERHOST is defined in your constants file

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // To navigate after logout
  const location = useLocation(); // Get the current location

  const login_Check = async (authtoken) => {
    try {
      console.log('Checking login status...');
      await axios.post(
        `${SERVERHOST}/api/infra-mgmt-app/auth/login-check`,
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
      const authtoken = localStorage.getItem('token');
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
    localStorage.removeItem('token');

    // Set isLoggedIn to false
    setIsLoggedIn(false);

    // Redirect the user to the login page
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">InfraMGMT</div>
      <ul className="navbar-links">
        {/* Show Register and Login links if user is not logged in */}
        {!isLoggedIn ? (
          <>
            <li>
              <a
                href="/register"
                className={location.pathname === '/register' ? 'active' : ''}
              >
                Register
              </a>
            </li>
            <li>
              <a
                href="/login"
                className={location.pathname === '/login' ? 'active' : ''}
              >
                Login
              </a>
            </li>
          </>
        ) : (
          <>
            <li>
              <a
                href="/dashboard"
                className={location.pathname === '/dashboard' ? 'active' : ''}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/profile"
                className={location.pathname === '/profile' ? 'active' : ''}
              >
                Profile
              </a>
            </li>
            <li>
              <a
                href="/report-resource-fault"
                className={
                  location.pathname === '/report-resource-fault' ? 'active' : ''
                }
              >
                Report Resource Fault
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
