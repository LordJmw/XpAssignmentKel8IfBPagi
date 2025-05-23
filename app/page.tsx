"use client"

import { useEffect, useState } from "react"
import { TaskBoard } from "@/components/task-board"
import { DeletedTasksDrawer } from "@/components/deleted-tasks-drawer"
import { TaskFormModal } from "@/components/task-form-modal"
import type { Task } from "@/types/task"
import { Button } from "@/components/ui/button"
import { PlusCircle, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [deletedTasks, setDeletedTasks] = useState<Task[]>([])
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showDeletedDrawer, setShowDeletedDrawer] = useState(false)
  const { toast } = useToast()

  // Debug function to log the current state
  const logState = (message: string, data?: any) => {
    console.log(
      `[${message}]`,
      data || {
        tasks: tasks.map((t) => ({ id: t.id, title: t.title, status: t.status })),
        taskToEdit: taskToEdit ? { id: taskToEdit.id, title: taskToEdit.title, status: taskToEdit.status } : null,
      },
    )
  }

  // Load tasks and deleted tasks from localStorage on initial render
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks")
    if (storedTasks) {
      try {
        const parsedTasks = JSON.parse(storedTasks)
        setTasks(parsedTasks)
        logState("Loaded tasks from localStorage", parsedTasks)
      } catch (error) {
        console.error("Error parsing tasks from localStorage:", error)
      }
    }

    const storedDeletedTasks = localStorage.getItem("deletedTasks")
    if (storedDeletedTasks) {
      try {
        setDeletedTasks(JSON.parse(storedDeletedTasks))
      } catch (error) {
        console.error("Error parsing deleted tasks from localStorage:", error)
      }
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
    logState("Saved tasks to localStorage")
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

    logState("Before adding task", { newTask })

    setTasks((prevTasks) => {
      const newTasks = [...prevTasks, newTask]
      const sortedTasks = sortTasksByPriority(newTasks)
      return sortedTasks
    })

    setShowForm(false)

    toast({
      title: "Task created",
      description: "Your task has been created successfully.",
    })
  }

  // Update an existing task
  const updateTask = (updatedTask: Task) => {
    logState("Before updating task", { updatedTask })

    // Create a new tasks array with the updated task
    const newTasks = tasks.map((task) => {
      if (task.id === updatedTask.id) {
        // Ensure we preserve all properties, especially status
        return {
          ...task, // Start with all existing properties
          ...updatedTask, // Override with updated properties
          status: updatedTask.status || task.status, // Explicitly ensure status is preserved
          comments: updatedTask.comments || task.comments || [], // Ensure comments are preserved
        }
      }
      return task
    })

    // Log the before and after state for debugging
    console.log("Task update:", {
      before: tasks.find((t) => t.id === updatedTask.id),
      update: updatedTask,
      after: newTasks.find((t) => t.id === updatedTask.id),
    })

    // Update the state with the new tasks array
    setTasks(sortTasksByPriority(newTasks))

    // Reset the edit state
    setTaskToEdit(null)
    setShowForm(false)

    toast({
      title: "Task updated",
      description: "Your task has been updated successfully.",
    })

    // Log the final state after update
    setTimeout(() => {
      logState("After updating task")
    }, 0)
  }

  // Delete a task (move to deleted tasks)
  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find((task) => task.id === id)
    if (taskToDelete) {
      logState("Before deleting task", { taskToDelete })

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
    // Create a deep copy to ensure we don't lose any data
    const taskCopy = JSON.parse(JSON.stringify(task))
    logState("Setting task to edit", { taskCopy })
    setTaskToEdit(taskCopy)
    setShowForm(true)
  }

  // Change task status
  const changeTaskStatus = (taskId: string, newStatus: "todo" | "in-progress" | "completed") => {
    logState("Before changing task status", { taskId, newStatus })

    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task))
      return updatedTasks
    })

    setTimeout(() => {
      logState("After changing task status")
    }, 0)
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

  // Close form and reset edit state
  const handleCloseForm = () => {
    setShowForm(false)
    setTaskToEdit(null)
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
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      <TaskBoard
        tasks={tasks}
        onEdit={editTask}
        onDelete={deleteTask}
        onStatusChange={changeTaskStatus}
        onAddComment={addComment}
      />

      <TaskFormModal
        isOpen={showForm}
        onClose={handleCloseForm}
        onSubmit={taskToEdit ? updateTask : addTask}
        initialTask={taskToEdit}
        isEditing={!!taskToEdit}
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
