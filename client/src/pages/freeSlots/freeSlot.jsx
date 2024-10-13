import React, { useState } from 'react';
import styles from './freeSlot.module.css';
import { SERVERHOST } from '../../constant/constant';
import useUserData from '../../components/getUserData/useUserData';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const FreeSlots = () => {
  const authToken = localStorage.getItem('token');
  const facUser = useUserData(authToken);
  const navigate = useNavigate();

  const [day, setDay] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('09:00');
  const [resources, setResources] = useState([]); // New state to hold resources

  const handleStartTimeChange = (e) => {
    const selectedTime = e.target.value;
    setStartTime(selectedTime);

    // Calculate end time by adding one hour
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const newHours = (hours + 1) % 24; // Wrap around if it's 24:00
    setEndTime(
      `${String(newHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission from refreshing the page

    // Check if the day is selected
    if (!day) {
      toast.error('Please select a day!'); // Show error toast
      return; // Stop the function execution
    }

    const data = {
      day,
      startTime,
    };
  
    try {
      const response = await fetch(
        `${SERVERHOST}/api/infra-mgmt-app/auth/look-free-slot`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );
  
      // Check if the response is okay
      if (response.ok) {
        const result = await response.json();
        setResources(result.resources || []);
      } else {
        console.error('Server responded with an error:', response.status);
      }
    } catch (error) {
      console.error('Fetching free slots', error);
    }
  };
  
  // Handle booking a slot
  const handleBookSlot = async (resourceN) => {
    const bookingDetails = {
      resourceName: resourceN,
      startTime: startTime,
      endTime: endTime,
      facultyName: facUser.name,
      dayOfSlot: day,
    };
    navigate('/booking-slot', {
      state: bookingDetails,
    });
  };

  return (
    <div className={styles.container}>
      <h1>Book a Free Slot</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          Day:
          <select value={day} onChange={(e) => setDay(e.target.value)}>
            <option value="">Select a day</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
          </select>
        </label>

        <label>
          Start Time:
          <select value={startTime} onChange={handleStartTimeChange}>
            {[...Array(11)].map((_, index) => {
              const hour = 8 + index; // From 08:00 to 18:00
              return (
                <option key={hour} value={`${String(hour).padStart(2, '0')}:00`}>
                  {`${String(hour).padStart(2, '0')}:00`}
                </option>
              );
            })}
          </select>
        </label>

        <label>
          End Time:
          <input type="text" value={endTime} readOnly />
        </label>

        <button type="submit" className={styles.submitButton}>
          Look for free slots
        </button>
      </form>

      {/* Display the table if resources are available */}
      {resources.length > 0 && (
        <div>
          <h4>The following resources are free on {day} at {startTime} to {endTime}</h4>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Sr. No</th>
                <th>Resource Name</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Book this slot</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((resource, index) => (
                <tr key={resource._id}>
                  <td>{index + 1}</td>
                  <td>{resource.name}</td>
                  <td>{startTime}</td>
                  <td>{endTime}</td>
                  <td>
                    <button onClick={() => handleBookSlot(resource.name)}>
                      Book
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FreeSlots;
