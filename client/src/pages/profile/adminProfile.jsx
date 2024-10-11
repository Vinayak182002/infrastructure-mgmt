import React, {useState } from 'react';
import { useNavigate } from 'react-router-dom';
import adminProfileCSS from './profile.module.css';
import { toast } from 'react-toastify';

import defaultProfilePic from '../../../public/images/profile-pic.png'; // Default profile image
import useAdminData from '../../components/getAdminData/useAdminData';

export default function AdminProfile() {
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Admin',
  });

  const navigate = useNavigate();
  const authToken = localStorage.getItem('tokenAdmin');
  const { admin, loading, error } = useAdminData(authToken);
  
  const handleLogout = () => {
    localStorage.removeItem('tokenAdmin');
    toast.success('Logged out successfully!');
    navigate('/admin-login');
  };

  return (
    <div className={adminProfileCSS['profile-container']}>
      <div className={adminProfileCSS['profile-card']}>
        <div className={adminProfileCSS['profile-header']}>
          <img
            src={userDetails.profilePicture || defaultProfilePic}
            alt="Profile"
            className={adminProfileCSS['profile-image']}
          />
          <h2>{admin.name || 'John Doe'}</h2>
          <p className={adminProfileCSS['profile-role']}>{userDetails.role || 'Faculty'}</p>
        </div>
        <div className={adminProfileCSS['profile-details']}>
          <div className={adminProfileCSS['detail-item']}>
            <label>Email:</label>
            <span>{admin.email}</span>
          </div>
          <div className={adminProfileCSS['detail-item']}>
            <label>Phone:</label>
            <span>{userDetails.phone || 'N/A'}</span>
          </div>
          <div className={adminProfileCSS['detail-item']}>
            <label>Role:</label>
            <span>{userDetails.role || 'N/A'}</span>
          </div>
        </div>
        <div className={adminProfileCSS['profile-actions']}>
          <button className={adminProfileCSS['btn-edit']} onClick={() => navigate('/')}>
            Edit Profile
          </button>
          <button className={adminProfileCSS['btn-logout']} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
