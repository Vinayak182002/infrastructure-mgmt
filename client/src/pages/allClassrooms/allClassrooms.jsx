import React, { useState, useRef } from 'react';
import useResourceData from '../../components/getResourceData/useResourceData';
import allClassroomsCSS from './allClassrooms.module.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AllClassrooms = () => {
  const { allClassrooms } = useResourceData();
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedRow, setHighlightedRow] = useState(null);
  const rowRefs = useRef([]);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!searchTerm) {
      toast.error('Enter classroom name before searching!');
      return;
    }
    const matchedClassroom = allClassrooms.find(
      (classroom) => classroom.name.toLowerCase() === searchTerm.toLowerCase()
    );
    if (matchedClassroom) {
      const classroomId = matchedClassroom._id;
      setHighlightedRow(classroomId);

      // Scroll to the matched row
      const index = allClassrooms.findIndex((classroom) => classroom._id === classroomId);
      if (rowRefs.current[index]) {
        rowRefs.current[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Remove the highlight after 2 seconds
      setTimeout(() => {
        setHighlightedRow(null);
      }, 2000);
    } else {
      toast.error('No classroom found with that name. Remember to add CR suffix.');
    }
  };

  return (
    <div className={allClassroomsCSS['container']}>
      <h1 className={allClassroomsCSS['title']}>All Classrooms</h1>
      <div className={allClassroomsCSS['search-container']}>
        <input
          type="text"
          placeholder="Search by Classroom Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={allClassroomsCSS['search-input']}
        />
        <button onClick={handleSearch} className={allClassroomsCSS['search-button']}>
          Search
        </button>
      </div>
      {allClassrooms.length > 0 ? (
        <table className={allClassroomsCSS['table']}>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Classroom Name</th>
              <th>Capacity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allClassrooms.map((classroom, index) => (
              <tr
                key={classroom._id}
                className={highlightedRow === classroom._id ? allClassroomsCSS['highlight'] : ''}
                ref={(el) => (rowRefs.current[index] = el)} // Assign ref to each row
              >
                <td>{index + 1}</td>
                <td>{classroom.name}</td>
                <td>{classroom.capacity}</td>
                <td>
                  <button
                    onClick={() => navigate(`/admin-update-resource/${classroom.name}`)}
                    className={allClassroomsCSS['edit-button']}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No classrooms available.</p>
      )}
    </div>
  );
};

export default AllClassrooms;
