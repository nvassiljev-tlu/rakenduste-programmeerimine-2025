"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Book = {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  published_year?: number;
};

type Props = {
  initialBooks: Book[];
};

export default function BooksClient({ initialBooks }: Props) {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    published_year: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setBooks(initialBooks);
  }, [initialBooks]);

  const handleCreate = async () => {
    if (!formData.title.trim() || !formData.author.trim()) return;

    setLoading(true);
    const { error } = await supabase.from("books").insert({
      title: formData.title,
      author: formData.author,
      isbn: formData.isbn || null,
      published_year: formData.published_year
        ? parseInt(formData.published_year)
        : null,
    });

    if (!error) {
      setFormData({ title: "", author: "", isbn: "", published_year: "" });
      router.refresh();
      const { data } = await supabase.from("books").select();
      setBooks(data || []);
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    if (!formData.title.trim() || !formData.author.trim() || !editingId) return;

    setLoading(true);
    const { error } = await supabase
      .from("books")
      .update({
        title: formData.title,
        author: formData.author,
        isbn: formData.isbn || null,
        published_year: formData.published_year
          ? parseInt(formData.published_year)
          : null,
      })
      .eq("id", editingId);

    if (!error) {
      setFormData({ title: "", author: "", isbn: "", published_year: "" });
      setEditingId(null);
      router.refresh();
      const { data } = await supabase.from("books").select();
      setBooks(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("books").delete().eq("id", id);
    if (!error) {
      router.refresh();
      setBooks(books.filter((book) => book.id !== id));
    }
  };

  const startEditing = (book: Book) => {
    setEditingId(book.id);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn || "",
      published_year: book.published_year ? book.published_year.toString() : "",
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setFormData({ title: "", author: "", isbn: "", published_year: "" });
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">
          {editingId ? "Edit Book" : "Add New Book"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <input
            type="text"
            placeholder="Author"
            value={formData.author}
            onChange={(e) =>
              setFormData({ ...formData, author: e.target.value })
            }
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <input
            type="text"
            placeholder="ISBN (optional)"
            value={formData.isbn}
            onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <input
            type="number"
            placeholder="Published Year (optional)"
            value={formData.published_year}
            onChange={(e) =>
              setFormData({ ...formData, published_year: e.target.value })
            }
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={editingId ? handleUpdate : handleCreate}
            disabled={
              loading || !formData.title.trim() || !formData.author.trim()
            }
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : editingId ? "Update Book" : "Add Book"}
          </button>

          {editingId && (
            <button
              onClick={cancelEditing}
              disabled={loading}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">
          Books Library ({books.length} books)
        </h2>

        {books.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No books found. Add your first book!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {books.map((book) => (
              <div
                key={book.id}
                className="border p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800">
                      {book.title}
                    </h3>
                    <p className="text-gray-600 mb-2">by {book.author}</p>

                    <div className="text-sm text-gray-500 space-y-1">
                      {book.isbn && (
                        <p>
                          <span className="font-medium">ISBN:</span> {book.isbn}
                        </p>
                      )}
                      {book.published_year && (
                        <p>
                          <span className="font-medium">Published:</span>{" "}
                          {book.published_year}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => startEditing(book)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm transition-colors"
                      onClick={() => {
                        if (
                          confirm("Are you sure you want to delete this book?")
                        ) {
                          handleDelete(book.id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
