import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const user_id = url.searchParams.get("user_id");

  try {
    const supabase = createClient();
    const questions = await supabase
      .from("interviews")
      .select("questions")
      .eq("fk_user_id", user_id)
      .single();

    if (!questions) {
      return NextResponse.json(
        {
          status: false,
          message: "Interview questions not found!",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        context: questions,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error: ", error);
  }
}
