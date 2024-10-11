import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import loginCSS from './login.module.css';
import axios from 'axios';
import { SERVERHOST } from '../../constant/constant';
import { toast } from 'react-toastify';

export default function Login() {
  const [facUser, setfacUser] = useState({
    email: '',
    password: '',
  });

  // State to control password visibility
  const [showPassword, setShowPassword] = useState(false);

  //using navigate
  const navigate = useNavigate();

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
      navigate('/dashboard');
    } catch (error) {
      console.log(error);
      console.log('Login check error', error.response?.data);
    }
  };

  useEffect(() => {
    const checkAuthToken = async () => {
      const authtoken = localStorage.getItem('token');
      console.log('authtoken value: ', authtoken);
      if (authtoken) {
        await login_Check(authtoken);
      }
    };
    checkAuthToken();
  }, []);

  // handling the input values
  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setfacUser({
      ...facUser,
      [name]: value,
    });
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // handling form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${SERVERHOST}/api/infra-mgmt-app/auth/login`,
        facUser,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.request.statusText === 'OK') {
        setfacUser({
          name: '',
          email: '',
          password: '',
        });
        toast.success('Login Successful!');
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
      } else {
        toast('Invalid Credentials');
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
     <div className={[loginCSS['login-container'], loginCSS['user-login']].join(' ')}>
        <div className={loginCSS['login-card']}>
          <div className={loginCSS['login-image']}>
            <img src="../../../public/images/login-image.png" alt="Login" />
          </div>
          <div className={loginCSS['login-form']}>
            <h2>User Login</h2>
            <form onSubmit={handleSubmit}>
              <div className={loginCSS['form-group']}>
                <label>Email</label>
                <input
                  name="email"
                  type="text"
                  className={loginCSS['form-control']}
                  placeholder="Enter email"
                  value={facUser.email}
                  onChange={handleInput}
                />
              </div>
              <div className={loginCSS['form-group']}>
                <label>Password</label>
                <div className={loginCSS['password-wrapper']}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className={loginCSS['form-control']}
                    placeholder="Enter password"
                    value={facUser.password}
                    onChange={handleInput}
                  />
                  <span
                      className={loginCSS['eye-icon']}
                    onClick={togglePasswordVisibility}
                    style={{ cursor: 'pointer' }}
                  >
                    {showPassword ? '🤓' : '😎'}
                  </span>
                </div>
              </div>
              <button type="submit"   className={loginCSS['btn-submit']}>
                User Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
