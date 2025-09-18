import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Leaderboard.css';

function AllTimeContestLeaderboard() {
  const [allTimeContestUsers, setAllTimeContestUsers] = useState([]);

  useEffect(() => {
    const fetchAllTimeContestLeaderboard = async () => {
      try {
        const response = await axios.get('http://localhost:5000/all-time-contest-leaderboard');
        setAllTimeContestUsers(response.data);
      } catch (error) {
        console.error('Error fetching all-time contest leaderboard:', error);
      }
    };

    fetchAllTimeContestLeaderboard();
  }, []);

  return (
    <div className="leaderboard-container">
      <h1 className="leaderboard-title">All Time Contest Leaderboard</h1>
      <div className="table-container">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Username</th>
              <th>All Time Contest Score</th>
            </tr>
          </thead>
          <tbody>
            {allTimeContestUsers.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.leetcodeusername}</td>
                <td>{user.allTimeContestScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AllTimeContestLeaderboard;
