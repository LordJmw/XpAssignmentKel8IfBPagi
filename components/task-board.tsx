import { Droppable } from "react-beautiful-dnd"
import { TaskColumn } from "@/components/task-column"
import type { Task } from "@/types/task"

interface TaskBoardProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

export function TaskBoard({ tasks, onEdit, onDelete }: TaskBoardProps) {
  // Group tasks by status
  const todoTasks = tasks.filter((task) => task.status === "todo")
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress")
  const completedTasks = tasks.filter((task) => task.status === "completed")

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Droppable droppableId="todo">
        {(provided) => (
          <TaskColumn
            title="To Do"
            tasks={todoTasks}
            onEdit={onEdit}
            onDelete={onDelete}
            provided={provided}
            className="bg-slate-50 border-t-4 border-slate-400"
          />
        )}
      </Droppable>

      <Droppable droppableId="in-progress">
        {(provided) => (
          <TaskColumn
            title="In Progress"
            tasks={inProgressTasks}
            onEdit={onEdit}
            onDelete={onDelete}
            provided={provided}
            className="bg-blue-50 border-t-4 border-blue-400"
          />
        )}
      </Droppable>

      <Droppable droppableId="completed">
        {(provided) => (
          <TaskColumn
            title="Completed"
            tasks={completedTasks}
            onEdit={onEdit}
            onDelete={onDelete}
            provided={provided}
            className="bg-green-50 border-t-4 border-green-400"
          />
        )}
      </Droppable>
    </div>
  )
}
