import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: book, error } = await supabase
    .from("books")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
  
  return NextResponse.json({ book });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { title, author, isbn, published_year } = await request.json();
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("books")
    .update({ 
      title, 
      author, 
      isbn: isbn || null, 
      published_year: published_year || null 
    })
    .eq("id", id)
    .select()
    .single();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ book: data });
}

export async function DELETE(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("books")
    .delete()
    .eq("id", id);
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ message: "Book deleted successfully" });
}
