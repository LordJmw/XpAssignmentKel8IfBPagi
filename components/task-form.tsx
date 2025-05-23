"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Task } from "@/types/task"

interface TaskFormProps {
  onSubmit: (task: Task) => void
  initialTask: Task | null
  isEditing: boolean
  onCancel: () => void
}

export function TaskForm({ onSubmit, initialTask, isEditing, onCancel }: TaskFormProps) {
  const [task, setTask] = useState<Task>({
    id: "",
    title: "",
    description: "",
    priority: "medium",
    status: "todo",
    deadline: undefined,
    comments: [],
  })
  const [error, setError] = useState("")
  const [date, setDate] = useState<Date | undefined>(undefined)

  // Update form when initialTask changes (for editing)
  useEffect(() => {
    if (initialTask) {
      console.log("Initial task in form:", initialTask)

      // Make sure we have all fields with proper defaults
      const updatedTask = {
        id: initialTask.id || "",
        title: initialTask.title || "",
        description: initialTask.description || "",
        priority: initialTask.priority || "medium",
        status: initialTask.status || "todo", // Ensure status is preserved
        deadline: initialTask.deadline,
        comments: initialTask.comments || [],
      }

      console.log("Setting form task state to:", updatedTask)
      setTask(updatedTask)

      // Set date if deadline exists
      setDate(initialTask.deadline ? new Date(initialTask.deadline) : undefined)
    } else {
      // Reset form when not editing
      setTask({
        id: "",
        title: "",
        description: "",
        priority: "medium",
        status: "todo",
        deadline: undefined,
        comments: [],
      })
      setDate(undefined)
    }
    setError("")
  }, [initialTask])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTask((prev) => ({ ...prev, [name]: value }))
    if (name === "title" && error) setError("")
  }

  const handleSelectChange = (name: string, value: string) => {
    console.log(`Changing ${name} to ${value}`)
    setTask((prev) => {
      const updated = { ...prev, [name]: value }
      console.log("Updated task state:", updated)
      return updated
    })
  }

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate)
    setTask((prev) => ({
      ...prev,
      deadline: newDate ? newDate.toISOString() : undefined,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!task.title.trim()) {
      setError("Title is required")
      return
    }

    // Log the task being submitted for debugging
    console.log("Submitting task:", task)

    // Make sure we're sending all required fields, especially status
    const taskToSubmit = {
      ...task,
      status: task.status || (initialTask ? initialTask.status : "todo"),
    }

    console.log("Final task to submit:", taskToSubmit)
    onSubmit(taskToSubmit)

    // Only reset if not editing
    if (!isEditing) {
      setTask({
        id: "",
        title: "",
        description: "",
        priority: "medium",
        status: "todo",
        deadline: undefined,
        comments: [],
      })
      setDate(undefined)
    }
  }

  return (
    <Card className="border-t-4 border-primary">
      <CardHeader className="pb-3">
        <CardTitle>{isEditing ? "Edit Task" : "Create New Task"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center gap-1">
              Title
              {error && (
                <span className="text-red-500 text-xs flex items-center ml-1">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {error}
                </span>
              )}
            </Label>
            <Input
              id="title"
              name="title"
              value={task.title}
              onChange={handleChange}
              placeholder="Task title"
              className={error ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={task.description}
              onChange={handleChange}
              placeholder="Task description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <RadioGroup
              value={task.priority}
              onValueChange={(value) => handleSelectChange("priority", value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high" className="text-red-500 font-medium">
                  High
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="text-yellow-500 font-medium">
                  Medium
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low" className="text-green-500 font-medium">
                  Low
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={task.status}
              onValueChange={(value) => handleSelectChange("status", value)}
              defaultValue={task.status}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Deadline</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Set a deadline"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={handleDateChange} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{isEditing ? "Update Task" : "Add Task"}</Button>
        </CardFooter>
      </form>
    </Card>
  )
}
