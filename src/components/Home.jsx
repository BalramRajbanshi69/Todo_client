// src/Home.js
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import TaskContext from '../context/TaskContext'; 
import toast from 'react-hot-toast'; 

const Home = () => {
  const { tasks, fetchUserTasks, addTask, updateTask, deleteTask } = useContext(TaskContext);
  
  
  const [showForm, setShowForm] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: "", description: "" });
  const [editingTask, setEditingTask] = useState(null); 
  const [formError, setFormError] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    title: "",
    description: ""
  });
  
  useEffect(() => {
  }, [tasks]); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: ""
    }));
  };

    const validateForm = () => {
    let isValid = true;
    const newErrors = { title: "", description: "" };

    if (!taskForm.title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    } else if (taskForm.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
      isValid = false;
    }

    if (!taskForm.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }
    else if (taskForm.description.trim().length < 5) {
    newErrors.description = 'Description must be at least 5 characters';
    isValid = false;
  }
    else if (taskForm.description && taskForm.description.trim().length > 500) {
      newErrors.description = "Description must not exceed 500 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };


    const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
  
    setLoading(true);
    try {
      const taskData = {
      title: taskForm.title.trim(),
      description: taskForm.description.trim()
    };

    const response = editingTask 
      ? await updateTask(editingTask._id, taskData)
      : await addTask(taskData);
  
      if (response && response.success) {
        toast.success(editingTask ? "Task updated successfully!" : "Task added successfully!");
        setTaskForm({ title: "", description: "" });
        setEditingTask(null);
        setShowForm(false);
        await fetchUserTasks(); 
      } else {
        toast.error(response?.error || "Failed to process task");
      }
    } catch (error) {
      console.error('Submit Error:', error);
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };
  
  const handleEditClick = (task) => {
  if (!task || !task._id) {
    toast.error("Invalid task data");
    return;
  }
    setEditingTask(task);
    setTaskForm({
      title: task.title || '',
      description: task.description || ''
    });
    setShowForm(true);
    setFormError(null);
    setErrors({ title: "", description: "" }); 
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      const result = await deleteTask(id);
      if (result.success) {
        toast.success("Task deleted successfully!");
      } else {
        setFormError(result.error || "Failed to delete task.");
      }
    }
  };


  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTask(null);
    setTaskForm({ title: "", description: "" });
    setFormError(null);
  };


useEffect(() => {
  const loadTasks = async () => {
    try {
      const response = await fetchUserTasks();
      console.log('Fetch Response:', response);
      if (!response.success) {
        toast.error(response.error || 'Failed to load tasks');
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast.error('Failed to load tasks');
    }
  };
  loadTasks();
}, []); 



  return (
    <div className='flex flex-col min-h-screen bg-[#780000] font-sans'>
      <div className="max-w-[1200px] mx-auto w-full px-4 sm:px-6 lg:px-8">
        <nav className='text-gray-800 flex justify-between items-center py-8'>
          <div className='intro text-xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent'>
            <div className='flex flex-row gap-4 sm:gap-6'>
              <Link to="/">TODO_APP</Link>
            <Link to="/alltasks">All_Tasks</Link>
            </div>
          </div>
          <div>
            <ul className='flex flex-row gap-4 sm:gap-6'>
              <Link
                className='bg-gray-800 text-white py-2 px-5 rounded-md hover:bg-gray-700 transition duration-300 ease-in-out'
                to="/login"
              >
                Login
              </Link>
              <Link
                className='bg-gray-800 text-white py-2 px-5 rounded-md hover:bg-gray-700 transition duration-300 ease-in-out'
                to="/register"
              >
                Register
              </Link>
            </ul>
          </div>
        </nav>
        <div className='w-full h-[1px] bg-gray-300'></div>

        
        {/* form */}
      <div className='max-w-[1200px] flex flex-col gap-20 py-4 sm:py-6 lg:py-8'>
        <div className='flex-grow flex justify-start items-start'>
           <div className='bg-white p-8 rounded-lg shadow-xl max-w-md w-full border border-gray-200 '>
            {showForm ? (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
                  {editingTask ? 'Edit Task' : 'Create New Task'}
                </h2>
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Task Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={taskForm.title}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter task title"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
                </div>
                 <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description of Task <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={taskForm.description}
              onChange={handleChange}
              rows="3"
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Description of task..."
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>
                 <button
            type="submit"
            disabled={loading}
            className={`w-full cursor-pointer bg-blue-600 text-white py-3 px-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 ease-in-out shadow-md ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Processing...' : (editingTask ? 'Update Task' : 'Add Task')}
          </button>
                <button
            type="button"
            onClick={handleCancelForm}
            className="w-full mt-2 cursor-pointer bg-gray-300 text-gray-800 py-3 px-4 rounded-full text-lg font-semibold hover:bg-gray-400 transition duration-300 ease-in-out shadow-md"
            disabled={loading}
          >
            Cancel
          </button>
                {formError && <p className="text-red-500 text-sm mt-2 text-center">{formError}</p>}
              </form>
            ) : (
              <>
                <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-4">
                  Welcome to Your TODO App!
                </h2>
                <p className="text-center text-lg text-gray-600 mb-6">
                  Organize your life, one task at a time.
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 text-white py-3 px-8 rounded-full cursor-pointer text-lg font-semibold hover:bg-blue-700 transition duration-300 ease-in-out shadow-md"
                  >
                    Get Started
                  </button>
                </div>
              </>
            )}
          </div>


        {/* user tasks */}
          <div className='max-w-[1200px] mx-auto'>
            <div className='bg-white p-8 rounded-lg shadow-xl w-full border border-gray-200'>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Your Tasks</h3>
              
              {tasks && tasks.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          SN
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tasks.map((task, index) => (
                        <tr key={task._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {task.title}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {task.description || '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-2 ">
                              <button
                                onClick={() => handleEditClick(task)}
                                className="text-blue-600 cursor-pointer hover:text-blue-800 transition-colors duration-200"
                                title="Edit task"
                              >
                                <FiEdit size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(task._id)}
                                className="text-red-600 cursor-pointer hover:text-red-800 transition-colors duration-200"
                                title="Delete task"
                              >
                                <FiTrash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-600 text-center py-4">
                  No tasks found. Create your first task!
                </p>
              )}
            </div>
          </div>
          </div>

       
      </div>
      </div>

       
    </div>
  );
};

export default Home;