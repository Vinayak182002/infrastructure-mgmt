import React, { useState } from 'react';
import './registration.css';
import { useNavigate } from 'react-router-dom';
import { SERVERHOST } from '../../constant/constant';
import { toast } from 'react-toastify';
import axios from 'axios';
import image from "../../../public/images/register-image.png"; 

export default function Registration() {
  const [facUser, setfacUser] = useState({
    name: '',
    email: '',
    password: '',
  });

  // State to control password visibility
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const handleInput = (e) => {
    const { name, value } = e.target;
    setfacUser({
      ...facUser,
      [name]: value,
    });
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${SERVERHOST}/api/infra-mgmt-app/auth/register`,
        facUser,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response);

      if (response.request.statusText === 'OK') {
        console.log('in response .ok');

        setfacUser({
          name: '',
          email: '',
          password: '',
        });
        localStorage.setItem('token', response.data.token);
        toast.success('Registration Successful! Please LogIn');
        navigate('/login');
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
      console.log('Login error', error);
    }
  };

  return (
    <>
      <div className="registration-container">
        <div className="registration-card">
          {/* Left Side: Image */}
          <div className="registration-image">
            <img src={image} alt="Registration visual" style={{paddingTop:"12vh"}} />
          </div>
          {/* Right Side: Form */}
          <div className="registration-form">
            <h2>Create Your Account</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  placeholder="Enter your name"
                  onChange={handleInput}
                  value={facUser.name}
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
                  onChange={handleInput}
                  value={facUser.email}
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
                    value={facUser.password}
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
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
