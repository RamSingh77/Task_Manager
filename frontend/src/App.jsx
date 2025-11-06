import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

export default function App(){
  return (
    <div>
      <nav style={{padding:10, borderBottom:'1px solid #ddd'}}>
        <Link to="/" style={{marginRight:10}}>Home</Link>
        <Link to="/login" style={{marginRight:10}}>Login</Link>
        <Link to="/register">Register</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
      </Routes>
    </div>
  )
}
