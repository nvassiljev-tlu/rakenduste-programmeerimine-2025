import { beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BooksClient from "@/app/books/BooksClient";

const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn(() => Promise.resolve({ data: [], error: null })),
    insert: vi.fn(() => Promise.resolve({ error: null })),
    update: vi.fn(() => ({
      eq: vi.fn(() => Promise.resolve({ error: null })),
    })),
    delete: vi.fn(() => ({
      eq: vi.fn(() => Promise.resolve({ error: null })),
    })),
  })),
};

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => mockSupabase,
}));

const mockRefresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: mockRefresh,
  }),
}));

describe("BooksClient", () => {
  const mockBooks = [
    {
      id: 1,
      title: "Test Book 1",
      author: "Test Author 1",
      isbn: "978-0-123456-78-9",
      published_year: 2023,
    },
    {
      id: 2,
      title: "Test Book 2",
      author: "Test Author 2",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase.from.mockReturnValue({
      select: vi.fn(() => Promise.resolve({ data: mockBooks, error: null })),
      insert: vi.fn(() => Promise.resolve({ error: null })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
    });
  });

  test("renders books list", () => {
    render(<BooksClient initialBooks={mockBooks} />);

    expect(screen.getByText("Test Book 1")).toBeInTheDocument();
    expect(screen.getByText("by Test Author 1")).toBeInTheDocument();
    expect(screen.getByText("Test Book 2")).toBeInTheDocument();
    expect(screen.getByText("by Test Author 2")).toBeInTheDocument();
  });

  test("renders empty state when no books", () => {
    render(<BooksClient initialBooks={[]} />);

    expect(
      screen.getByText("No books found. Add your first book!")
    ).toBeInTheDocument();
  });

  test("shows form with all required fields", () => {
    render(<BooksClient initialBooks={[]} />);

    expect(screen.getByPlaceholderText("Title")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Author")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("ISBN (optional)")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Published Year (optional)")
    ).toBeInTheDocument();
    expect(screen.getByText("Add Book")).toBeInTheDocument();
  });

  test("adds new book with all fields", async () => {
    const user = userEvent.setup();
    render(<BooksClient initialBooks={[]} />);

    await user.type(screen.getByPlaceholderText("Title"), "New Book");
    await user.type(screen.getByPlaceholderText("Author"), "New Author");
    await user.type(
      screen.getByPlaceholderText("ISBN (optional)"),
      "978-0-987654-32-1"
    );
    await user.type(
      screen.getByPlaceholderText("Published Year (optional)"),
      "2024"
    );

    await user.click(screen.getByText("Add Book"));

    await waitFor(() => {
      expect(mockSupabase.from).toHaveBeenCalledWith("books");
    });
  });

  test("adds new book with only required fields", async () => {
    const user = userEvent.setup();
    render(<BooksClient initialBooks={[]} />);

    await user.type(screen.getByPlaceholderText("Title"), "Minimal Book");
    await user.type(screen.getByPlaceholderText("Author"), "Minimal Author");

    await user.click(screen.getByText("Add Book"));

    await waitFor(() => {
      expect(mockSupabase.from).toHaveBeenCalledWith("books");
    });
  });

  test("does not add book without required fields", async () => {
    const user = userEvent.setup();
    render(<BooksClient initialBooks={[]} />);

    const addButton = screen.getByText("Add Book");
    expect(addButton).toBeDisabled();

    await user.type(screen.getByPlaceholderText("Title"), "Only Title");
    expect(addButton).toBeDisabled();

    await user.type(screen.getByPlaceholderText("Author"), "Some Author");
    expect(addButton).not.toBeDisabled();
  });

  test("enters edit mode when edit button is clicked", async () => {
    const user = userEvent.setup();
    render(<BooksClient initialBooks={mockBooks} />);

    const editButtons = screen.getAllByText("Edit");
    await user.click(editButtons[0]);

    expect(screen.getByDisplayValue("Test Book 1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Author 1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("978-0-123456-78-9")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2023")).toBeInTheDocument();

    expect(screen.getByText("Update Book")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  test("updates book information", async () => {
    const user = userEvent.setup();
    render(<BooksClient initialBooks={mockBooks} />);

    const editButtons = screen.getAllByText("Edit");
    await user.click(editButtons[0]);

    const titleInput = screen.getByDisplayValue("Test Book 1");
    await user.clear(titleInput);
    await user.type(titleInput, "Updated Book Title");

    await user.click(screen.getByText("Update Book"));

    await waitFor(() => {
      expect(mockSupabase.from).toHaveBeenCalledWith("books");
    });
  });

  test("cancels editing", async () => {
    const user = userEvent.setup();
    render(<BooksClient initialBooks={mockBooks} />);

    const editButtons = screen.getAllByText("Edit");
    await user.click(editButtons[0]);

    await user.click(screen.getByText("Cancel"));

    expect(screen.getByPlaceholderText("Title")).toHaveValue("");
    expect(screen.getByText("Add Book")).toBeInTheDocument();
  });

  test("deletes book", async () => {
    const user = userEvent.setup();

    window.confirm = vi.fn(() => true);

    render(<BooksClient initialBooks={mockBooks} />);

    const deleteButtons = screen.getAllByText("Delete");
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockSupabase.from).toHaveBeenCalledWith("books");
    });
  });

  test("does not delete book when confirm is cancelled", async () => {
    const user = userEvent.setup();

    window.confirm = vi.fn(() => false);

    render(<BooksClient initialBooks={mockBooks} />);

    const deleteButtons = screen.getAllByText("Delete");
    await user.click(deleteButtons[0]);

    expect(mockSupabase.from().delete).not.toHaveBeenCalled();
  });

  test("displays book count correctly", () => {
    render(<BooksClient initialBooks={mockBooks} />);

    expect(screen.getByText("Books Library (2 books)")).toBeInTheDocument();
  });

  test("displays ISBN and published year when available", () => {
    render(<BooksClient initialBooks={mockBooks} />);

    expect(screen.getByText("ISBN: 978-0-123456-78-9")).toBeInTheDocument();
    expect(screen.getByText("Published: 2023")).toBeInTheDocument();
  });

  test("handles loading state", async () => {
    const user = userEvent.setup();

    mockSupabase.from.mockReturnValue({
      insert: vi.fn(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ error: null }), 1000)
          )
      ),
      select: vi.fn(() => Promise.resolve({ data: [], error: null })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
    });

    render(<BooksClient initialBooks={[]} />);

    await user.type(screen.getByPlaceholderText("Title"), "Test Book");
    await user.type(screen.getByPlaceholderText("Author"), "Test Author");

    const addButton = screen.getByText("Add Book");
    await user.click(addButton);

    expect(screen.getByText("Processing...")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Title")).toBeDisabled();
  });
});
