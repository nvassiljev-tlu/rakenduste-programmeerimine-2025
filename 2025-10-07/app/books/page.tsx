import { createClient } from "@/lib/supabase/server";
import BooksClient from "./BooksClient";

export default async function Page() {
  const supabase = await createClient();
  const { data: books } = await supabase.from("books").select();

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Books Library</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Server-side books
        </h2>
        <div className="bg-gray-100 p-4 rounded-lg">
          {books?.length ? (
            <div className="space-y-2">
              {books.map((book) => (
                <div key={book.id} className="p-3 bg-white rounded shadow-sm">
                  <div className="font-medium">{book.title}</div>
                  <div className="text-sm text-gray-600">by {book.author}</div>
                  {book.isbn && (
                    <div className="text-xs text-gray-500">
                      ISBN: {book.isbn}
                    </div>
                  )}
                  {book.published_year && (
                    <div className="text-xs text-gray-500">
                      Year: {book.published_year}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No books found</p>
          )}
        </div>
      </div>

      <BooksClient initialBooks={books || []} />
    </div>
  );
}
