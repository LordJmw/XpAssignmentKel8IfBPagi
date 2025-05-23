import '@testing-library/jest-dom'

// Optional: mock localStorage to avoid crashes in tests
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

if (typeof window !== 'undefined') {
  window.ResizeObserver = window.ResizeObserver || class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}