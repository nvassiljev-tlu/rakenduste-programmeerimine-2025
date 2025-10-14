"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Note = {
  id: number;
  title: string;
};

type Props = {
  initialNotes: Note[];
};

export default function NotesClient({ initialNotes }: Props) {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [newNote, setNewNote] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes]);

  const handleAdd = async () => {
    if (!newNote.trim()) return;

    setLoading(true);
    const { error } = await supabase.from("notes").insert({ title: newNote });

    if (!error) {
      setNewNote("");
      router.refresh();
      const { data } = await supabase.from("notes").select();
      setNotes(data || []);
    }
    setLoading(false);
  };

  const handleUpdate = async (id: number) => {
    if (!editingTitle.trim()) return;

    setLoading(true);
    const { error } = await supabase
      .from("notes")
      .update({ title: editingTitle })
      .eq("id", id);

    if (!error) {
      setEditingId(null);
      setEditingTitle("");
      router.refresh();
      const { data } = await supabase.from("notes").select();
      setNotes(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (!error) {
      router.refresh();
      setNotes(notes.filter((note) => note.id !== id));
    }
  };

  const startEditing = (note: Note) => {
    setEditingId(note.id);
    setEditingTitle(note.title);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Client-side notes</h2>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add new note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="border p-2 rounded flex-1"
          disabled={loading}
        />
        <button
          onClick={handleAdd}
          disabled={loading || !newNote.trim()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </div>

      <div className="space-y-2">
        {notes.map((note) => (
          <div
            key={note.id}
            className="flex items-center gap-2 p-2 border rounded"
          >
            {editingId === note.id ? (
              <>
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className="border p-1 rounded flex-1"
                  disabled={loading}
                />
                <button
                  onClick={() => handleUpdate(note.id)}
                  disabled={loading || !editingTitle.trim()}
                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 disabled:opacity-50"
                >
                  Save
                </button>
                <button
                  onClick={cancelEditing}
                  disabled={loading}
                  className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="flex-1">{note.title}</span>
                <button
                  onClick={() => startEditing(note)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
