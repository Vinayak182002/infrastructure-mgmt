import React, {useState } from 'react';
import { useNavigate } from 'react-router-dom';
import profileCSS from './profile.module.css';
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
    <div className={profileCSS['profile-container']}>
      <div className={profileCSS['profile-card']}>
        <div className={profileCSS['profile-header']}>
          <img
            src={userDetails.profilePicture || defaultProfilePic}
            alt="Profile"
            className={profileCSS['profile-image']}
          />
          <h2>{facUser.name || 'John Doe'}</h2>
          <p className={profileCSS['profile-role']}>{userDetails.role || 'Faculty'}</p>
        </div>
        <div className={profileCSS['profile-details']}>
          <div className={profileCSS['detail-item']}>
            <label>Email:</label>
            <span>{facUser.email}</span>
          </div>
          <div className={profileCSS['detail-item']}>

            <label>Phone:</label>
            <span>{userDetails.phone || 'N/A'}</span>
          </div>
          <div className={profileCSS['detail-item']}>

            <label>Role:</label>
            <span>{userDetails.role || 'N/A'}</span>
          </div>
        </div>
        <div className={profileCSS['profile-actions']}>
          <button className={profileCSS['btn-edit']} onClick={() => navigate('/')}>
            Edit Profile
          </button>
          <button className={profileCSS['btn-logout']} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
