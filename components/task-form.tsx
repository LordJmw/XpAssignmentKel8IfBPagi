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
  })

  // Update form when initialTask changes (for editing)
  useEffect(() => {
    if (initialTask) {
      setTask(initialTask)
    } else {
      // Reset form when not editing
      setTask({
        id: "",
        title: "",
        description: "",
        priority: "medium",
        status: "todo",
      })
    }
  }, [initialTask])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTask((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setTask((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(task)

    // Only reset if not editing
    if (!isEditing) {
      setTask({
        id: "",
        title: "",
        description: "",
        priority: "medium",
        status: "todo",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Task" : "Create New Task"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={task.title}
              onChange={handleChange}
              placeholder="Task title"
              required
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
            <Select value={task.status} onValueChange={(value) => handleSelectChange("status", value)}>
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
        </CardContent>

        <CardFooter className="flex justify-between">
          {isEditing && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">{isEditing ? "Update Task" : "Add Task"}</Button>
        </CardFooter>
      </form>
    </Card>
  )
}
