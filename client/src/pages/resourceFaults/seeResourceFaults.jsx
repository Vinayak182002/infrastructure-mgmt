import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './seeResourceFaults.css'; // Optional: Add your CSS styles here
import { SERVERHOST } from '../../constant/constant';
import { toast } from 'react-toastify'; // Import toast for error notifications

export default function SeeResourceFaults() {
  const [faultsPending, setFaultsPending] = useState([]);
  const [faultsResolved, setFaultsResolved] = useState([]);
  const navigate = useNavigate();

  const fetchResourceFaults = async () => {
    try {
      const response = await fetch(
        `${SERVERHOST}/api/infra-mgmt-app/auth/admin-1987/resource-faults`,
        {
          method: 'POST',
        }
      );

      if (response.ok) {
        const data = await response.json();
        setFaultsPending(data.faultReportsPending);
        setFaultsResolved(data.faultReportsResolved); // Store the fetched fault reports
      } else {
        const errorData = await response.json();
        toast.error(errorData.message); // Notify user of error
      }
    } catch (error) {
      toast.error('Network error! Please check your connection.');
    }
  };

  useEffect(() => {
    fetchResourceFaults();
  }, []);


  return (
    <div className="faults-container container">
      <h2>Resource Faults</h2>
      
      {/* Pending Faults Table */}
      <h3>Pending Faults</h3>
      <table className="faults-table">
        <thead>
          <tr>
            <th>Sr. No</th>
            <th>Resource Name</th>
            <th>Fault Description</th>
            <th>Reported By</th>
            <th>Status</th>
            <th>Reported At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {faultsPending.map((fault, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{fault.resourceName}</td>
              <td>{fault.faultDescription}</td>
              <td>{fault.reportedBy}</td>
              <td>{fault.status}</td>
              <td>{new Date(fault.reportedAt).toLocaleString()}</td>
              <td>
                <button onClick={() => navigate(`/admins-update-resources-fault/${fault._id}`)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Resolved Faults Table */}
      <h3>Resolved Faults</h3>
      <table className="faults-table">
        <thead>
          <tr>
            <th>Sr. No</th>
            <th>Resource Name</th>
            <th>Fault Description</th>
            <th>Reported By</th>
            <th>Status</th>
            <th>Reported At</th>
            <th>Remarks</th>
            <th>Resolved At</th>
          </tr>
        </thead>
        <tbody>
          {faultsResolved.map((fault, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{fault.resourceName}</td>
              <td>{fault.faultDescription}</td>
              <td>{fault.reportedBy}</td>
              <td>{fault.status}</td>
              <td>{new Date(fault.reportedAt).toLocaleString()}</td>
              <td>{fault.resolutionDetails.remarks}</td>
              <td>{new Date(fault.resolutionDetails.resolvedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
