/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from "@testing-library/react"
import TaskManagement from "@/app/page"
import "@testing-library/jest-dom"

// Mock the components you don't want to deeply test here (optional)
jest.mock("@/components/task-form", () => ({
  TaskForm: ({ onSubmit }: any) => (
    <form role="form" onSubmit={e => e.preventDefault()}>
      <button type="submit">Submit Task</button>
    </form>
  ),
}))

jest.mock("@/components/task-board", () => ({
  TaskBoard: () => <div>Task Board</div>,
}))

describe("TaskManagement Page", () => {
  it("renders title and New Task button", () => {
    render(<TaskManagement />)

    expect(screen.getByText("Task Management")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /new task/i })).toBeInTheDocument()
  })

  it("shows form when New Task button is clicked", () => {
    render(<TaskManagement />)

    const toggleButton = screen.getByRole("button", { name: /new task/i })
    fireEvent.click(toggleButton)

    expect(screen.getByRole("form")).toBeInTheDocument()
  })

  it("hides form when Cancel button is clicked", () => {
    render(<TaskManagement />)

    fireEvent.click(screen.getByRole("button", { name: /new task/i }))
    expect(screen.getByRole("form")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }))
    expect(screen.queryByRole("form")).not.toBeInTheDocument()
  })

  it("renders TaskBoard inside DragDropContext", () => {
    render(<TaskManagement />)
    expect(screen.getByText("Task Board")).toBeInTheDocument()
  })
})
