"use client";

import { createContext, useContext, useState } from "react";

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const openEditModal = (task) => setTaskToEdit(task);
  const openAddModal = () => setIsAddModalOpen(true);
  const closeModal = () => {
    setTaskToEdit(null);
    setIsAddModalOpen(false);
  };

  return (
    <TaskContext.Provider value={{ 
      taskToEdit, 
      isAddModalOpen, 
      openEditModal, 
      openAddModal, 
      closeModal 
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTaskUI = () => useContext(TaskContext);