import type React from "react"
export interface Task {
  id: string
  title: string
  description: string
  priority: "high" | "medium" | "low"
  status: "todo" | "in-progress" | "completed"
}

// Add this to ensure TypeScript recognizes the react-beautiful-dnd types
declare module "react-beautiful-dnd" {
  export interface DraggableProps {
    draggableId: string
    index: number
    children: (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => React.ReactElement
  }

  export interface DroppableProps {
    droppableId: string
    children: (provided: DroppableProvided, snapshot: DroppableStateSnapshot) => React.ReactElement
  }

  export interface DraggableProvided {
    draggableProps: any
    dragHandleProps: any | null
    innerRef: (element?: HTMLElement | null) => void
  }

  export interface DroppableProvided {
    droppableProps: any
    innerRef: (element?: HTMLElement | null) => void
    placeholder: React.ReactElement | null
  }

  export interface DraggableStateSnapshot {
    isDragging: boolean
    isDropAnimating: boolean
  }

  export interface DroppableStateSnapshot {
    isDraggingOver: boolean
  }

  export interface DropResult {
    draggableId: string
    type: string
    source: {
      droppableId: string
      index: number
    }
    destination?: {
      droppableId: string
      index: number
    }
  }

  export function DragDropContext(props: any): React.ReactElement
  export function Droppable(props: DroppableProps): React.ReactElement
  export function Draggable(props: DraggableProps): React.ReactElement
}
