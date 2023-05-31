import React, { useState } from 'react';
import './App.css';

function App() {
  const [task, setTask] = useState({title: '', date: '', priority: ''});
  const [tasks, setTasks] = useState([]);

  const handleChange = e => {
    const {name, value} = e.target;
    setTask(prevTask => ({
      ...prevTask,
      [name]: value
    }));
  };

  const addTask = e => {
    e.preventDefault();
    setTasks([...tasks, task]);
    setTask({title: '', date: '', priority: ''});
  };

  const removeTask = index => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  const sortedTasks = tasks.sort((a,b) => new Date(b.date) - new Date(a.date) || b.priority - a.priority);

  return (
    <div className="App">
      <form onSubmit={addTask}>
        <input name="title" value={task.title} onChange={handleChange} placeholder="Task" required/>
        <input type="date" name="date" value={task.date} onChange={handleChange} required/>
        <input type="number" name="priority" value={task.priority} onChange={handleChange} placeholder="Priority" required/>
        <button type="submit">Add Task</button>
      </form>
      {sortedTasks.map((task, index) => (
        <div key={index}>
          <h3>{task.title}</h3>
          <p>{new Date(task.date).toDateString()}</p>
          <p>{task.priority}</p>
          <button onClick={() => removeTask(index)}>Remove Task</button>
        </div>
      ))}
    </div>
  );
}

export default App;

