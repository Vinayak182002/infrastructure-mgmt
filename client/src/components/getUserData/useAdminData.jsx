// src/hooks/useUserData.js

import { useState, useEffect } from 'react';
import axios from 'axios';
import { SERVERHOST } from '../../constant/constant';

const useAdminData = (authToken) => {
  const [admin, setAdmin] = useState({ name: '', email: '' });
  useEffect(() => {
    const getAdminData = async () => {
      try {
        const response = await axios.get(
          `${SERVERHOST}/api/infra-mgmt-app/auth/admin`,
          {
            headers: { authorization: authToken },
          }
        );
        setAdmin({
          name: response.data.adminData.name,
          email: response.data.adminData.email,
        });
      } catch (error) {
        console.log(error);
      }
    };

    if (authToken) {
        getAdminData();
    }
  }, [authToken]);

  return admin;
};

export default useAdminData;
