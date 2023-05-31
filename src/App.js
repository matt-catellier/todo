import React, { useState, useEffect, useCallback } from 'react';
import { TextField, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Container } from '@mui/material';
import Delete from '@mui/icons-material/Delete';
import { useForm, Controller } from 'react-hook-form';
import { createClient } from 'contentful-management';
import * as dotenv from'dotenv'

dotenv.config()

const client = createClient({
  accessToken: process.env.ACCESS_TOKEN // replace with your Access Token
});

function App() {
  const { handleSubmit, control, reset } = useForm();
  const [tasks, setTasks] = useState([]);
  const [space, setSpace] = useState()

  useEffect(() => {
    const getSpace = async () => {
      const space = await client.getSpace(process.env.SPACE_ID)
      setSpace(space)
    }
    getSpace()
  }, [])

  useEffect(() => {
    const fetchTasks = async () => {
      if(space) {
        const response = await space.getEntries({ content_type: 'task' });
        setTasks(response.items.map(item => item.fields));
      }
    };
    fetchTasks();
  }, [space]);

  const onSubmit = useCallback(
    async data => {
      const response = await space.createEntry('task', {
        fields: data
      });
      setTasks([...tasks, response.fields]);
      reset();
  }, [space, reset, tasks])

  const removeTask = async index => {
    const task = tasks[index];
    await client.deleteEntry(task.sys.id);
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  const sortedTasks = tasks.sort((a,b) => new Date(b.date) - new Date(a.date) || b.priority - a.priority);

  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="title"
          control={control}
          defaultValue=""
          rules={{ required: true }}
          render={({ field }) => 
            <TextField 
              {...field}
              placeholder="Task" 
              required 
              fullWidth 
              style={{ margin: "10px 0" }}
            />
          }
        />
        <Controller
          name="date"
          control={control}
          defaultValue=""
          rules={{ required: true }}
          render={({ field }) => 
            <TextField 
              {...field}
              type="date"
              required 
              fullWidth 
              style={{ margin: "10px 0" }}
            />
          }
        />
        <Controller
          name="priority"
          control={control}
          defaultValue=""
          rules={{ required: true }}
          render={({ field }) => 
            <TextField 
              {...field}
              type="number"
              placeholder="Priority" 
              required 
              fullWidth 
              style={{ margin: "10px 0" }}
            />
          }
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