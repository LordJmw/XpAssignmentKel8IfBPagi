"use client"

import { TaskColumn } from "@/components/task-column"
import type { Task } from "@/types/task"
import { useEffect } from "react"

interface TaskBoardProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onStatusChange: (taskId: string, newStatus: "todo" | "in-progress" | "completed") => void
  onAddComment: (taskId: string, comment: string) => void
}

export function TaskBoard({ tasks, onEdit, onDelete, onStatusChange, onAddComment }: TaskBoardProps) {
  // Debug logging to track tasks by status
  useEffect(() => {
    const todoCount = tasks.filter((t) => t.status === "todo").length
    const inProgressCount = tasks.filter((t) => t.status === "in-progress").length
    const completedCount = tasks.filter((t) => t.status === "completed").length

    console.log("TaskBoard tasks by status:", {
      todo: todoCount,
      inProgress: inProgressCount,
      completed: completedCount,
      total: tasks.length,
    })
  }, [tasks])

  // Group tasks by status
  const todoTasks = tasks.filter((task) => task.status === "todo")
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress")
  const completedTasks = tasks.filter((task) => task.status === "completed")

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <TaskColumn
        title="To Do"
        tasks={todoTasks}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
        onAddComment={onAddComment}
        className="bg-slate-50 border-t-4 border-slate-400"
      />

      <TaskColumn
        title="In Progress"
        tasks={inProgressTasks}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
        onAddComment={onAddComment}
        className="bg-blue-50 border-t-4 border-blue-400"
      />

      <TaskColumn
        title="Completed"
        tasks={completedTasks}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
        onAddComment={onAddComment}
        className="bg-green-50 border-t-4 border-green-400"
      />
    </div>
  )
}
