// BookingFormPage.js
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SERVERHOST } from '../../constant/constant';
import './bookSlot.css';
import { toast } from 'react-toastify';

const BookingFormPage = () => {
  const navigate = useNavigate();
  const authToken = localStorage.getItem('token');
  // console.log(authToken);

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
      // console.log(response);
      if (response.statusText === 'OK') {
        toast.success(response.data.message);
        navigate('/dashboard');
      } else {
        toast(response.message);
      }

      // If the booking is successful, redirect to a confirmation page or show a success message
      // history.push('/confirmation');
    } catch (error) {
      // console.log(error);
      if (error.response) {
        // Handling errors from the server response
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
        // Handle network or other errors
        toast.error('Network error! Please check your connection.');
      }
    }
  };

  return (
    <div className="booking-form">
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
          />
        </label>
        <label>
          Year of Students:
          <input
            type="text"
            name="yearOfStudents"
            value={bookingData.yearOfStudents}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Division of Students:
          <input
            type="text"
            name="divisionOfStudents"
            value={bookingData.divisionOfStudents}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Batch of Students:
          <input
            type="text"
            name="batchOfStudents"
            value={bookingData.batchOfStudents}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Branch of Students:
          <input
            type="text"
            name="branchOfStudents"
            value={bookingData.branchOfStudents}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Faculty Name:
          <input
            type="text"
            name="facultyName"
            value={bookingData.facultyName}
            onChange={handleInputChange}
            disabled
          />
        </label>

        <button type="submit">Book Slot</button>
      </form>
    </div>
  );
};

export default BookingFormPage;
