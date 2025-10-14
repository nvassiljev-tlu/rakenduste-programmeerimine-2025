import { createClient } from "@/lib/supabase/server";
import NotesClient from "./NotesClient";

export default async function Page() {
  const supabase = await createClient();
  const { data: notes } = await supabase.from("notes").select();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Notes App</h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Server-side notes</h2>
        <div className="bg-gray-100 p-4 rounded">
          {notes?.length ? (
            <ul className="space-y-2">
              {notes.map((note) => (
                <li key={note.id} className="p-2 bg-black rounded shadow">
                  {note.title}
                </li>
              ))}
            </ul>
          ) : (
            <p>No notes found</p>
          )}
        </div>
      </div>

      <NotesClient initialNotes={notes || []} />
    </div>
  );
}
