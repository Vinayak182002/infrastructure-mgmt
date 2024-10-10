import React, { useState, useEffect, useRef } from 'react';
import useResourceData from '../../components/getResourceData/useResourceData';
import useAdminData from '../../components/getAdminData/useAdminData';
import './adminDashboard.css';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register the required components with Chart.js
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function AdminDashboard() {
  const authToken = localStorage.getItem('tokenAdmin');
  const { admin, loading, error } = useAdminData(authToken); // Get loading and error states
  const { allClassrooms, allLabs, allHalls, getUtilizationData } = useResourceData();
  
  const [utilizationData, setUtilizationData] = useState({
    classrooms: [],
    labs: [],
    halls: []
  });

  const fetchedDataRef = useRef({
    classrooms: false,
    labs: false,
    halls: false
  });

  useEffect(() => {
    const fetchUtilizationData = async () => {
      if (allClassrooms.length > 0 && !fetchedDataRef.current.classrooms) {
        await fetchUtilizationForResources(allClassrooms, 'classrooms');
        fetchedDataRef.current.classrooms = true;
      }
      if (allLabs.length > 0 && !fetchedDataRef.current.labs) {
        await fetchUtilizationForResources(allLabs, 'labs');
        fetchedDataRef.current.labs = true;
      }
      if (allHalls.length > 0 && !fetchedDataRef.current.halls) {
        await fetchUtilizationForResources(allHalls, 'halls');
        fetchedDataRef.current.halls = true;
      }
    };

    fetchUtilizationData();
  }, [allClassrooms, allLabs, allHalls]);

  const fetchUtilizationForResources = async (resources, resourceType) => {
    const utilizationArray = [];
    for (let resource of resources) {
      if (resource.name) {
        try {
          const data = await getUtilizationData(resource.name);
          const utilizationPercentage = parseFloat(data.utilizationPercentage.replace('%', '')) || 0;
          utilizationArray.push(utilizationPercentage);
        } catch (error) {
          console.error(`Error fetching utilization data for ${resource.name}:`, error);
        }
      }
    }

    setUtilizationData((prevData) => ({
      ...prevData,
      [resourceType]: utilizationArray,
    }));
  };

  const renderBarChart = (resources, utilizationPercentages, type) => {
    const resourceNames = resources.map((resource) => resource.name);
    
    const data = {
      labels: resourceNames,
      datasets: [
        {
          label: `${type} Utilization (%)`,
          data: utilizationPercentages,
          backgroundColor: '#1f4e79',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };

    const options = {
      maintainAspectRatio: false, // Prevent default aspect ratio to enable responsive height
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            stepSize: 20, // Set the gap between ticks to 20
          },
        },
        x: {
          ticks: {
            autoSkip: false, // Show all labels, even if they overlap
            maxRotation: 90, // Rotate labels if necessary
            minRotation: 45, // Minimum rotation for labels
          },
        },
      },
      elements: {
        bar: {
          borderWidth: 2,
        },
      },
      responsive: true, // Make chart responsive
    };

    return (
      <div className="chart-container">
        <Bar data={data} options={options} />
      </div>
    );
  };

  if (loading) return <div>Loading...</div>; // Show loading state
  if (error) return <div>Error: {error}</div>; // Show error state

  return (
    <div className="admin-dashboard">
      <h1>Welcome {admin.name || 'Admin'}</h1>

      <div className="charts">
        <h2>Classroom Utilization</h2>
        {renderBarChart(allClassrooms, utilizationData.classrooms, 'Classrooms')}

        <h2>Lab Utilization</h2>
        {renderBarChart(allLabs, utilizationData.labs, 'Labs')}

        <h2>Hall Utilization</h2>
        {renderBarChart(allHalls, utilizationData.halls, 'Halls')}
      </div>
    </div>
  );
}
