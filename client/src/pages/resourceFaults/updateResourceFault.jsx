import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SERVERHOST } from '../../constant/constant'; // Adjust the import according to your project structure
import './updateResourceFault.css'; // Optional: Add your CSS styles here
import useAdminData from '../../components/getAdminData/useAdminData'; // Ensure this hook is fetching the admin data correctly

export default function UpdateResourceFault() {
  const authToken = localStorage.getItem('tokenAdmin');
  const { admin, loading, error } = useAdminData(authToken); // Fetch admin data using custom hook

  const { id } = useParams(); // Get the fault ID from the URL parameters
  const [resolvedBy, setResolvedBy] = useState(''); // Initialize the 'Resolved By' field
  const [remarks, setRemarks] = useState(''); // Initialize the remarks
  const navigate = useNavigate();

  useEffect(() => {
    if (admin && admin.name) {
      setResolvedBy(admin.name); // Set the admin name as resolvedBy
    }
  }, [admin]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!remarks) {
      toast.error('Please provide remarks before submitting.');
      return;
    }

    try {
      const response = await fetch(`${SERVERHOST}/api/infra-mgmt-app/auth/admin-1987/update-fault-report/${id}`, {
        method: 'POST', // Ensure that the method matches what the backend expects (POST or PUT)
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          faultId: id,  // Ensure that you pass the correct faultId
          resolvedBy,   // Send the resolvedBy value
          remarks,      // Send the remarks
        }),
      });

      if (response.ok) {
        toast.success('Fault status updated successfully!');
        navigate('/admin-resource-faults'); // Navigate back to the faults page
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to update the fault status.');
      }
    } catch (error) {
      console.error('Updating status error', error);
      toast.error('Network error! Please check your connection.');
    }
  };

  return (
    <div className="update-fault-container container">
      <h2>Update Resource Fault</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Resolved By:</label>
          <input
            type="text"
            value={admin?.name || resolvedBy} // Show admin name or resolvedBy value
            readOnly
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Remarks:</label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            required
            className="form-control"
          ></textarea>
        </div>
        <button type="submit" className="btn-submit">Update Status</button>
      </form>
    </div>
  );
}
