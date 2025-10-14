import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: notes, error } = await supabase.from("notes").select("*");
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ notes });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { title } = await request.json();
  
  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  
  const { data, error } = await supabase
    .from("notes")
    .insert({ title })
    .select()
    .single();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ note: data }, { status: 201 });
}
