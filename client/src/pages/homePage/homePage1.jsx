import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserData from '../../components/getUserData/useUserData';
import useResourceData from '../../components/getResourceData/useResourceData';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import './homePage1.css';

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
  const [calendarEvents, setCalendarEvents] = useState([]);

  const resourceOptions = {
    Classroom: allClassrooms.map((classroom) => classroom.name),
    Lab: allLabs.map((lab) => lab.name),
    Hall: allHalls.map((hall) => hall.name),
  };

  useEffect(() => {
    if (specificResource) {
      getResourceDetails(specificResource);
    }
  }, [specificResource]);

  useEffect(() => {
    if (resourceDetails?.weeklySchedule) {
      const events = resourceDetails.weeklySchedule.map((daySchedule) => {
        return daySchedule.slots.map((slot, index) => ({
          title: slot.isBooked ? `Booked - ${slot.facultyName}` : 'Free Slot',
          start: `${daySchedule.day}T${slot.startTime}`,
          end: `${daySchedule.day}T${slot.endTime}`,
          backgroundColor: slot.isBooked ? '#ffcccc' : '#ccffcc',
          extendedProps: {
            isBooked: slot.isBooked,
            slot,
            day: daySchedule.day,
          },
        }));
      }).flat();
      setCalendarEvents(events);
    }
  }, [resourceDetails]);

  const handleResourceTypeChange = (e) => {
    setResourceType(e.target.value);
    setSpecificResource(''); // Reset specific resource when type changes
  };

  const handleSpecificResourceChange = (e) => {
    setSpecificResource(e.target.value);
  };

  const handleDateClick = (info) => {
    const { slot, day } = info.event.extendedProps;
    if (!slot.isBooked) {
      navigate('/booking-slot', {
        state: {
          resourceName: resourceDetails.name,
          startTime: slot.startTime,
          endTime: slot.endTime,
          facultyName: facUser.name,
          dayOfSlot: day,
        },
      });
    } else {
      alert("This slot is already booked.");
    }
  };

  return (
    <div className="home-page">
      <h1>Welcome, {facUser.name}</h1>

      <form className="resource-form">
        <label>
          Resource Type:
          <select value={resourceType} onChange={handleResourceTypeChange} required>
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
          <select value={specificResource} onChange={handleSpecificResourceChange} required disabled={!resourceType}>
            <option value="">Select Specific Resource</option>
            {resourceType &&
              resourceOptions[resourceType].map((resource) => (
                <option key={resource} value={resource}>
                  {resource}
                </option>
              ))}
          </select>
        </label>
      </form>

      <div className="calendar-container">
        {specificResource && (
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridWeek"
            events={calendarEvents}
            eventClick={handleDateClick}
            eventColor="#378006"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek,dayGridDay',
            }}
            eventDisplay="block"
            allDaySlot={false}
          />
        )}
      </div>
    </div>
  );
}
