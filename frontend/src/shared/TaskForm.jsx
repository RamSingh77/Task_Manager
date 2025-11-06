import React, { useState } from 'react';
import axios from '../api/axiosInstance';

export default function TaskForm({ onCreate }){
  const [title,setTitle]=useState('');
  const [description,setDescription]=useState('');
  const [dueDate,setDueDate]=useState('');
  const [priority,setPriority]=useState('medium');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/tasks', { title, description, dueDate, priority });
      onCreate && onCreate(data);
      setTitle(''); setDescription(''); setDueDate(''); setPriority('medium');
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  }

  return (
    <form onSubmit={submit} style={{display:'grid', gap:8, maxWidth:600}}>
      <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
      <textarea placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
      <input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} />
      <select value={priority} onChange={e=>setPriority(e.target.value)}>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <button type="submit">Create Task</button>
    </form>
  )
}
