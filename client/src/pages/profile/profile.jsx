import React, {useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './profile.css';
import { toast } from 'react-toastify';
import useUserData from '../../components/getUserData/useUserData';

import defaultProfilePic from '../../../public/images/profile-pic.png'; // Default profile image

export default function Profile() {
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
  });

  const navigate = useNavigate();
  const authToken = localStorage.getItem('token');
  const facUser = useUserData(authToken);

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img
            src={userDetails.profilePicture || defaultProfilePic}
            alt="Profile"
            className="profile-image"
          />
          <h2>{facUser.name || 'John Doe'}</h2>
          <p className="profile-role">{userDetails.role || 'Faculty'}</p>
        </div>
        <div className="profile-details">
          <div className="detail-item">
            <label>Email:</label>
            <span>{facUser.email}</span>
          </div>
          <div className="detail-item">
            <label>Phone:</label>
            <span>{userDetails.phone || 'N/A'}</span>
          </div>
          <div className="detail-item">
            <label>Role:</label>
            <span>{userDetails.role || 'N/A'}</span>
          </div>
        </div>
        <div className="profile-actions">
          <button className="btn-edit" onClick={() => navigate('/')}>
            Edit Profile
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
