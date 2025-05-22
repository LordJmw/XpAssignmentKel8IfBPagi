import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TaskItem } from "@/components/task-item"
import type { Task } from "@/types/task"
import type { DroppableProvided } from "react-beautiful-dnd"

interface TaskColumnProps {
  title: string
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  provided: DroppableProvided
  className?: string
}

export function TaskColumn({ title, tasks, onEdit, onDelete, provided, className }: TaskColumnProps) {
  return (
    <Card className={`h-full ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-lg font-medium">
          <span>{title}</span>
          <span className="text-sm bg-white rounded-full h-6 w-6 flex items-center justify-center">{tasks.length}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 min-h-[50vh]" ref={provided.innerRef} {...provided.droppableProps}>
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground italic text-sm">No tasks</div>
          ) : (
            tasks.map((task, index) => (
              <TaskItem key={task.id} task={task} index={index} onEdit={onEdit} onDelete={onDelete} />
            ))
          )}
          {provided.placeholder}
        </div>
      </CardContent>
    </Card>
  )
}
