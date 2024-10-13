import React, { useState, useEffect } from 'react';
import createResourceCSS from './createResource.module.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { SERVERHOST } from '../../constant/constant';
import { useNavigate } from 'react-router-dom';

const CreateResource = () => {
  const navigate = useNavigate();
  const [resourceData, setResourceData] = useState({
    name: '',
    type: 'Classroom',
    capacity: 80, // Default capacity for Classroom
    weeklySchedule: [
      { day: 'Monday', slots: [] },
      { day: 'Tuesday', slots: [] },
      { day: 'Wednesday', slots: [] },
      { day: 'Thursday', slots: [] },
      { day: 'Friday', slots: [] },
      { day: 'Saturday', slots: [] },
    ],
  });

  const timeSlots = [...Array(10).keys()].map((i) => ({
    startTime: `${i + 8}:00`,
    endTime: `${i + 9}:00`,
  }));

  const initializeSlots = () => {
    const updatedSchedule = resourceData.weeklySchedule.map((schedule) => ({
      ...schedule,
      slots: timeSlots.map((slot) => ({
        startTime: slot.startTime,
        endTime: slot.endTime,
        subject: '',
        yearOfStudents: '',
        divisionOfStudents: '',
        batchOfStudents: '',
        branchOfStudents: '',
        facultyName: '',
        isBooked: false,
        bookedByAdmin: false,
      })),
    }));
    setResourceData({ ...resourceData, weeklySchedule: updatedSchedule });
  };

  useEffect(() => {
    initializeSlots();
  }, []);

  useEffect(() => {
    // Set capacity based on type
    const capacityMapping = {
      Classroom: 80,
      Lab: 30,
      Hall: 150,
    };
    setResourceData((prev) => ({
      ...prev,
      capacity: capacityMapping[prev.type], // Set capacity based on selected type
    }));
  }, [resourceData.type]);

  const handleChange = (e, dayIndex, slotIndex, field) => {
    const updatedSchedule = [...resourceData.weeklySchedule];
    updatedSchedule[dayIndex].slots[slotIndex][field] = e.target.value;

    if (field === 'subject' && e.target.value) {
      updatedSchedule[dayIndex].slots[slotIndex].isBooked = true;
      updatedSchedule[dayIndex].slots[slotIndex].bookedByAdmin = true;
    }

    setResourceData({ ...resourceData, weeklySchedule: updatedSchedule });
  };

  const handleClear = () => {
    setResourceData({
      name: '',
      type: 'Classroom',
      capacity: 80, // Reset to default capacity for Classroom
      weeklySchedule: [
        { day: 'Monday', slots: [] },
        { day: 'Tuesday', slots: [] },
        { day: 'Wednesday', slots: [] },
        { day: 'Thursday', slots: [] },
        { day: 'Friday', slots: [] },
        { day: 'Saturday', slots: [] },
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submittedData = {
      ...resourceData,
      capacity: Number(resourceData.capacity), // Ensure the capacity is a number
    };

    try {
      const response = await axios.post(
        `${SERVERHOST}/api/infra-mgmt-app/auth/admin-1987/create-resource`,
        submittedData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      // console.log(response);
      if (response.request.status === 200) {
        toast.success('Resource Created Successfully!!');
        navigate('/admin-dashboard');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          toast.error(
            error.response.data.extraDetails || error.response.data.message || 'All fields are required!'
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
    <div className={createResourceCSS.createResourceContainer}>
      <h2>Create a New Resource</h2>
      <form onSubmit={handleSubmit} className={createResourceCSS.resourceForm}>
        <div className={createResourceCSS.formGroup}>
          <label htmlFor="name">Resource Name</label>
          <input
            type="text"
            id="name"
            value={resourceData.name}
            onChange={(e) =>
              setResourceData({ ...resourceData, name: e.target.value })
            }
            placeholder="Enter resource name"
            required
          />
        </div>

        <div className={createResourceCSS.formGroup}>
          <label htmlFor="type">Type</label>
          <select
            id="type"
            value={resourceData.type}
            onChange={(e) =>
              setResourceData({ ...resourceData, type: e.target.value })
            }
          >
            <option value="Classroom">Classroom</option>
            <option value="Lab">Lab</option>
            <option value="Hall">Hall</option>
          </select>
        </div>

        <div className={createResourceCSS.formGroup}>
          <label htmlFor="capacity">Capacity</label>
          <input
            type="number"
            id="capacity"
            value={resourceData.capacity}
            readOnly // Make the field non-editable
          />
        </div>

        <h3>Weekly Schedule</h3>
        <p>
          Note: If the details for the slot are not entered, it will be considered a free slot.
        </p>
        <table className={createResourceCSS.scheduleTable}>
          <thead>
            <tr>
              <th>Time</th>
              {resourceData.weeklySchedule.map((schedule) => (
                <th key={schedule.day}>{schedule.day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((slot, slotIndex) => (
              <tr key={slotIndex}>
                <td>
                  {slot.startTime} - {slot.endTime}
                </td>
                {resourceData.weeklySchedule.map((schedule, dayIndex) => {
                  const currentSlot = schedule.slots[slotIndex] || {
                    subject: '',
                    yearOfStudents: '',
                    divisionOfStudents: '',
                    batchOfStudents: '',
                    branchOfStudents: '',
                    facultyName: '',
                  };
                  return (
                    <td key={schedule.day}>
                      <div className={createResourceCSS.slotInputs}>
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
                            handleChange(e, dayIndex, slotIndex, 'yearOfStudents')
                          }
                          placeholder="Year"
                        />
                        <input
                          type="text"
                          value={currentSlot.divisionOfStudents}
                          onChange={(e) =>
                            handleChange(e, dayIndex, slotIndex, 'divisionOfStudents')
                          }
                          placeholder="Division"
                        />
                        <input
                          type="text"
                          value={currentSlot.branchOfStudents}
                          onChange={(e) =>
                            handleChange(e, dayIndex, slotIndex, 'branchOfStudents')
                          }
                          placeholder="Branch"
                        />
                        <input
                          type="text"
                          value={currentSlot.batchOfStudents}
                          onChange={(e) =>
                            handleChange(e, dayIndex, slotIndex, 'batchOfStudents')
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
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div className={createResourceCSS.buttonContainer}>
          <button type="button" onClick={handleClear} className={createResourceCSS.clearButton}>
            Clear Form
          </button>
          <button type="submit" className={createResourceCSS.submitButton}>
            Create Resource
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateResource;
