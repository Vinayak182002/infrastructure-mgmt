import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom'; // Import Link for client-side navigation
import axios from 'axios';
import adminNavbarCSS from './adminNavbar.module.css';
import { SERVERHOST } from '../../constant/constant';
import { toast } from 'react-toastify';

export default function AdminNavbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to control menu visibility
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
      if (authtoken) {
        await login_Check(authtoken);
      } else {
        setIsLoggedIn(false);
      }
    };
    checkAuthToken();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('tokenAdmin');
    setIsLoggedIn(false);
    toast.success('Logged out successfully!');
    navigate('/admin-login');
    setIsMenuOpen(false); // Close the menu after logging out
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle the menu visibility
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false); // Close the menu when a link is clicked
  };

  return (
    <nav className={adminNavbarCSS.navbar}>
      <div className={adminNavbarCSS['navbar-brand']}>InfraMGMT-ADMIN</div>
      <div className={adminNavbarCSS.hamburger} onClick={toggleMenu}>
        &#9776; {/* Hamburger icon */}
      </div>
      <ul className={`${adminNavbarCSS['navbar-links']} ${isMenuOpen ? adminNavbarCSS.open : ''}`}>
        {!isLoggedIn ? (
          <>
            <li>
              <Link
                to="/admin-register"
                className={`${location.pathname === '/admin-register' ? adminNavbarCSS.active : ''}`}
                onClick={handleLinkClick}
              >
                Register
              </Link>
            </li>
            <li>
              <Link
                to="/admin-login"
                className={`${location.pathname === '/admin-login' ? adminNavbarCSS.active : ''}`}
                onClick={handleLinkClick}
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
                onClick={handleLinkClick}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/admin-classrooms"
                className={`${location.pathname === '/admin-classrooms' ? adminNavbarCSS.active : ''}`}
                onClick={handleLinkClick}
              >
                All Classrooms
              </Link>
            </li>
            <li>
              <Link
                to="/admin-labs"
                className={`${location.pathname === '/admin-labs' ? adminNavbarCSS.active : ''}`}
                onClick={handleLinkClick}
              >
                All Labs
              </Link>
            </li>
            <li>
              <Link
                to="/admin-halls"
                className={`${location.pathname === '/admin-halls' ? adminNavbarCSS.active : ''}`}
                onClick={handleLinkClick}
              >
                All Halls
              </Link>
            </li>
            <li>
              <Link
                to="/admin-create-resource"
                className={`${location.pathname === '/admin-create-resource' ? adminNavbarCSS.active : ''}`}
                onClick={handleLinkClick}
              >
                Create Resource
              </Link>
            </li>

            {location.pathname.startsWith('/admin-update-resource') && (
              <li>
                <Link
                  to="/admin-update-resource"
                  className={`${location.pathname.startsWith('/admin-update-resource') ? adminNavbarCSS.active : ''}`}
                  onClick={handleLinkClick}
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
                  onClick={handleLinkClick}
                >
                  Updating Status
                </Link>
              </li>
            )}

            <li>
              <Link
                to="/admin-resource-faults"
                className={`${location.pathname === '/admin-resource-faults' ? adminNavbarCSS.active : ''}`}
                onClick={handleLinkClick}
              >
                Resource Faults
              </Link>
            </li>
            <li>
              <Link
                to="/admin-profile"
                className={`${location.pathname === '/admin-profile' ? adminNavbarCSS.active : ''}`}
                onClick={handleLinkClick}
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
