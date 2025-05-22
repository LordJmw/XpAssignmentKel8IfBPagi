"use client"

import { useState } from "react"
import { Draggable } from "react-beautiful-dnd"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, GripVertical, ArrowRight, CheckCircle2, Clock, RotateCcw } from "lucide-react"
import type { Task } from "@/types/task"

interface TaskItemProps {
  task: Task
  index: number
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onStatusChange: (taskId: string, newStatus: "todo" | "in-progress" | "completed") => void
}

export function TaskItem({ task, index, onEdit, onDelete, onStatusChange }: TaskItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Define styles based on priority
  const getPriorityBadge = () => {
    switch (task.priority) {
      case "high":
        return <Badge className="bg-red-500 hover:bg-red-600">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Medium</Badge>
      case "low":
        return <Badge className="bg-green-500 hover:bg-green-600">Low</Badge>
      default:
        return null
    }
  }

  // Render status change buttons based on current status
  const renderStatusButtons = () => {
    switch (task.status) {
      case "todo":
        return (
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
            onClick={() => onStatusChange(task.id, "in-progress")}
          >
            <Clock className="h-3.5 w-3.5 mr-1" />
            Start
          </Button>
        )
      case "in-progress":
        return (
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
              onClick={() => onStatusChange(task.id, "todo")}
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              Back
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300"
              onClick={() => onStatusChange(task.id, "completed")}
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
              Complete
            </Button>
          </div>
        )
      case "completed":
        return (
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
            onClick={() => onStatusChange(task.id, "in-progress")}
          >
            <ArrowRight className="h-3.5 w-3.5 mr-1" />
            Reopen
          </Button>
        )
      default:
        return null
    }
  }

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`overflow-hidden transition-all duration-200 ${
            snapshot.isDragging
              ? "shadow-lg ring-2 ring-primary/20 rotate-1"
              : isHovered
                ? "shadow-md translate-y-[-2px]"
                : "shadow-sm"
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <CardContent className="p-3">
            <div className="flex items-start gap-2">
              <div
                {...provided.dragHandleProps}
                className="mt-1 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
              >
                <GripVertical size={16} />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{task.title}</h3>
                  <div>{getPriorityBadge()}</div>
                </div>

                {task.description && (
                  <p className="text-muted-foreground text-sm mt-1 mb-3 line-clamp-2">{task.description}</p>
                )}

                <div className="flex flex-wrap justify-between items-center gap-2 mt-3">
                  {renderStatusButtons()}

                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(task)} className="h-7 px-2">
                      <Edit className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(task.id)}
                      className="h-7 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </Draggable>
  )
}
