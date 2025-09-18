import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Leaderboard.css';

function Leaderboard() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', password: '', leetcodeusername: '' });
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('http://localhost:5000/leaderboard');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchLeaderboard();
  }, []);

  const handleDelete = async (username) => {
    try {
      await axios.delete(`http://localhost:5000/del/${username}`);
      const leaderboardResponse = await axios.get('http://localhost:5000/leaderboard');
      setUsers(leaderboardResponse.data);
    } catch (error) {
      alert('Error deleting user');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      console.log('Submitting form:', { ...form, password: '[REDACTED]' });
      const response = await axios.post('http://localhost:5000/signup', form, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Registration successful:', response.data);
      setForm({ name: '', email: '', password: '', leetcodeusername: '' });
      // Refresh the leaderboard
      const leaderboardResponse = await axios.get('http://localhost:5000/leaderboard');
      setUsers(leaderboardResponse.data);
      alert('User registered successfully!');
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response?.data);
      alert(
        error.response?.data?.error || 
        error.response?.data?.message || 
        error.message || 
        'An unknown error occurred'
      );
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="leaderboard-container">
      <h2>Add User</h2>
      <form className="add-user-form" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input type="text" name="leetcodeusername" placeholder="LeetCode Username" value={form.leetcodeusername} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <button type="submit" className="add-user-button" disabled={loading}>
          {loading ? <div className="spinner"></div> : 'Add User'}
        </button>
      </form>
      <h1 className="leaderboard-title">Leaderboard</h1>
      <div className="table-container">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Username</th>
              <th>Score</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.leetcodeusername}</td>
                <td>{user.score}</td>
                <td>
                  <button className="delete-button" onClick={() => handleDelete(user.username)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="button-group">
        <button className="action-button" onClick={() => navigate('/current-contest-leaderboard')}>Current Contest Leaderboard</button>
        <button className="action-button" onClick={() => navigate('/all-time-contest-leaderboard')}>All Time Contest Leaderboard</button>
      </div>
    </div>
  );
}

export default Leaderboard;
