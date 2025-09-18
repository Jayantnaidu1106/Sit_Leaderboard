import React, { useState } from 'react';
import axios from 'axios';
import './Leaderboard.css';
import Leaderboard from './Leaderboard';

function Home() {
  const [form, setForm] = useState({ name: '', password: '', leetcodeusername: '' });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      const response = await axios.post('http://localhost:5000/signup', form);
      setForm({ name: '', password: '', leetcodeusername: '' });
      // Refresh the leaderboard
      const leaderboardResponse = await axios.get('http://localhost:5000/leaderboard');
      setUsers(leaderboardResponse.data);
    } catch (error) {
      alert(error.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false); // Stop loading
    }
  };


  return (
    <div className="home-container">
     
      <Leaderboard/>
    </div>
  );
}

export default Home;

