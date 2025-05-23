"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Edit,
  Trash2,
  ArrowRight,
  CheckCircle2,
  Clock,
  RotateCcw,
  MoveHorizontal,
  Calendar,
  MessageCircle,
  Send,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { format, isPast, isToday, addDays, isBefore } from "date-fns"
import type { Task } from "@/types/task"

interface TaskItemProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onStatusChange: (taskId: string, newStatus: "todo" | "in-progress" | "completed") => void
  onAddComment: (taskId: string, comment: string) => void
}

export function TaskItem({ task, onEdit, onDelete, onStatusChange, onAddComment }: TaskItemProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isMoving, setIsMoving] = useState(false)
  const [isCommentsOpen, setIsCommentsOpen] = useState(false)
  const [newComment, setNewComment] = useState("")

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

  // Handle status change with animation
  const handleStatusChange = (newStatus: "todo" | "in-progress" | "completed") => {
    setIsMoving(true)
    // Small delay to allow animation to play
    setTimeout(() => {
      onStatusChange(task.id, newStatus)
      setIsMoving(false)
    }, 300)
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
            onClick={() => handleStatusChange("in-progress")}
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
              onClick={() => handleStatusChange("todo")}
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              Back
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300"
              onClick={() => handleStatusChange("completed")}
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
            onClick={() => handleStatusChange("in-progress")}
          >
            <ArrowRight className="h-3.5 w-3.5 mr-1" />
            Reopen
          </Button>
        )
      default:
        return null
    }
  }

  // Format and style deadline
  const renderDeadline = () => {
    if (!task.deadline) return null

    const deadlineDate = new Date(task.deadline)
    let className = "text-xs flex items-center gap-1 "

    // Style based on deadline proximity
    if (isPast(deadlineDate) && !isToday(deadlineDate)) {
      className += "text-red-600 font-medium"
    } else if (isToday(deadlineDate)) {
      className += "text-orange-600 font-medium"
    } else if (isBefore(new Date(), addDays(deadlineDate, 3))) {
      className += "text-yellow-600"
    } else {
      className += "text-muted-foreground"
    }

    return (
      <div className={className}>
        <Calendar className="h-3 w-3" />
        {isToday(deadlineDate)
          ? "Due today"
          : isPast(deadlineDate)
            ? `Overdue: ${format(deadlineDate, "MMM d")}`
            : `Due ${format(deadlineDate, "MMM d")}`}
      </div>
    )
  }

  // Handle comment submission
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim()) {
      onAddComment(task.id, newComment.trim())
      setNewComment("")
    }
  }

  // Count comments
  const commentCount = task.comments?.length || 0

  return (
    <Card
      className={`overflow-hidden transition-all duration-200 ${
        isMoving ? "opacity-50 scale-95 translate-y-2" : isHovered ? "shadow-md translate-y-[-2px]" : "shadow-sm"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          <div className="mt-1 text-muted-foreground">
            <MoveHorizontal size={16} />
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">{task.title}</h3>
              <div>{getPriorityBadge()}</div>
            </div>

            {task.description && (
              <p className="text-muted-foreground text-sm mt-1 mb-3 line-clamp-2">{task.description}</p>
            )}

            {/* Deadline display */}
            {task.deadline && <div className="mb-3">{renderDeadline()}</div>}

            <div className="flex flex-wrap justify-between items-center gap-2 mt-3">
              <div className="flex gap-1 items-center">{renderStatusButtons()}</div>

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

            {/* Comments section */}
            <div className="mt-3">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 -ml-2"
                onClick={() => setIsCommentsOpen(!isCommentsOpen)}
              >
                <MessageCircle className="h-3.5 w-3.5 mr-1" />
                Comments {commentCount > 0 && `(${commentCount})`}
              </Button>

              {isCommentsOpen && (
                <div className="mt-2">
                  <Separator className="my-2" />

                  {/* Comment list */}
                  <div className="space-y-2 max-h-40 overflow-y-auto mb-2">
                    {!task.comments || task.comments.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">No comments yet</p>
                    ) : (
                      task.comments.map((comment) => (
                        <div key={comment.id} className="bg-muted/50 rounded-md p-2">
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-medium">{comment.author}</span>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(comment.createdAt), "MMM d, h:mm a")}
                            </span>
                          </div>
                          <p className="text-sm mt-1">{comment.text}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add comment form */}
                  <form onSubmit={handleCommentSubmit} className="flex gap-2 mt-2">
                    <Input
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="h-8 text-sm"
                    />
                    <Button type="submit" size="sm" className="h-8 px-2" disabled={!newComment.trim()}>
                      <Send className="h-3.5 w-3.5" />
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
