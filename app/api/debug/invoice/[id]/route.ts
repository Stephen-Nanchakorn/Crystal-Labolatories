// app/api/debug/invoice/[id]/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    const invoiceId = params.id;
    
    const { data: invoice, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("id", invoiceId)
      .single();
    
    return NextResponse.json({
      invoiceId,
      user: user ? { id: user.id, email: user.email } : null,
      invoice,
      error: error?.message,
      exists: !!invoice,
      isOwner: invoice?.user_id === user?.id,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}