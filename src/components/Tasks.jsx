import React, { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import TaskContext from "../context/TaskContext";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { FaBackspace } from "react-icons/fa";

const Tasks = () => {
  const { allTasks, fetchAllTasks } = useContext(TaskContext);

    useEffect(() => {
      fetchAllTasks();
    }, []);


  return (
    <div className="flex flex-col min-h-screen bg-[#780000] font-sans">
      <div className="max-w-[1200px] mx-auto w-full px-4 sm:px-6 lg:px-8">
        <nav className="text-gray-800 flex justify-between items-center py-8">
          <div className="intro text-xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
            <Link to="/">TODO_APP</Link>
          </div>
        </nav>
        <div className="w-full h-[1px] bg-gray-300"></div>

        <div className="py-5">
            <Link to="/">
            <FaBackspace size={35} color="white"/>
            </Link>
        </div>

        <div className="max-w-[1200px] mx-auto py-8">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">All Tasks</h3>

            {allTasks && allTasks.length > 0 ? (
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
                    {allTasks.map((task, index) => (
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
                          <div className="flex justify-end gap-4">
                            <button 
                              className="text-blue-500 hover:text-blue-500 hover:opacity-50 hover:blur-[1px] hover:cursor-not-allowed transition-all duration-200"
                              title="Edit task"
                            >
                              <FiEdit size={20} />
                            </button>
                            <button 
                              className="text-red-500 hover:text-red-500 hover:opacity-50 hover:blur-[1px] hover:cursor-not-allowed transition-all duration-200"
                              title="Delete task"
                            >
                              <FiTrash2 size={20} />
                            </button>
                          </div>
                        </td>


                      </tr>

                    ))}  
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4">No tasks found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
