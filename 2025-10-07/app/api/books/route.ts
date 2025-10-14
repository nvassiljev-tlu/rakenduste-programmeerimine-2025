import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: books, error } = await supabase.from("books").select("*");
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ books });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { title, author, isbn, published_year } = await request.json();
  
  if (!title || !author) {
    return NextResponse.json({ error: "Title and author are required" }, { status: 400 });
  }
  
  const { data, error } = await supabase
    .from("books")
    .insert({ 
      title, 
      author, 
      isbn: isbn || null, 
      published_year: published_year || null 
    })
    .select()
    .single();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ book: data }, { status: 201 });
}
