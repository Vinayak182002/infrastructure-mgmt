// src/hooks/useResourceData.js

import { useState, useEffect } from 'react';
import axios from 'axios';
import { SERVERHOST } from '../../constant/constant';

const useResourceData = () => {
  const [allClassrooms, setAllClassrooms] = useState([]);
  const [allLabs, setAllLabs] = useState([]);
  const [allHalls, setAllHalls] = useState([]);
  const [resourceDetails, setResourceDetails] = useState({
    capacity: 0,
    name: '',
    type: '',
    weeklySchedule: [],
  });

  const getClassroomResources = async () => {
    try {
      const response = await axios.get(
        `${SERVERHOST}/api/infra-mgmt-app/auth/get-classrooms`
      );
      setAllClassrooms(response.data.classroomDetails);
    } catch (error) {
      console.log(error);
    }
  };

  const getLabResources = async () => {
    try {
      const response = await axios.get(
        `${SERVERHOST}/api/infra-mgmt-app/auth/get-labs`
      );
      setAllLabs(response.data.labDetails);
    } catch (error) {
      console.log(error);
    }
  };

  const getHallResources = async () => {
    try {
      const response = await axios.get(
        `${SERVERHOST}/api/infra-mgmt-app/auth/get-halls`
      );
      setAllHalls(response.data.hallDetails);
    } catch (error) {
      console.log(error);
    }
  };

  const getResourceDetails = async (resourceName) => {
    try {
      const response = await axios.get(
        `${SERVERHOST}/api/infra-mgmt-app/auth/get-resource/${resourceName}`
      );
      setResourceDetails({
        capacity: response.data.resourceDetails.capacity,
        name: response.data.resourceDetails.name,
        type: response.data.resourceDetails.type,
        weeklySchedule: response.data.resourceDetails.weeklySchedule,
      });
    } catch (error) {
      console.log('Error fetching resource details:', error);
    }
  };

  useEffect(() => {
    getClassroomResources();
    getLabResources();
    getHallResources();
  }, []);

  return {
    allClassrooms,
    allLabs,
    allHalls,
    resourceDetails,
    getResourceDetails,
  };
};

export default useResourceData;
