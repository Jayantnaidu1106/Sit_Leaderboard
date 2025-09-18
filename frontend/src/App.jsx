import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import CurrentContestLeaderboard from './components/CurrentContestLeaderboard';
import AllTimeContestLeaderboard from './components/AllTimeContestLeaderboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/current-contest-leaderboard" element={<CurrentContestLeaderboard />} />
        <Route path="/all-time-contest-leaderboard" element={<AllTimeContestLeaderboard />} />
      </Routes>
    </Router>
  );
}

export default App;
