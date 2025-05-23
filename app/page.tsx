"use client"

import { useEffect, useState } from "react"
import { TaskForm } from "@/components/task-form"
import { TaskBoard } from "@/components/task-board"
import { DeletedTasksDrawer } from "@/components/deleted-tasks-drawer"
import type { Task } from "@/types/task"
import { Button } from "@/components/ui/button"
import { PlusCircle, X, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"


export default function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [deletedTasks, setDeletedTasks] = useState<Task[]>([])
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showDeletedDrawer, setShowDeletedDrawer] = useState(false)
  const { toast } = useToast()

  // Load tasks and deleted tasks from localStorage on initial render
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks")
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }

    const storedDeletedTasks = localStorage.getItem("deletedTasks")
    if (storedDeletedTasks) {
      setDeletedTasks(JSON.parse(storedDeletedTasks))
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  // Save deleted tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("deletedTasks", JSON.stringify(deletedTasks))
  }, [deletedTasks])

  // Add a new task
  const addTask = (task: Task) => {
    // Initialize comments array if not provided
    const newTask = {
      ...task,
      id: Date.now().toString(),
      comments: task.comments || [],
    }

    setTasks((prevTasks) => {
      const newTasks = [...prevTasks, newTask]
      return sortTasksByPriority(newTasks)
    })
    setShowForm(false)

    toast({
      title: "Task created",
      description: "Your task has been created successfully.",
    })
  }

  // Update an existing task
  const updateTask = (updatedTask: Task) => {
    setTasks((prevTasks) => {
      const newTasks = prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      return sortTasksByPriority(newTasks)
    })
    setTaskToEdit(null)
    setShowForm(false)

    toast({
      title: "Task updated",
      description: "Your task has been updated successfully.",
    })
  }

  // Delete a task (move to deleted tasks)
  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find((task) => task.id === id)
    if (taskToDelete) {
      // Remove from active tasks
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id))

      // Add to deleted tasks
      setDeletedTasks((prevDeleted) => [...prevDeleted, taskToDelete])

      toast({
        title: "Task moved to trash",
        description: "Task has been moved to trash. You can restore it if needed.",
      })
    }
  }

  // Permanently delete a task
  const permanentlyDeleteTask = (id: string) => {
    setDeletedTasks((prevDeleted) => prevDeleted.filter((task) => task.id !== id))

    toast({
      title: "Task deleted permanently",
      description: "Task has been permanently deleted.",
    })
  }

  // Restore a deleted task
  const restoreTask = (id: string) => {
    const taskToRestore = deletedTasks.find((task) => task.id === id)
    if (taskToRestore) {
      // Remove from deleted tasks
      setDeletedTasks((prevDeleted) => prevDeleted.filter((task) => task.id !== id))

      // Add back to active tasks
      setTasks((prevTasks) => {
        const newTasks = [...prevTasks, taskToRestore]
        return sortTasksByPriority(newTasks)
      })

      toast({
        title: "Task restored",
        description: "Task has been restored successfully.",
      })
    }
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

  // Add a comment to a task
  const addComment = (taskId: string, commentText: string) => {
    const newComment = {
      id: Date.now().toString(),
      text: commentText,
      author: "User", // In a real app, this would be the current user
      createdAt: new Date().toISOString(),
    }

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, comments: [...(task.comments || []), newComment] } : task,
      ),
    )

    toast({
      title: "Comment added",
      description: "Your comment has been added to the task.",
    })
  }

  // Sort tasks by priority (high > medium > low)
  const sortTasksByPriority = (tasksToSort: Task[]) => {
    const priorityOrder = { high: 1, medium: 2, low: 3 }
    return [...tasksToSort].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
  }

  // Clear all deleted tasks
  const clearAllDeletedTasks = () => {
    setDeletedTasks([])
    toast({
      title: "Trash emptied",
      description: "All deleted tasks have been permanently removed.",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Task Management</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowDeletedDrawer(true)}
            className="gap-2"
            disabled={deletedTasks.length === 0}
          >
            <Trash2 className="h-4 w-4" />
            Trash ({deletedTasks.length})
          </Button>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            {showForm ? <X className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
            {showForm ? "Cancel" : "New Task"}
          </Button>
        </div>
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

      <TaskBoard
        tasks={tasks}
        onEdit={editTask}
        onDelete={deleteTask}
        onStatusChange={changeTaskStatus}
        onAddComment={addComment}
      />

      <DeletedTasksDrawer
        open={showDeletedDrawer}
        onClose={() => setShowDeletedDrawer(false)}
        deletedTasks={deletedTasks}
        onRestore={restoreTask}
        onDelete={permanentlyDeleteTask}
        onClearAll={clearAllDeletedTasks}
      />
    </div>
  )
}
