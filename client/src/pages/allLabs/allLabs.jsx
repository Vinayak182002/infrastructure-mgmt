import React, { useState, useRef } from 'react';
import useResourceData from '../../components/getResourceData/useResourceData';
import allLabsCSS from './allLabs.module.css'; // Import CSS Module
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AllLabs = () => {
  const { allLabs } = useResourceData();
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedRow, setHighlightedRow] = useState(null);
  const rowRefs = useRef([]);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!searchTerm) {
      toast.error('Enter lab name before searching!');
      return;
    }
    const matchedLab = allLabs.find(lab => lab.name.toLowerCase() === searchTerm.toLowerCase());
    if (matchedLab) {
      const labId = matchedLab._id;
      setHighlightedRow(labId);

      // Scroll to the matched row
      const index = allLabs.findIndex(lab => lab._id === labId);
      if (rowRefs.current[index]) {
        rowRefs.current[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Remove the highlight after 2 seconds
      setTimeout(() => {
        setHighlightedRow(null);
      }, 2000);
    } else {
      toast.error('No lab found with that name.');
    }
  };

  return (
    <div className={allLabsCSS['container']}>
      <h1 className={allLabsCSS['title']}>All Labs</h1>
      <div className={allLabsCSS['search-container']}>
        <input 
          type="text" 
          placeholder="Search by Lab Name" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className={allLabsCSS['search-input']}
        />
        <button onClick={handleSearch} className={allLabsCSS['search-button']}>
          Search
        </button>
      </div>
      {allLabs.length > 0 ? (
        <table className={allLabsCSS['table']}>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Lab Name</th>
              <th>Capacity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allLabs.map((lab, index) => (
              <tr 
                key={lab._id} 
                className={highlightedRow === lab._id ? allLabsCSS['highlight'] : ''}
                ref={el => rowRefs.current[index] = el} // Assign ref to each row
              >
                <td>{index + 1}</td>
                <td>{lab.name}</td>
                <td>{lab.capacity}</td>
                <td>
                  <button 
                    onClick={() => navigate(`/admin-update-resource/${lab.name}`)} 
                    className={allLabsCSS['edit-button']}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No labs data available.</p>
      )}
    </div>
  );
};

export default AllLabs;
