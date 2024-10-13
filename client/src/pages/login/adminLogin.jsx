import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminLoginCSS from './login.module.css';
import axios from 'axios';
import { SERVERHOST } from '../../constant/constant';
import { toast } from 'react-toastify';

export default function AdminLogin() {
  const [admin, setAdmin] = useState({
    email: '',
    password: '',
  });

  //using navigate
  const navigate = useNavigate();

  // State to control password visibility
  const [showPassword, setShowPassword] = useState(false);

  // handling the input values
  const handleInput = (e) => {
    console.log(e);
    let name = e.target.name;
    let value = e.target.value;

    setAdmin({
      ...admin,
      [name]: value,
    });
  };

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
      navigate('/admin-dashboard');
    } catch (error) {
      console.log(error);
      console.log('Login check error', error.response?.data);
    }
  };

  useEffect(() => {
    const checkAuthToken = async () => {
      const authtoken = localStorage.getItem('tokenAdmin');
      // console.log('authtoken value: ', authtoken);
      if (authtoken) {
        await login_Check(authtoken);
      }
    };
    checkAuthToken();
  }, []);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  //   handling form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${SERVERHOST}/api/infra-mgmt-app/auth/admin-1987/login`,
        admin,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.request.statusText === 'OK') {
        setAdmin({
          name: '',
          email: '',
          password: '',
        });
        toast.success('Login Successful!');
        localStorage.setItem('tokenAdmin', response.data.token);
        navigate('/admin-dashboard');
      } else {
        toast.error('Invalid Credentials');
      }

      // console.log(response);
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
      console.log('Login mongo error', error);
    }
  };

  return (
    <>
      <div
        className={[adminLoginCSS['login-container'], adminLoginCSS['user-login']].join(
          ' '
        )}
      >
       <div className={adminLoginCSS['login-card']}>
       <div className={adminLoginCSS['login-image']}>
            <img src="../../../public/images/login-image.png" alt="Login" />
          </div>
          <div className={adminLoginCSS['login-form']}>
            <h2>Admin Login</h2>
            <form onSubmit={handleSubmit}>
              <div className={adminLoginCSS['form-group']}>
                <label>Email</label>
                <input
                  name="email"
                  type="email"
                  className={adminLoginCSS['form-control']}
                  placeholder="Enter email"
                  value={admin.email}
                  onChange={handleInput}
                />
              </div>
              <div className={adminLoginCSS['form-group']}>

                <label>Password</label>
                <div className={adminLoginCSS['password-wrapper']}>

                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className={adminLoginCSS['form-control']}

                    placeholder="Enter password"
                    value={admin.password}
                    onChange={handleInput}
                  />
                  <span
                  className={adminLoginCSS['eye-icon']}
                    onClick={togglePasswordVisibility}
                    style={{ cursor: 'pointer' }}
                  >
                    {showPassword ? '🤓' : '😎'}
                  </span>
                </div>
              </div>
              <button type="submit" className={adminLoginCSS['btn-submit']}
              >
                Admin Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
