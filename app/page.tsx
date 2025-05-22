"use client"

import { useEffect, useState } from "react"
import { TaskForm } from "@/components/task-form"
import { TaskBoard } from "@/components/task-board"
import type { Task } from "@/types/task"
import { Button } from "@/components/ui/button"
import { PlusCircle, X } from "lucide-react"

export default function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null)
  const [showForm, setShowForm] = useState(false)

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
    setShowForm(false)
  }

  // Update an existing task
  const updateTask = (updatedTask: Task) => {
    setTasks((prevTasks) => {
      const newTasks = prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      return sortTasksByPriority(newTasks)
    })
    setTaskToEdit(null)
    setShowForm(false)
  }

  // Delete a task
  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id))
  }

  // Set a task to edit
  const editTask = (task: Task) => {
    setTaskToEdit(task)
    setShowForm(true)
  }

  // Change task status
  const changeTaskStatus = (taskId: string, newStatus: "todo" | "in-progress" | "completed") => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
  }

  // Sort tasks by priority (high > medium > low)
  const sortTasksByPriority = (tasksToSort: Task[]) => {
    const priorityOrder = { high: 1, medium: 2, low: 3 }
    return [...tasksToSort].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Task Management</h1>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          {showForm ? <X className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
          {showForm ? "Cancel" : "New Task"}
        </Button>
      </div>

      {showForm && (
        <div className="mb-8 max-w-md mx-auto">
          <TaskForm
            onSubmit={taskToEdit ? updateTask : addTask}
            initialTask={taskToEdit}
            isEditing={!!taskToEdit}
            onCancel={() => {
              setTaskToEdit(null)
              setShowForm(false)
            }}
          />
        </div>
      )}

      <TaskBoard tasks={tasks} onEdit={editTask} onDelete={deleteTask} onStatusChange={changeTaskStatus} />
    </div>
  )
}
