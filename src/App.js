import React, { useState } from 'react';
import { TextField, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Container } from '@mui/material';
import Delete from '@mui/icons-material/Delete';

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
    <Container maxWidth="sm">
      <form onSubmit={addTask}>
        <TextField 
          name="title" 
          value={task.title} 
          onChange={handleChange} 
          placeholder="Task" 
          required 
          fullWidth 
          style={{ margin: "10px 0" }}
        />
        <TextField 
          type="date" 
          name="date" 
          value={task.date} 
          onChange={handleChange} 
          required 
          fullWidth 
          style={{ margin: "10px 0" }}
        />
        <TextField 
          type="number" 
          name="priority" 
          value={task.priority} 
          onChange={handleChange} 
          placeholder="Priority" 
          required 
          fullWidth 
          style={{ margin: "10px 0" }}
        />
        <Button variant="contained" color="primary" type="submit">Add Task</Button>
      </form>
      <List>
        {sortedTasks.map((task, index) => (
          <ListItem key={index}>
            <ListItemText 
              primary={task.title} 
              secondary={`Date: ${new Date(task.date).toDateString()}, Priority: ${task.priority}`} 
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" onClick={() => removeTask(index)}>
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default App;

