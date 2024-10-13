import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import './updateResource.css';
import { SERVERHOST } from '../../constant/constant';

const UpdateResource = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resourceName } = useParams();

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    capacity: 0,
    weeklySchedule: [],
  });

  const timeSlots = [...Array(10).keys()].map((i) => ({
    startTime: `${i + 8}:00`,
    endTime: `${i + 9}:00`,
  }));

  // Fetch resource data from the backend
  useEffect(() => {
    const fetchResourceData = async () => {
      try {
        const response = await axios.get(
          `${SERVERHOST}/api/infra-mgmt-app/auth/get-resource/${resourceName}`
        );
        setFormData({
          name: response.data.resourceDetails.name || '',
          type: response.data.resourceDetails.type || '',
          capacity: response.data.resourceDetails.capacity || 0,
          weeklySchedule: response.data.resourceDetails.weeklySchedule || [],
        });
      } catch (error) {
        toast.error('Error fetching resource data');
        console.error(error);
      }
    };

    if (resourceName) {
      fetchResourceData();
    }
  }, [resourceName]);

  const handleChange = (e, dayIndex, slotIndex, field) => {
    const updatedSchedule = [...formData.weeklySchedule];
    updatedSchedule[dayIndex].slots[slotIndex][field] = e.target.value;

    // Update isBooked based on whether the subject field is filled
    if (field === 'subject' && e.target.value) {
      updatedSchedule[dayIndex].slots[slotIndex].isBooked = true;
      updatedSchedule[dayIndex].slots[slotIndex].bookedByAdmin = true;
    } else if (field === 'subject' && !e.target.value) {
      updatedSchedule[dayIndex].slots[slotIndex].isBooked = false;
    }

    setFormData({ ...formData, weeklySchedule: updatedSchedule });
  };

  const handleFreeSlot = (dayIndex, slotIndex) => {
    const updatedSchedule = [...formData.weeklySchedule];
    const currentSlot = updatedSchedule[dayIndex].slots[slotIndex];

    // Clear all fields
    currentSlot.subject = '';
    currentSlot.yearOfStudents = '';
    currentSlot.divisionOfStudents = '';
    currentSlot.batchOfStudents = '';
    currentSlot.branchOfStudents = '';
    currentSlot.facultyName = '';

    // Free the slot
    currentSlot.isBooked = false;
    currentSlot.bookedByAdmin = false;

    setFormData({ ...formData, weeklySchedule: updatedSchedule });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    // console.log("Form Data before update:", formData); // Log form data
    try {
      // Send the updated data to the backend
      const response = await axios.post(
        `${SERVERHOST}/api/infra-mgmt-app/auth/admin-1987/update-resource/${resourceName}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.request.statusText === 'OK') {
        toast.success('Resource updated successfully!');
        navigate('/admin-dashboard');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          toast.error(
            error.response.data.extraDetails ||
            error.response.data.message ||
            'All fields are required!'
          );
        } else if (error.response.status === 401) {
          toast.error('Unauthorized! Check your credentials.');
        } else {
          toast.error('Something went wrong! Please try again.');
        }
      } else {
        toast.error('Network error! Please check your connection.');
      }
      console.log('Updating resource error', error);
    }
  };

  return (
    <div className="update-resource-container">
      <h1>Update Resource - {formData.name}</h1>
      <form onSubmit={handleUpdate}>
        <div>
          <label>Resource Name:</label>
          <input type="text" value={formData.name} readOnly />
        </div>
        <div>
          <label>Resource Type:</label>
          <input type="text" value={formData.type} readOnly />
        </div>
        <div>
          <label>Capacity:</label>
          <input
            type="number"
            value={formData.capacity}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              setFormData({ ...formData, capacity: isNaN(value) ? 0 : value });
            }}
          />
        </div>
        <h2>Weekly Schedule</h2>
        <p>
          Note: If the details for the slot are not entered, it will be
          considered a free slot.
        </p>
        <table className="schedule-table">
          <thead>
            <tr>
              <th>Day/Time</th>
              {timeSlots.map((slot, slotIndex) => (
                <th key={slotIndex}>
                  {slot.startTime} - {slot.endTime}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {formData.weeklySchedule.map((schedule, dayIndex) => (
              <tr key={schedule.day}>
                <td>{schedule.day}</td>
                {timeSlots.map((slot, slotIndex) => {
                  const currentSlot = schedule.slots[slotIndex] || {
                    subject: '',
                    yearOfStudents: '',
                    divisionOfStudents: '',
                    batchOfStudents: '',
                    branchOfStudents: '',
                    facultyName: '',
                    isBooked: false,
                    bookedByAdmin: false,
                  };
                  return (
                    <td key={slotIndex}>
                      <div className="slot-inputs">
                        <input
                          type="text"
                          value={currentSlot.subject}
                          onChange={(e) =>
                            handleChange(e, dayIndex, slotIndex, 'subject')
                          }
                          placeholder="Subject (optional)"
                        />
                        <input
                          type="text"
                          value={currentSlot.yearOfStudents}
                          onChange={(e) =>
                            handleChange(
                              e,
                              dayIndex,
                              slotIndex,
                              'yearOfStudents'
                            )
                          }
                          placeholder="Year"
                        />
                        <input
                          type="text"
                          value={currentSlot.divisionOfStudents}
                          onChange={(e) =>
                            handleChange(
                              e,
                              dayIndex,
                              slotIndex,
                              'divisionOfStudents'
                            )
                          }
                          placeholder="Division"
                        />
                        <input
                          type="text"
                          value={currentSlot.branchOfStudents}
                          onChange={(e) =>
                            handleChange(
                              e,
                              dayIndex,
                              slotIndex,
                              'branchOfStudents'
                            )
                          }
                          placeholder="Branch"
                        />
                        <input
                          type="text"
                          value={currentSlot.batchOfStudents}
                          onChange={(e) =>
                            handleChange(
                              e,
                              dayIndex,
                              slotIndex,
                              'batchOfStudents'
                            )
                          }
                          placeholder="Batch (optional)"
                        />
                        <input
                          type="text"
                          value={currentSlot.facultyName}
                          onChange={(e) =>
                            handleChange(e, dayIndex, slotIndex, 'facultyName')
                          }
                          placeholder="Faculty Name"
                        />
                        {currentSlot.isBooked && (
                          <button
                            type="button"
                            onClick={() => handleFreeSlot(dayIndex, slotIndex)}
                          >
                            Clear this Slot
                          </button>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <button type="submit">Update Resource</button>
      </form>
    </div>
  );
};

export default UpdateResource;
