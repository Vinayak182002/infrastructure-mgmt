import React, { useState, useRef } from 'react';
import useResourceData from '../../components/getResourceData/useResourceData';
import './allHalls.css'; // Ensure to create this CSS file
import { toast } from 'react-toastify';

const AllHalls = () => {
  const { allHalls } = useResourceData();
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedRow, setHighlightedRow] = useState(null);
  const rowRefs = useRef([]);

  const handleEdit = (hallId) => {
    // Implement your edit logic here
    console.log(`Edit hall with ID: ${hallId}`);
  };

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
    <div className="container all-halls">
      <h1>All Halls</h1>
      <div className="search-container">
        <input 
          type="text" 
          placeholder="Search by Hall Name" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {allHalls.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>S.No</th> {/* Serial Number Column */}
              <th>Hall Name</th>
              <th>Capacity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allHalls.map((hall, index) => (
              <tr 
                key={hall._id} 
                className={highlightedRow === hall._id ? 'highlight' : ''}
                ref={el => rowRefs.current[index] = el} // Assign ref to each row
              >
                <td>{index + 1}</td> {/* Serial Number */}
                <td>{hall.name}</td>
                <td>{hall.capacity}</td>
                <td>
                  <button onClick={() => handleEdit(hall._id)}>Edit</button>
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
