import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TaskItem } from "@/components/task-item"
import type { Task } from "@/types/task"
import { Badge } from "@/components/ui/badge"

interface TaskListProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

export function TaskList({ tasks, onEdit, onDelete }: TaskListProps) {
  // Count tasks by status
  const todoCount = tasks.filter((task) => task.status === "todo").length
  const inProgressCount = tasks.filter((task) => task.status === "in-progress").length
  const completedCount = tasks.filter((task) => task.status === "completed").length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Tasks</span>
          <div className="flex gap-2 text-sm">
            <Badge variant="outline" className="bg-slate-100">
              To Do: {todoCount}
            </Badge>
            <Badge variant="outline" className="bg-blue-50">
              In Progress: {inProgressCount}
            </Badge>
            <Badge variant="outline" className="bg-green-50">
              Completed: {completedCount}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No tasks yet. Create your first task!</div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
