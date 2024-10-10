import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

export default function AdminLogin() {
  const [admin, setAdmin] = useState({
    email: '',
    password: '',
  });

  //using navigate
  const navigate = useNavigate();

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

      if (response.ok) {
        setAdmin({
          name: '',
          email: '',
          password: '',
        });
        alert('Login Successful!');
        // navigate("/");
      } else {
        alert('Invalid Credentials');
      }

      // console.log(response);
    } catch (error) {
      console.log('Login mongo error', error);
    }
  };

  return (
    <>
      <div className="login-container admin-login">
        <div className="login-card">
          <div className="login-image">
            <img src="" alt="Login" />
          </div>
          <div className="login-form">
            <h2>Admin Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email</label>
                <input
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  value={admin.email}
                  onChange={handleInput}
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter password"
                  value={admin.password}
                  onChange={handleInput}
                />
              </div>
              <button type="submit" className="btn-submit">
                Admin Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
