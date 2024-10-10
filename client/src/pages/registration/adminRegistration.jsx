import React, { useState } from 'react';
import './adminRegistration.css';
import { useNavigate } from 'react-router-dom';
import { SERVERHOST } from '../../constant/constant';
import { toast } from 'react-toastify';
import axios from 'axios';


export default function AdminRegistration() {

  // State to control password visibility
  const [showPassword, setShowPassword] = useState(false);
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [admin, setAdmin] = useState({
    name: '',
    email: '',
    password: '',
  });

  //   use navigate
  const navigate = useNavigate();

  // handling the input values
  const handleInput = (e) => {
    // console.log(e);
    let name = e.target.name;
    let value = e.target.value;

    setAdmin({
      ...admin,
      [name]: value,
    });
  };

  //handling form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${SERVERHOST}/api/infra-mgmt-app/auth/admin-1987/register`,
        admin,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.request.statusText === "OK") {
        setAdmin({
          name: '',
          email: '',
          password: '',
        });
        localStorage.setItem('tokenAdmin', response.data.token);
        toast.success("Admin Registered Successfully!");
        navigate('/admin-login');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          toast.error(
            error.response.data.extraDetails || 'Invalid Credentials!'
          );
        } else if (error.response.status === 401) {
          toast.error('Unauthorized! Check your credentials.');
        } else {
          toast.error('Something went wrong! Please try again.');
        }
      } else {
        toast.error('Network error! Please check your connection.');
      }
      console.log('Registration', error);
    }
  };

  return (
    <>
      <div className="admin-registration-container">
        <div className="admin-registration-card">
          {/* Left Side: Image */}
          <div className="admin-registration-image">
            <img
              src="/images/admin-register-image.png"
              alt="Admin registration visual"
            />
          </div>

          {/* Right Side: Form */}
          <div className="admin-registration-form">
            <h2>Admin Account</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="form-control"
                  placeholder="Enter your name"
                  value={admin.name}
                  onChange={handleInput}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={admin.email}
                  onChange={handleInput}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    className="form-control"
                    placeholder="Enter your password"
                    onChange={handleInput}
                    value={admin.password}
                  />
                  <span
                    className="eye-icon"
                    onClick={togglePasswordVisibility}
                    style={{ cursor: 'pointer' }}
                  >
                    {showPassword ? '🤓' : '😎'}
                  </span>
                </div>
              </div>
              <button type="submit" className="btn-submit">
                Register as Admin
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
