"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2 } from "lucide-react"
import type { Task } from "@/types/task"

interface TaskItemProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

export function TaskItem({ task, onEdit, onDelete }: TaskItemProps) {
  // Define styles based on priority and status
  const getPriorityBadge = () => {
    switch (task.priority) {
      case "high":
        return <Badge className="bg-red-500">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-500">Medium</Badge>
      case "low":
        return <Badge className="bg-green-500">Low</Badge>
      default:
        return null
    }
  }

  const getStatusBadge = () => {
    switch (task.status) {
      case "todo":
        return (
          <Badge variant="outline" className="border-slate-500 text-slate-700">
            To Do
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-700">
            In Progress
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="border-green-500 text-green-700">
            Completed
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-lg">{task.title}</h3>
          <div className="flex gap-2">
            {getPriorityBadge()}
            {getStatusBadge()}
          </div>
        </div>
        {task.description && <p className="text-muted-foreground text-sm mt-2">{task.description}</p>}
      </CardContent>
      <CardFooter className="flex justify-end gap-2 bg-muted/50 py-2 px-4">
        <Button variant="ghost" size="sm" onClick={() => onEdit(task)} className="h-8 px-2">
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(task.id)}
          className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}
