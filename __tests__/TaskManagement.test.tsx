import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import TaskManagement from "@/app/page"
import { Task } from "@/types/task"
import { useToast } from "@/hooks/use-toast"

// Mock the toast hook
jest.mock("@/hooks/use-toast", () => ({
  useToast: jest.fn(() => ({
    toast: jest.fn(),
  })),
}))

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    clear: () => {
      store = {}
    },
    removeItem: (key: string) => {
      delete store[key]
    },
  }
})()

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
})

describe("TaskManagement", () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  it("renders the component with initial state", () => {
    render(<TaskManagement />)

    expect(screen.getByText("Task Management")).toBeInTheDocument()
    expect(screen.getByText("New Task")).toBeInTheDocument()
    expect(screen.getByText("Trash (0)")).toBeInTheDocument()
  })

  it("shows and hides the task form", async () => {
    render(<TaskManagement />)

    // Form should not be visible initially
    expect(screen.queryByLabelText("Title")).not.toBeInTheDocument()

    // Click new task button
    fireEvent.click(screen.getByText("New Task"))
    expect(screen.getByLabelText("Title")).toBeInTheDocument()

    // Click cancel button
    fireEvent.click(screen.getByText("Cancel"))
    await waitFor(() => {
      expect(screen.queryByLabelText("Title")).not.toBeInTheDocument()
    })
  })

  it("creates a new task", async () => {
    render(<TaskManagement />)

    // Open form
    fireEvent.click(screen.getByText("New Task"))

    // Fill out form
    fireEvent.change(screen.getByLabelText("Title"), { target: { value: "Test Task" } })
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Test Description" },
    })
    fireEvent.change(screen.getByLabelText("Priority"), { target: { value: "medium" } })

    // Submit form
    fireEvent.click(screen.getByText("Create Task"))

    // Check if task was added
    await waitFor(() => {
      expect(screen.getByText("Test Task")).toBeInTheDocument()
      expect(screen.getByText("Test Description")).toBeInTheDocument()
    })

    // Check localStorage
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]")
    expect(tasks.length).toBe(1)
    expect(tasks[0].title).toBe("Test Task")
  })

  it("deletes a task (moves to trash)", async () => {
    const initialTask: Task = {
      id: "1",
      title: "Task to delete",
      description: "Description",
      priority: "medium",
      status: "todo",
      comments: [],
    }
    localStorage.setItem("tasks", JSON.stringify([initialTask]))

    render(<TaskManagement />)

    // Wait for task to load
    await waitFor(() => {
      expect(screen.getByText("Task to delete")).toBeInTheDocument()
    })

    // Find the delete button - this will depend on your actual implementation
    // You might need to add data-testid to your delete button in the TaskBoard component
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i })
    fireEvent.click(deleteButtons[0])

    // Check if task was removed from view
    await waitFor(() => {
      expect(screen.queryByText("Task to delete")).not.toBeInTheDocument()
    })

    // Check localStorage
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]")
    expect(tasks.length).toBe(0)

    const deletedTasks = JSON.parse(localStorage.getItem("deletedTasks") || "[]")
    expect(deletedTasks.length).toBe(1)
    expect(deletedTasks[0].title).toBe("Task to delete")
  })

  it("restores a deleted task", async () => {
    const deletedTask: Task = {
      id: "1",
      title: "Deleted Task",
      description: "Description",
      priority: "high",
      status: "todo",
      comments: [],
    }
    localStorage.setItem("deletedTasks", JSON.stringify([deletedTask]))

    render(<TaskManagement />)

    // Open trash drawer
    fireEvent.click(screen.getByText(/Trash \(\d+\)/))

    // Find restore button - you might need to add data-testid to your restore button
    const restoreButton = await screen.findByText(/restore/i)
    fireEvent.click(restoreButton)

    // Check if task was restored
    await waitFor(() => {
      expect(screen.getByText("Deleted Task")).toBeInTheDocument()
    })

    // Check localStorage
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]")
    expect(tasks.length).toBe(1)

    const deletedTasks = JSON.parse(localStorage.getItem("deletedTasks") || "[]")
    expect(deletedTasks.length).toBe(0)
  })

  it("permanently deletes a task", async () => {
    const deletedTask: Task = {
      id: "1",
      title: "Task to delete permanently",
      description: "Description",
      priority: "low",
      status: "todo",
      comments: [],
    }
    localStorage.setItem("deletedTasks", JSON.stringify([deletedTask]))

    render(<TaskManagement />)

    // Open trash drawer
    fireEvent.click(screen.getByText(/Trash \(\d+\)/))

    // Find delete permanently button - you might need to add data-testid
    const deleteButton = await screen.findByText(/delete permanently/i)
    fireEvent.click(deleteButton)

    // Check if task was removed
    await waitFor(() => {
      expect(screen.queryByText("Task to delete permanently")).not.toBeInTheDocument()
    })

    // Check localStorage
    const deletedTasks = JSON.parse(localStorage.getItem("deletedTasks") || "[]")
    expect(deletedTasks.length).toBe(0)
  })
})