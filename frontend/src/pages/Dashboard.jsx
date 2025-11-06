import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import TaskForm from '../shared/TaskForm';
import TaskCard from '../shared/TaskCard';

export default function Dashboard(){
  const [tasks,setTasks]=useState([]);
  const [page,setPage]=useState(1);
  const [pages,setPages]=useState(1);
  const [loading,setLoading]=useState(false);

  const fetchTasks = async (p=1) => {
    try {
      setLoading(true);
      const res = await axios.get(`/tasks?page=${p}&limit=6`);
       console.log("Fetched page:", res.data.page, "of", res.data.pages); 
      setTasks(res.data.tasks);
      setPage(res.data.page);
      setPages(res.data.pages);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message);
    } finally { setLoading(false); }
  };

  useEffect(()=>{ fetchTasks(); }, []);

  const handleCreate = (task) => {
    setTasks(prev=>[task, ...prev]);
  }

  const handleDelete = (id) => {
    setTasks(prev=>prev.filter(t=>t._id !== id));
  }

  return (
    <div style={{padding:20}}>
      <h1>Tasks</h1>
      <TaskForm onCreate={handleCreate} />
      {loading ? <p>Loading...</p> : (
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:12, marginTop:12}}>
          {tasks.map(t => <TaskCard key={t._id} task={t} onDelete={handleDelete} />)}
        </div>
      )}

      <div style={{marginTop:12}}>
        <button type="button" onClick={()=>fetchTasks(Math.max(1,page-1))} disabled={ loading ||  page<=1}>Prev</button>
        <span style={{margin:'0 8px'}}>Page {page} / {pages}</span>
        <button type="button" onClick={()=>fetchTasks(Math.min(pages,page+1))} disabled={ loading || page>=pages}>Next</button>
      </div>
    </div>
  )
}
