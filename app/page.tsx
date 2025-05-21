"use client"

import { useEffect, useState } from "react"
import { TaskForm } from "@/components/task-form"
import { TaskList } from "@/components/task-list"
import type { Task } from "@/types/task"

export default function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null)

  // Load tasks from localStorage on initial render
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks")
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  // Add a new task
  const addTask = (task: Task) => {
    setTasks((prevTasks) => {
      const newTasks = [...prevTasks, { ...task, id: Date.now().toString() }]
      return sortTasksByPriority(newTasks)
    })
  }

  // Update an existing task
  const updateTask = (updatedTask: Task) => {
    setTasks((prevTasks) => {
      const newTasks = prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      return sortTasksByPriority(newTasks)
    })
    setTaskToEdit(null)
  }

  // Delete a task
  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id))
  }

  // Set a task to edit
  const editTask = (task: Task) => {
    setTaskToEdit(task)
  }

  // Sort tasks by priority (high > medium > low)
  const sortTasksByPriority = (tasksToSort: Task[]) => {
    const priorityOrder = { high: 1, medium: 2, low: 3 }
    return [...tasksToSort].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Task Management</h1>

      <div className="grid gap-8 md:grid-cols-[1fr_1fr] lg:grid-cols-[2fr_3fr]">
        <div>
          <TaskForm
            onSubmit={taskToEdit ? updateTask : addTask}
            initialTask={taskToEdit}
            isEditing={!!taskToEdit}
            onCancel={() => setTaskToEdit(null)}
          />
        </div>

        <div>
          <TaskList tasks={tasks} onEdit={editTask} onDelete={deleteTask} />
        </div>
      </div>
    </div>
  )
}
