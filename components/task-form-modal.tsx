"use client"

import { TaskForm } from "@/components/task-form"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import type { Task } from "@/types/task"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TaskFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (task: Task) => void
  initialTask: Task | null
  isEditing: boolean
}

export function TaskFormModal({ isOpen, onClose, onSubmit, initialTask, isEditing }: TaskFormModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md w-full h-[90vh] flex flex-col p-0 gap-0 border-none">
        <div className="p-4 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
          <h2 className="text-xl font-semibold">{isEditing ? "Edit Task" : "Create New Task"}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <TaskForm onSubmit={onSubmit} initialTask={initialTask} isEditing={isEditing} onCancel={onClose} fullHeight />
        </div>
      </DialogContent>
    </Dialog>
  )
}
