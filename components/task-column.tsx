import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TaskItem } from "@/components/task-item"
import type { Task } from "@/types/task"

interface TaskColumnProps {
  title: string
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onStatusChange: (taskId: string, newStatus: "todo" | "in-progress" | "completed") => void
  className?: string
}

export function TaskColumn({ title, tasks, onEdit, onDelete, onStatusChange, className }: TaskColumnProps) {
  return (
    <Card className={`h-full ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-lg font-medium">
          <span>{title}</span>
          <span className="text-sm bg-white rounded-full h-6 w-6 flex items-center justify-center">{tasks.length}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 min-h-[50vh]">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground italic text-sm">No tasks</div>
          ) : (
            tasks.map((task) => (
              <TaskItem key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
