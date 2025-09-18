import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Leaderboard.css';

function CurrentContestLeaderboard() {
  const [contestUsers, setContestUsers] = useState([]);

  useEffect(() => {
    const fetchContestLeaderboard = async () => {
      try {
        const response = await axios.get('http://localhost:5000/contest-leaderboard');
        setContestUsers(response.data);
      } catch (error) {
        console.error('Error fetching contest leaderboard:', error);
      }
    };

    fetchContestLeaderboard();
  }, []);

  return (
    <div className="leaderboard-container">
      <h1 className="leaderboard-title">Current Contest Leaderboard</h1>
      <div className="table-container">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Username</th>
              <th>Contest Score</th>
            </tr>
          </thead>
          <tbody>
            {contestUsers.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.leetcodeusername}</td>
                <td>{user.contestScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CurrentContestLeaderboard;
