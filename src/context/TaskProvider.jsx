
import React, { useState } from 'react';
import TaskContext from './TaskContext';
import axios from 'axios';

const TaskProvider = ({ children }) => {
  const apiUrl = import.meta.env.VITE_REACT_API_URL;
  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]); 


  //  fetch all tasks
  const fetchAllTasks = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/task/getalltasks`, {
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token")
        }
      });
      console.log("All tasks fetched successfully:", response.data);
      
      if (Array.isArray(response.data)) {
        setAllTasks(response.data);
        return { success: true, tasks: response.data };
      }
      
      console.error('Invalid response format:', response.data);
      return { success: false, error: "Invalid data format received" };
    } catch (err) {
      console.error("Error fetching all tasks:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        return { success: false, error: "Please login to view tasks" };
      }
      return { 
        success: false, 
        error: err.response?.data?.message || "Failed to fetch all tasks"
      };
    }
  };

  // Fetch logged-in user's tasks
  const fetchUserTasks = async () => {
    try {
    
      const response = await axios.get(`${apiUrl}/api/task/getusertask`, {
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token")
        },
      });
      
      console.log('user task Response:', response.data);
      if (Array.isArray(response.data)) {
        setTasks(response.data);
        return { success: true, tasks: response.data };
      }
      
      console.error('Invalid response format:', response.data);
      return { success: false, error: "Invalid data format received" };
    } catch (err) {
      console.error("Error fetching tasks:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        return { 
          success: false, 
          error: "Please login to view your tasks"
        };
      }
      return { 
        success: false, 
        error: err.response?.data?.message || "Failed to fetch tasks"
      };
    }
  };

  const addTask = async (taskData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return { success: false, error: "Please login to add tasks" };
      }

      const response = await axios.post(`${apiUrl}/api/task/addtask`, taskData, {
        headers: {
          "Content-Type": "application/json",
          "auth-token": token
        }
      });

      if (response.data && response.data.task) {
        setTasks(prevTasks => [...prevTasks, response.data.task]);
        return { success: true, task: response.data.task };
      }
      
      throw new Error("Invalid response format");
    } catch (err) {
      console.error("Error adding task:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        return { success: false, error: "Please login to add tasks" };
      }
      return { 
        success: false, 
        error: err.response?.data?.error || "Failed to add task"
      };
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return { success: false, error: "Please login to update tasks" };
      }

      const response = await axios.put(`${apiUrl}/api/task/updatetask/${id}`, taskData, {
        headers: {
          "Content-Type": "application/json",
          "auth-token": token
        }
      });

      if (response.data && response.data.data) {
        const updatedTask = response.data.data;
        setTasks(prevTasks => 
          prevTasks.map(task => task._id === id ? updatedTask : task)
        );
        return { success: true, task: updatedTask };
      }

      throw new Error("Invalid response format");
    } catch (err) {
      console.error("Error updating task:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        return { success: false, error: "Please login to update tasks" };
      }
      return { 
        success: false, 
        error: err.response?.data?.error || "Failed to update task"
      };
    }
  };

  const deleteTask = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return { success: false, error: "Please login to delete tasks" };
      }

      const response = await axios.delete(`${apiUrl}/api/task/deletetask/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "auth-token": token
        }
      });

      if (response.data.success) {
        setTasks(prevTasks => prevTasks.filter(task => task._id !== id));
        return { success: true };
      }

      throw new Error("Failed to delete task");
    } catch (err) {
      console.error("Error deleting task:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        return { success: false, error: "Please login to delete tasks" };
      }
      return { 
        success: false, 
        error: err.response?.data?.error || "Failed to delete task"
      };
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        fetchUserTasks,
        fetchAllTasks,
        allTasks,
        addTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export default TaskProvider;