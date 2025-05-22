import { render, screen } from '@testing-library/react'
import TaskManagement from '@/app/page'

// Mock the child components so we don't depend on them for this test
jest.mock('@/components/task-form', () => ({
  TaskForm: () => <div data-testid="task-form">Mocked TaskForm</div>,
}))
jest.mock('@/components/task-list', () => ({
  TaskList: () => <div data-testid="task-list">Mocked TaskList</div>,
}))

describe('TaskManagement page', () => {
  it('renders the heading and components', () => {
    render(<TaskManagement />)

    expect(screen.getByText(/task management/i)).toBeInTheDocument()
    expect(screen.getByTestId('task-form')).toBeInTheDocument()
    expect(screen.getByTestId('task-list')).toBeInTheDocument()
  })
})