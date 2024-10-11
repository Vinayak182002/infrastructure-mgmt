import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserData from '../../components/getUserData/useUserData';
import useResourceData from '../../components/getResourceData/useResourceData';
import { SERVERHOST } from '../../constant/constant';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
// import homePageCSS from './homePage.module.css'
import './homePage.css';

// Register necessary Chart.js components
Chart.register(ArcElement, Tooltip, Legend);

const PieChart = ({ totalSlots, bookedSlots }) => {
  const data = {
    labels: ['Booked', 'Free'],
    datasets: [
      {
        data: [bookedSlots, totalSlots - bookedSlots],
        backgroundColor: ['#1f4e79', '#00aaff'],
        hoverBackgroundColor: ['#1f4e79', '#00aaff'],
      },
    ],
  };

  return <Pie data={data} />;
};

export default function HomePage() {
  const navigate = useNavigate();
  const authToken = localStorage.getItem('token');
  const facUser = useUserData(authToken);
  const {
    allClassrooms,
    allLabs,
    allHalls,
    resourceDetails,
    getResourceDetails,
  } = useResourceData();

  const [resourceType, setResourceType] = useState('');
  const [specificResource, setSpecificResource] = useState('');
  const [showTable, setShowTable] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [utilizationData, setUtilizationData] = useState({});

  const resourceOptions = {
    Classroom: allClassrooms.map((classroom) => classroom.name),
    Lab: allLabs.map((lab) => lab.name),
    Hall: allHalls.map((hall) => hall.name),
  };

  const handleResourceTypeChange = (e) => {
    setResourceType(e.target.value);
    setSpecificResource(''); // Reset specific resource when type changes
  };

  const handleSpecificResourceChange = (e) => {
    setSpecificResource(e.target.value);
    getResourceDetails(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowTable(true); // Show the timetable table
  };

  const handleBookingSubmit = (slot, day) => {
    navigate('/booking-slot', {
      state: {
        resourceName: resourceDetails.name,
        startTime: slot.startTime,
        endTime: slot.endTime,
        facultyName: facUser.name,
        dayOfSlot: day,
      },
    });
  };

  const handleUtilizationClick = async () => {
    // Fetch utilization data here using the specificResource or resourceDetails.name
    try {
      const response = await fetch(
        `${SERVERHOST}/api/infra-mgmt-app/auth/calc-utilization-resource/${specificResource}`
        // ` http://localhost:5000/api/infra-mgmt-app/auth/calc-utilization-resource/6101CR`
      );
      const data = await response.json();
      if (response.ok) {
        setUtilizationData(data);
        setIsModalOpen(true);
      } else {
        // console.error(data.message);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching utilization data:', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="home-page">
      <h1>Welcome, {facUser.name}</h1>

      <form onSubmit={handleSubmit} className="resource-form">
        <label>
          Resource Type:
          <select
            value={resourceType}
            onChange={handleResourceTypeChange}
            required
          >
            <option value="">Select Resource Type</option>
            {Object.keys(resourceOptions).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label>
          Specific Resource:
          <select
            value={specificResource}
            onChange={handleSpecificResourceChange}
            required
            disabled={!resourceType}
          >
            <option value="">Select Specific Resource</option>
            {resourceType &&
              resourceOptions[resourceType].map((resource) => (
                <option key={resource} value={resource}>
                  {resource}
                </option>
              ))}
          </select>
        </label>

        <button className='submit-btn' type="submit">Submit</button>
      </form>

      {showTable && (
        <div className="timetable">
          <h3>Timetable for {resourceDetails.name}</h3> 
          <button className="util-btn" onClick={handleUtilizationClick}>Show Utilization</button>
          <table>
            <thead>
              <tr>
                <th>Day</th>
                {resourceDetails.weeklySchedule[0]?.slots.map((_, index) => (
                  <th key={index}>{`${8 + index}:00 to ${9 + index}:00`}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {resourceDetails.weeklySchedule.map((daySchedule, dayIndex) => (
                <tr key={dayIndex}>
                  <td>{daySchedule.day}</td>
                  {daySchedule.slots.map((slot, slotIndex) => (
                    <td key={slotIndex}>
                      {slot.isBooked ? (
                        <b>
                          {slot.subject && <div>[{slot.subject}]</div>}
                          {slot.yearOfStudents && (
                            <div>[Class: {slot.yearOfStudents}]</div>
                          )}
                          {slot.divisionOfStudents && (
                            <div>[Div: {slot.divisionOfStudents}]</div>
                          )}
                          {slot.batchOfStudents && (
                            <div>[{slot.batchOfStudents}]</div>
                          )}
                          {slot.branchOfStudents && (
                            <div>[{slot.branchOfStudents}]</div>
                          )}
                          {slot.facultyName && (
                            <div>[Prof. {slot.facultyName}]</div>
                          )}
                        </b>
                      ) : (
                        <div>
                          <b>FREE</b>
                          <button
                            onClick={() =>
                              handleBookingSubmit(slot, daySchedule.day)
                            }
                            className="book-btn btn btn-primary"
                          >
                            Book this slot
                          </button>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Utilization Modal */}
      <div className='modal-popup'>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          ariaHideApp={false}
        >
          <h2>{utilizationData.resourceName}</h2>
          <div className="pie-chart">
            {' '}
            {/* Add this class for styling */}
            <PieChart
              totalSlots={utilizationData.totalSlots}
              bookedSlots={utilizationData.bookedSlots}
            />
          </div>
          <p>
            Utilization Percentage: {utilizationData.utilizationPercentage}
          </p>
          <button onClick={closeModal}>Close</button>
        </Modal>
      </div>
    </div>
  );
}
