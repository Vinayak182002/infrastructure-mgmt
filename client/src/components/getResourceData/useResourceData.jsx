import { useState, useEffect } from 'react';
import axios from 'axios';
import { SERVERHOST } from '../../constant/constant';
import { toast } from 'react-toastify';

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
  const [utilizationData, setUtilizationData] = useState([]);

  // Fetch classroom resources
  const getClassroomResources = async () => {
    try {
      const response = await axios.get(`${SERVERHOST}/api/infra-mgmt-app/auth/get-classrooms`);
      setAllClassrooms(response.data.classroomDetails);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch lab resources
  const getLabResources = async () => {
    try {
      const response = await axios.get(`${SERVERHOST}/api/infra-mgmt-app/auth/get-labs`);
      setAllLabs(response.data.labDetails);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch hall resources
  const getHallResources = async () => {
    try {
      const response = await axios.get(`${SERVERHOST}/api/infra-mgmt-app/auth/get-halls`);
      setAllHalls(response.data.hallDetails);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch detailed data of a specific resource
  const getResourceDetails = async (resourceName) => {
    try {
      const response = await axios.get(`${SERVERHOST}/api/infra-mgmt-app/auth/get-resource/${resourceName}`);
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

  // Fetch utilization data for a specific resource
  const getUtilizationData = async (resourceName) => {
    try {
      const response = await axios.get(`${SERVERHOST}/api/infra-mgmt-app/auth/calc-utilization-resource/${resourceName}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching utilization data:', error);
      throw error;
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
    utilizationData,
    getResourceDetails,
    getUtilizationData,
  };
};

export default useResourceData;
