import { useState, useEffect } from 'react';
import axios from 'axios';
import { SERVERHOST } from '../../constant/constant';

const useAdminData = (authToken) => {
  const [admin, setAdmin] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getAdminData = async () => {
      setLoading(true);
      setError(null); // Reset error state
      try {
        const response = await axios.post(
          `${SERVERHOST}/api/infra-mgmt-app/auth/admin-1987/admin`,
          {},
          {
            headers: { authorization: authToken },
          }
        );
        setAdmin({
          name: response.data.adminData.name,
          email: response.data.adminData.email,
        });
      } catch (err) {
        console.error(err);
        setError('Failed to fetch admin data');
      } finally {
        setLoading(false); // Loading done
      }
    };

    if (authToken) {
      getAdminData();
    } else {
      setLoading(false); // No token means loading is done
    }
  }, [authToken]);

  return { admin, loading, error }; // Return loading and error
};

export default useAdminData;
