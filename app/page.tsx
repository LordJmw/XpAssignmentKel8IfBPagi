"use client"

import { useEffect, useState } from "react"
import { DragDropContext, type DropResult } from "react-beautiful-dnd"
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

  // Handle drag and drop
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    // If there's no destination or the item was dropped back in the same place
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    // Find the task that was dragged
    const task = tasks.find((t) => t.id === draggableId)
    if (!task) return

    // Create a new array without the dragged task
    const newTasks = tasks.filter((t) => t.id !== draggableId)

    // Update the task status based on the destination column
    const updatedTask = { ...task, status: destination.droppableId as "todo" | "in-progress" | "completed" }

    // Insert the task at the new position
    newTasks.splice(destination.index, 0, updatedTask)

    // Update the state
    setTasks(newTasks)
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

      <DragDropContext onDragEnd={handleDragEnd}>
        <TaskBoard tasks={tasks} onEdit={editTask} onDelete={deleteTask} onStatusChange={changeTaskStatus} />
      </DragDropContext>
    </div>
  )
}
