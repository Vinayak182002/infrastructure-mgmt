// src/hooks/useUserData.js

import { useState, useEffect } from 'react';
import axios from 'axios';
import { SERVERHOST } from '../../constant/constant';

const useUserData = (authToken) => {
  const [facUser, setFacUser] = useState({ name: '', email: '' });

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axios.get(
          `${SERVERHOST}/api/infra-mgmt-app/auth/user`,
          {
            headers: { authorization: authToken },
          }
        );
        setFacUser({
          name: response.data.userData.name,
          email: response.data.userData.email,
        });
      } catch (error) {
        console.log(error);
      }
    };

    if (authToken) {
      getUserData();
    }
  }, [authToken]);

  return facUser;
};

export default useUserData;
