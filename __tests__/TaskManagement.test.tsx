import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import TaskManagement from "@/app/page"
import { Task } from "@/types/task"

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

// Mock TaskBoard component
jest.mock("@/components/task-board", () => ({
  TaskBoard: ({ tasks, onEdit, onDelete, onStatusChange, onAddComment }: any) => (
    <div data-testid="task-board">
      {tasks.map((task: Task) => (
        <div key={task.id} data-testid={`task-${task.id}`}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <button onClick={() => onEdit(task)} data-testid={`edit-task-${task.id}`}>
            Edit
          </button>
          <button onClick={() => onDelete(task.id)} data-testid={`delete-task-${task.id}`}>
            Delete
          </button>
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
            data-testid={`status-select-${task.id}`}
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button onClick={() => onAddComment(task.id, "Test comment")} data-testid={`add-comment-${task.id}`}>
            Add Comment
          </button>
        </div>
      ))}
    </div>
  ),
}))

// Mock TaskFormModal component
jest.mock("@/components/task-form-modal", () => ({
  TaskFormModal: ({ isOpen, onClose, onSubmit, initialTask, isEditing }: any) => (
    isOpen ? (
      <div data-testid="task-form-modal">
        <h2>{isEditing ? "Edit Task" : "Create Task"}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({
              id: initialTask?.id || "1",
              title: (screen.getByTestId("task-title-input") as HTMLInputElement).value || "Test Task",
              description: (screen.getByTestId("task-description-input") as HTMLTextAreaElement).value || "Test Description",
              priority: (screen.getByTestId("task-priority-select") as HTMLSelectElement).value || "medium",
              status: initialTask?.status || "todo",
              comments: initialTask?.comments || [],
            });
            onClose();
          }}
        >
          <input
            type="text"
            defaultValue={initialTask?.title || ""}
            data-testid="task-title-input"
          />
          <textarea
            defaultValue={initialTask?.description || ""}
            data-testid="task-description-input"
          />
          <select
            defaultValue={initialTask?.priority || "medium"}
            data-testid="task-priority-select"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <button type="submit" data-testid="submit-task-form">
            {isEditing ? "Update Task" : "Create Task"}
          </button>
          <button type="button" onClick={onClose} data-testid="cancel-task-form">
            Cancel
          </button>
        </form>
      </div>
    ) : null
  ),
}));

// Mock DeletedTasksDrawer component
jest.mock("@/components/deleted-tasks-drawer", () => ({
  DeletedTasksDrawer: ({ open, onClose, deletedTasks, onRestore, onDelete, onClearAll }: any) => (
    <div data-testid="deleted-tasks-drawer" style={{ display: open ? "block" : "none" }}>
      <h2>Deleted Tasks</h2>
      <button onClick={onClose} data-testid="close-deleted-tasks-drawer">
        Close
      </button>
      <ul>
        {deletedTasks.map((task: Task) => (
          <li key={task.id} data-testid={`deleted-task-${task.id}`}>
            {task.title}
            <button onClick={() => onRestore(task.id)} data-testid={`restore-task-${task.id}`}>
              Restore
            </button>
            <button onClick={() => onDelete(task.id)} data-testid={`permanently-delete-task-${task.id}`}>
              Delete Permanently
            </button>
          </li>
        ))}
      </ul>
      <button onClick={onClearAll} data-testid="clear-all-deleted-tasks">
        Clear All
      </button>
    </div>
  ),
}))

// Test suite
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
    expect(screen.getByTestId("task-board")).toBeInTheDocument()
  })

  it("creates a new task", async () => {
    render(<TaskManagement />)

    fireEvent.click(screen.getByText("New Task"))
    fireEvent.click(screen.getByTestId("submit-task-form"))

    await waitFor(() => {
      expect(screen.getByTestId("task-board")).toHaveTextContent("Test Task")
    })

    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]")
    expect(tasks.length).toBe(1)
    expect(tasks[0].title).toBe("Test Task")
  })

  it("edits an existing task", async () => {
  const initialTask: Task = {
    id: "1",
    title: "Initial Task",
    description: "Initial Description",
    priority: "low",
    status: "todo",
    comments: [],
  };
  localStorage.setItem("tasks", JSON.stringify([initialTask]));

  render(<TaskManagement />);

  // Wait for task to load
  await waitFor(() => {
    expect(screen.getByTestId("task-1")).toBeInTheDocument();
  });

  // Click edit button
  fireEvent.click(screen.getByTestId("edit-task-1"));

  // Verify the form is open with initial values
  await waitFor(() => {
    expect(screen.getByTestId("task-form-modal")).toBeInTheDocument();
    expect(screen.getByTestId("task-title-input")).toHaveValue("Initial Task");
  });

  // Simulate changing the form inputs
  fireEvent.change(screen.getByTestId("task-title-input"), {
    target: { value: "Test Task" },
  });
  fireEvent.change(screen.getByTestId("task-description-input"), {
    target: { value: "Test Description" },
  });
  fireEvent.change(screen.getByTestId("task-priority-select"), {
    target: { value: "medium" },
  });

  // Submit form
  fireEvent.click(screen.getByTestId("submit-task-form"));

  // Verify form is closed
  await waitFor(() => {
    expect(screen.queryByTestId("task-form-modal")).not.toBeInTheDocument();
  });

  // Verify task is updated in UI
  await waitFor(
    () => {
      expect(screen.getByTestId("task-1")).toHaveTextContent("Test Task");
    },
    { timeout: 3000 }
  );

  // Check localStorage
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  expect(tasks[0].title).toBe("Test Task");
  expect(tasks[0].description).toBe("Test Description");
  expect(tasks[0].priority).toBe("medium");
});

  it("deletes a task (moves to trash)", async () => {
    const task: Task = {
      id: "1",
      title: "Task to delete",
      description: "Description",
      priority: "medium",
      status: "todo",
      comments: [],
    }
    localStorage.setItem("tasks", JSON.stringify([task]))

    render(<TaskManagement />)

    await waitFor(() => {
      expect(screen.getByTestId("task-1")).toBeInTheDocument()
    })

    fireEvent.click(screen.getByTestId("delete-task-1"))

    await waitFor(() => {
      expect(screen.queryByTestId("task-1")).not.toBeInTheDocument()
    })

    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]")
    expect(tasks.length).toBe(0)

    const deletedTasks = JSON.parse(localStorage.getItem("deletedTasks") || "[]")
    expect(deletedTasks.length).toBe(1)
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

    fireEvent.click(screen.getByText(/Trash \(\d+\)/))
    fireEvent.click(screen.getByTestId("restore-task-1"))

    await waitFor(() => {
      expect(screen.getByTestId("task-1")).toBeInTheDocument()
    })

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

    fireEvent.click(screen.getByText(/Trash \(\d+\)/))
    fireEvent.click(screen.getByTestId("permanently-delete-task-1"))

    await waitFor(() => {
      expect(screen.queryByTestId("deleted-task-1")).not.toBeInTheDocument()
    })

    const deletedTasks = JSON.parse(localStorage.getItem("deletedTasks") || "[]")
    expect(deletedTasks.length).toBe(0)
  })

  it("changes task status", async () => {
    const task: Task = {
      id: "1",
      title: "Task to move",
      description: "Description",
      priority: "medium",
      status: "todo",
      comments: [],
    }
    localStorage.setItem("tasks", JSON.stringify([task]))

    render(<TaskManagement />)

    await waitFor(() => {
      expect(screen.getByTestId("task-1")).toBeInTheDocument()
    })

    fireEvent.change(screen.getByTestId("status-select-1"), { target: { value: "in-progress" } })

    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]")
    expect(tasks[0].status).toBe("in-progress")
  })

  it("adds a comment to a task", async () => {
    const task: Task = {
      id: "1",
      title: "Task with comments",
      description: "Description",
      priority: "high",
      status: "todo",
      comments: [],
    }
    localStorage.setItem("tasks", JSON.stringify([task]))

    render(<TaskManagement />)

    await waitFor(() => {
      expect(screen.getByTestId("task-1")).toBeInTheDocument()
    })

    fireEvent.click(screen.getByTestId("add-comment-1"))

    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]")
    expect(tasks[0].comments.length).toBe(1)
    expect(tasks[0].comments[0].text).toBe("Test comment")
  })

  it("clears all deleted tasks", async () => {
    const deletedTasksData: Task[] = [
      {
        id: "1",
        title: "Deleted Task 1",
        description: "Description",
        priority: "high",
        status: "todo",
        comments: [],
      },
      {
        id: "2",
        title: "Deleted Task 2",
        description: "Description",
        priority: "medium",
        status: "todo",
        comments: [],
      },
    ]
    localStorage.setItem("deletedTasks", JSON.stringify(deletedTasksData))

    render(<TaskManagement />)

    fireEvent.click(screen.getByText(/Trash \(\d+\)/))
    fireEvent.click(screen.getByTestId("clear-all-deleted-tasks"))

    await waitFor(() => {
      expect(screen.queryByTestId("deleted-task-1")).not.toBeInTheDocument()
      expect(screen.queryByTestId("deleted-task-2")).not.toBeInTheDocument()
    })

    const deletedTasks = JSON.parse(localStorage.getItem("deletedTasks") || "[]")
    expect(deletedTasks.length).toBe(0)
  })
})
