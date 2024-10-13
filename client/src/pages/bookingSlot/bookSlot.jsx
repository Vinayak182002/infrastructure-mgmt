import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SERVERHOST } from '../../constant/constant';
import bookSlotCSS from './bookSlot.module.css'; // Import the CSS module
import { toast } from 'react-toastify';

const BookingFormPage = () => {
  const navigate = useNavigate();
  const authToken = localStorage.getItem('token');

  if (!authToken) {
    navigate('/login');
  }
  const location = useLocation();
  const { resourceName, startTime, endTime, facultyName, dayOfSlot } =
    location.state || {};
  const [bookingData, setBookingData] = useState({
    resourceName: resourceName,
    startTime: startTime,
    subject: '',
    yearOfStudents: '',
    divisionOfStudents: '',
    batchOfStudents: '',
    branchOfStudents: '',
    facultyName: facultyName,
    day: dayOfSlot,
  });

  const handleInputChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${SERVERHOST}/api/infra-mgmt-app/auth/book-slot`,
        {
          ...bookingData,
          headers: {
            'Content-Type': 'application/json',
            authorization: authToken,
          },
        }
      );
      if (response.statusText === 'OK') {
        toast.success(response.data.message);
        navigate('/dashboard');
      } else {
        toast(response.message);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          toast.error(
            error.response.data.extraDetails ||
              error.response.data.message ||
              'Invalid Credentials!'
          );
        } else if (error.response.status === 401) {
          toast.error('Unauthorized! Check your credentials.');
        } else {
          toast.error('Something went wrong! Please try again.');
        }
      } else {
        toast.error('Network error! Please check your connection.');
      }
    }
  };

  return (
    <div className={bookSlotCSS.bookingForm}>
      <h2>Booking the Slot</h2>
      <p>Note: The slot will be booked for this week only</p>
      <h3>Resource: {resourceName}</h3>
      <h5>Day: {dayOfSlot}</h5>
      <h5>Start Time: {startTime}</h5>
      <h5>End Time: {endTime}</h5>

      <form onSubmit={handleSubmit}>
        <label>
          Subject:
          <input
            type="text"
            name="subject"
            value={bookingData.subject}
            onChange={handleInputChange}
            className={bookSlotCSS.inputField}
          />
        </label>
        <label>
          Year of Students:
          <input
            type="text"
            name="yearOfStudents"
            value={bookingData.yearOfStudents}
            onChange={handleInputChange}
            className={bookSlotCSS.inputField}
          />
        </label>
        <label>
          Division of Students:
          <input
            type="text"
            name="divisionOfStudents"
            value={bookingData.divisionOfStudents}
            onChange={handleInputChange}
            className={bookSlotCSS.inputField}
          />
        </label>
        <label>
          Batch of Students:
          <input
            type="text"
            name="batchOfStudents"
            value={bookingData.batchOfStudents}
            onChange={handleInputChange}
            className={bookSlotCSS.inputField}
          />
        </label>
        <label>
          Branch of Students:
          <input
            type="text"
            name="branchOfStudents"
            value={bookingData.branchOfStudents}
            onChange={handleInputChange}
            className={bookSlotCSS.inputField}
          />
        </label>
        <label>
          Faculty Name:
          <input
            type="text"
            name="facultyName"
            value={bookingData.facultyName}
            onChange={handleInputChange}
            className={bookSlotCSS.inputField}
            disabled
          />
        </label>

        <button type="submit" className={bookSlotCSS.submitButton}>
          Book Slot
        </button>
      </form>
    </div>
  );
};

export default BookingFormPage;
