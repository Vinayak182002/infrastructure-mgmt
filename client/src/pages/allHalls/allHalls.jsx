import React, { useState, useRef } from 'react';
import useResourceData from '../../components/getResourceData/useResourceData';
import allHallsCSS from './allHalls.module.css'; // Import CSS Module
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AllHalls = () => {
  const { allHalls } = useResourceData();
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedRow, setHighlightedRow] = useState(null);
  const rowRefs = useRef([]);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!searchTerm) {
      toast.error('Enter hall name before searching!');
      return;
    }
    const matchedHall = allHalls.find(hall => hall.name.toLowerCase() === searchTerm.toLowerCase());
    if (matchedHall) {
      const hallId = matchedHall._id;
      setHighlightedRow(hallId);

      // Scroll to the matched row
      const index = allHalls.findIndex(hall => hall._id === hallId);
      if (rowRefs.current[index]) {
        rowRefs.current[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Remove the highlight after 2 seconds
      setTimeout(() => {
        setHighlightedRow(null);
      }, 2000);
    } else {
      toast.error('No hall found with that name.');
    }
  };

  return (
    <div className={allHallsCSS['container']}>
      <h1 className={allHallsCSS['title']}>All Halls</h1>
      <div className={allHallsCSS['search-container']}>
        <input 
          type="text" 
          placeholder="Search by Hall Name" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className={allHallsCSS['search-input']}
        />
        <button onClick={handleSearch} className={allHallsCSS['search-button']}>
          Search
        </button>
      </div>
      {allHalls.length > 0 ? (
        <table className={allHallsCSS['table']}>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Hall Name</th>
              <th>Capacity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allHalls.map((hall, index) => (
              <tr 
                key={hall._id} 
                className={highlightedRow === hall._id ? allHallsCSS['highlight'] : ''}
                ref={el => rowRefs.current[index] = el} // Assign ref to each row
              >
                <td>{index + 1}</td>
                <td>{hall.name}</td>
                <td>{hall.capacity}</td>
                <td>
                  <button 
                    onClick={() => navigate(`/admin-update-resource/${hall.name}`)} 
                    className={allHallsCSS['edit-button']}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No halls data available.</p>
      )}
    </div>
  );
};

export default AllHalls;
