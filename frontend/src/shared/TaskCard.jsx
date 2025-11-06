import React, { useState } from 'react';
import axios from '../api/axiosInstance';

const colorFor = (p) =>
  p === 'high'
    ? '#ffd6d6'
    : p === 'medium'
    ? '#fff2cc'
    : '#e6fff2';

export default function TaskCard({ task, onDelete }) {
  const [priority, setPriority] = useState(task.priority);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [saving, setSaving] = useState(false);

  const del = async () => {
    if (!confirm('Delete task?')) return;
    try {
      await axios.delete(`/tasks/${task._id}`);
      onDelete && onDelete(task._id);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const toggleStatus = async () => {
    try {
      const newStatus = task.status === 'pending' ? 'completed' : 'pending';
      await axios.put(`/tasks/${task._id}`, { status: newStatus });
      window.location.reload(); // optional: can replace with state update
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`/tasks/${task._id}`, { title, description, priority });
      console.log("✅ Task updated successfully");
      setEditing(false);
      window.location.reload(); // or call fetchTasks() if passed from parent
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        padding: 12,
        borderRadius: 8,
        background: colorFor(priority),
        boxShadow: '0 0 6px rgba(0,0,0,0.06)',
      }}
    >
      {editing ? (
        <>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', marginBottom: 6, padding: 6 }}
          />
          <textarea
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '100%', marginBottom: 6, padding: 6 }}
          ></textarea>

          <div>
            <label>Priority: </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={{ padding: 4 }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            <button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </>
      ) : (
        <>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <p style={{ margin: '6px 0' }}>{description}</p>
          <div style={{ fontSize: 13 }}>
            Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
          </div>
          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            <button onClick={toggleStatus}>
              {task.status === 'pending' ? 'Mark Completed' : 'Mark Pending'}
            </button>
            <button onClick={() => setEditing(true)}>✏️ Edit</button>
            <button onClick={del}>🗑 Delete</button>
          </div>
        </>
      )}
    </div>
  );
}
