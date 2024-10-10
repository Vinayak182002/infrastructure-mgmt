import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserData from '../../components/getUserData/useUserData';
import useResourceData from '../../components/getResourceData/useResourceData';
import { SERVERHOST } from '../../constant/constant';
import { toast } from 'react-toastify';
import './reportFault.css'; // Import your CSS file for styling

export default function ReportFault() {
  const navigate = useNavigate();
  const authToken = localStorage.getItem('token');
  const facUser = useUserData(authToken);
  const { allClassrooms, allLabs, allHalls } = useResourceData();

  const [resourceType, setResourceType] = useState('');
  const [specificResource, setSpecificResource] = useState('');
  const [faultDescription, setFaultDescription] = useState('');
  const [faultReports, setFaultReports] = useState([]); // State to store fault reports

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
  };

  const handleDescriptionChange = (e) => {
    setFaultDescription(e.target.value);
  };

  const fetchFaultReports = async () => {
    try {
      const response = await fetch(
        `${SERVERHOST}/api/infra-mgmt-app/auth/get-resource-faults`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setFaultReports(data.faultReports); // Store the fetched fault reports
      } else {
        const errorData = await response.json();
        toast.error(errorData.message); // Notify user of error
      }
    } catch (error) {
      toast.error('Network error! Please check your connection.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const reportedBy = facUser.name;
      const response = await fetch(
        `${SERVERHOST}/api/infra-mgmt-app/auth/submit-fault-report`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            resourceName: specificResource,
            faultDescription,
            reportedBy,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message); // Notify user of success
        setFaultDescription('');
        setResourceType('');
        setSpecificResource('');
        await fetchFaultReports(); // Fetch updated fault reports after submission
      } else {
        const errorData = await response.json();
        toast.error(errorData.message); // Notify user of error
      }
    } catch (error) {
      toast.error('Network error! Please check your connection.');
    }
  };

  // Fetch fault reports when the component mounts
  useEffect(() => {
    fetchFaultReports();
  }, []); // Empty dependency array to run only once on mount

  return (
    <>
      <div className="report-fault">
        <h1>Report Resource Fault</h1>
        <form onSubmit={handleSubmit} className="fault-form">
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

          <label>
            Fault Description:
            <textarea
              value={faultDescription}
              onChange={handleDescriptionChange}
              rows="4"
            />
          </label>

          <label>
            Faculty Name:
            <input type="text" value={facUser.name} disabled />
          </label>

          <button type="submit">Report Fault</button>
        </form>
      </div>
      <div className="container">
        <h2>Fault Reports</h2>
        {faultReports.length > 0 ? (
          <table className="fault-reports-table">
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Resource Name</th>
                <th>Fault Description</th>
                <th>Reported At</th>
                <th>Status</th>
                <th>Resolved By</th>
                <th>Remarks</th>
                <th>Resolved At</th>
              </tr>
            </thead>
            <tbody>
              {faultReports.map((report, index) => (
                <tr key={report._id}>
                  <td>{index + 1}</td>
                  <td>{report.resourceName}</td>
                  <td>{report.faultDescription}</td>
                  <td>{new Date(report.reportedAt).toLocaleString()}</td>
                  <td>{report.status}</td>
                  <td>
                    {report.status === 'Resolved' // Check for "Resolved" (case-sensitive)
                      ? report.resolutionDetails?.resolvedBy // Optional chaining
                        ?
                            report.resolutionDetails.resolvedBy
                        : 'Not Resolved'
                      : 'Not Resolved'}{' '}
                  </td>
                  <td>
                    {report.status === 'Resolved' // Check for "Resolved" (case-sensitive)
                      ? report.resolutionDetails?.remarks // Optional chaining
                        ?
                            report.resolutionDetails.remarks
                        : 'Not Resolved'
                      : 'Not Resolved'}{' '}
                  </td>
                  <td>
                    {report.status === 'Resolved' // Check for "Resolved" (case-sensitive)
                      ? report.resolutionDetails?.resolvedAt // Optional chaining
                        ? new Date(
                            report.resolutionDetails.resolvedAt
                          ).toLocaleString() // Format date if it exists
                        : 'Not Resolved'
                      : 'Not Resolved'}{' '}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No fault reports found.</p>
        )}
      </div>
    </>
  );
}
