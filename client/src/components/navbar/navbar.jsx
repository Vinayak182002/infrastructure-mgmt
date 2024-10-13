import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom'; // Import Link for navigation
import axios from 'axios';
import navbarCSS from './navbar.module.css'; // Import the CSS module
import { SERVERHOST } from '../../constant/constant';
import { toast } from 'react-toastify';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const login_Check = async (authtoken) => {
    try {
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
      if (authtoken) {
        await login_Check(authtoken);
      } else {
        setIsLoggedIn(false);
      }
    };
    checkAuthToken();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  return (
    <nav className={navbarCSS.navbar}> {/* Apply CSS module here */}
      <div className={navbarCSS['navbar-brand']}>InfraMGMT</div>
      <ul className={navbarCSS['navbar-links']}>
        {/* Show Register and Login links if user is not logged in */}
        {!isLoggedIn ? (
          <>
            <li>
              <Link
                to="/register"
                className={location.pathname === '/register' ? navbarCSS.active : ''}
              >
                Register
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className={location.pathname === '/login' ? navbarCSS.active : ''}
              >
                Login
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                to="/dashboard"
                className={location.pathname === '/dashboard' ? navbarCSS.active : ''}
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/look-free-slots"
                className={location.pathname === '/look-free-slots' ? navbarCSS.active : ''}
              >
                Book Free Slots
              </Link>
            </li>

            <li>
              <Link
                to="/report-resource-fault"
                className={
                  location.pathname === '/report-resource-fault' ? navbarCSS.active : ''
                }
              >
                Report Resource Fault
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className={location.pathname === '/profile' ? navbarCSS.active : ''}
              >
                Profile
              </Link>
            </li>

            {/* Conditionally render "Booking Slot" link */}
            {location.pathname === '/booking-slot' && (
              <li>
                <Link
                  to="/booking-slot"
                  className={location.pathname === '/booking-slot' ? navbarCSS.active : ''}
                >
                  Booking Slot
                </Link>
              </li>
            )}

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
