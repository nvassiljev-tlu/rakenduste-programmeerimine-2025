import { describe, expect, test, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NotesClient from "@/app/notes/NotesClient";

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
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
  }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: vi.fn(),
  }),
}));

describe("NotesClient", () => {
  const mockNotes = [
    { id: 1, title: "Test Note 1" },
    { id: 2, title: "Test Note 2" },
  ];

  test("renders notes list", () => {
    render(<NotesClient initialNotes={mockNotes} />);
    expect(screen.getByText("Test Note 1")).toBeInTheDocument();
    expect(screen.getByText("Test Note 2")).toBeInTheDocument();
  });

  test("adds new note", async () => {
    render(<NotesClient initialNotes={[]} />);

    const input = screen.getByPlaceholderText("Add new note...");
    const button = screen.getByText("Add");

    fireEvent.change(input, { target: { value: "New Note" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(input).toHaveValue("");
    });
  });

  test("enters edit mode when edit button clicked", () => {
    render(<NotesClient initialNotes={mockNotes} />);

    const editButton = screen.getAllByText("Edit")[0];
    fireEvent.click(editButton);

    expect(screen.getByDisplayValue("Test Note 1")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });
});
