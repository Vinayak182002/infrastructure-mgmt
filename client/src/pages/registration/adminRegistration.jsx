import React, { useState } from 'react';
import './adminRegistration.css';
import { useNavigate } from 'react-router-dom';

export default function AdminRegistration() {
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

      if (response.ok) {
        setAdmin({
          name: '',
          email: '',
          password: '',
        });

        navigate('/admin-login');
      }
    } catch (error) {
      console.log('Registration mongo error', error);
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
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  placeholder="Enter your password"
                  name="password"
                  value={admin.password}
                  onChange={handleInput}
                />
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
