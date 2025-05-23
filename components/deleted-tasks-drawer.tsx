"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Undo2, Trash2 } from "lucide-react"
import type { Task } from "@/types/task"

interface DeletedTasksDrawerProps {
  open: boolean
  onClose: () => void
  deletedTasks: Task[]
  onRestore: (id: string) => void
  onDelete: (id: string) => void
  onClearAll: () => void
}

export function DeletedTasksDrawer({
  open,
  onClose,
  deletedTasks,
  onRestore,
  onDelete,
  onClearAll,
}: DeletedTasksDrawerProps) {
  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
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

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Deleted Tasks</SheetTitle>
          <SheetDescription>Tasks remain here for 30 days before being permanently deleted.</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {deletedTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No deleted tasks</div>
          ) : (
            deletedTasks.map((task) => (
              <Card key={task.id} className="shadow-sm">
                <CardContent className="p-3">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{task.title}</h3>
                    <div>{getPriorityBadge(task.priority)}</div>
                  </div>

                  {task.description && (
                    <p className="text-muted-foreground text-sm mt-1 mb-3 line-clamp-2">{task.description}</p>
                  )}

                  <div className="flex justify-between items-center mt-3">
                    <div className="text-xs text-muted-foreground">{task.status}</div>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" onClick={() => onRestore(task.id)} className="h-7 px-2">
                        <Undo2 className="h-3.5 w-3.5 mr-1" />
                        Restore
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
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <SheetFooter className="mt-4">
          <Button variant="destructive" onClick={onClearAll} disabled={deletedTasks.length === 0} className="w-full">
            Empty Trash
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
