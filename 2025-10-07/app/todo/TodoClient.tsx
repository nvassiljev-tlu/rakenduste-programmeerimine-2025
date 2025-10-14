"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Todo = {
  id: number;
  title: string;
  completed?: boolean;
};

type Props = {
  initialTodos: Todo[];
};

export default function TodoClient({ initialTodos }: Props) {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTodos(initialTodos);
  }, [initialTodos]);

  const handleAdd = async () => {
    if (!newTodo.trim()) return;

    setLoading(true);
    const { error } = await supabase.from("todos").insert({
      title: newTodo,
      completed: false,
    });

    if (!error) {
      setNewTodo("");
      router.refresh();
      const { data } = await supabase.from("todos").select();
      setTodos(data || []);
    }
    setLoading(false);
  };

  const handleUpdate = async (id: number) => {
    if (!editingTitle.trim()) return;

    setLoading(true);
    const { error } = await supabase
      .from("todos")
      .update({ title: editingTitle })
      .eq("id", id);

    if (!error) {
      setEditingId(null);
      setEditingTitle("");
      router.refresh();
      const { data } = await supabase.from("todos").select();
      setTodos(data || []);
    }
    setLoading(false);
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  const toggleComplete = async (id: number, completed: boolean | undefined) => {
    const { error } = await supabase
      .from("todos")
      .update({ completed: !completed })
      .eq("id", id);

    if (!error) {
      router.refresh();
      const { data } = await supabase.from("todos").select();
      setTodos(data || []);
    }
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("todos").delete().eq("id", id);
    if (!error) {
      router.refresh();
      setTodos(todos.filter((todo) => todo.id !== id));
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Client-side todos</h2>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add new todo..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="border p-2 rounded flex-1"
          disabled={loading}
        />
        <button
          onClick={handleAdd}
          disabled={loading || !newTodo.trim()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </div>

      <div className="space-y-2">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center gap-2 p-3 border rounded bg-black shadow"
          >
            <input
              type="checkbox"
              checked={todo.completed || false}
              onChange={() => toggleComplete(todo.id, todo.completed)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />

            {editingId === todo.id ? (
              <>
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className="border p-1 rounded flex-1"
                  disabled={loading}
                />
                <button
                  onClick={() => handleUpdate(todo.id)}
                  disabled={loading || !editingTitle.trim()}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={cancelEditing}
                  disabled={loading}
                  className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span
                  className={`flex-1 ${
                    todo.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  {todo.title}
                </span>

                <button
                  onClick={() => toggleComplete(todo.id, todo.completed)}
                  className={`px-3 py-1 rounded text-white text-sm ${
                    todo.completed
                      ? "bg-gray-500 hover:bg-gray-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {todo.completed ? "Cancel" : "Completed"}
                </button>

                <button
                  onClick={() => startEditing(todo)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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
