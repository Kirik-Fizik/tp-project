import React from 'react';
import { observer } from 'mobx-react-lite';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/Home/HomePage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Profile from './components/Profile/Profile';
import Analytics from './components/Analytics/Analytics';
import Rules from './components/Rules/Rules';
import Donate from './components/Donate/Donate';

const App = observer(() => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
});

export default App;
