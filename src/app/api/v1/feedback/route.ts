import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { room_id: user_id, transcription } = await req.json();

    // Formatting transcription data
    const transcript = [];
    for (let i = 0; i < transcription.length; i += 2) {
      transcript.push({
        assistant: transcription[i][1] || "",
        client: transcription[i + 1]?.[1] || "",
      });
    }

    const gpt_response = await fetch(
      `${process.env.NEXT_PUBLIC_BASEURL}/api/v1/generate`,
      {
        method: "POST",
        body: JSON.stringify({ transcript }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!gpt_response.ok) {
      const res = await gpt_response.json();
      throw new Error(JSON.stringify(res.message));
    }

    const feedback_data = await gpt_response.json();

    const feedbacks = feedback_data.data?.split(/\n{2,}/);

    const result = parseInterviewFeedback(feedbacks || []);
    return NextResponse.json({
      status: true,
      message: "Feedback generated successfully!",
      data: {
        feedback: result.feedbacks,
        summary: result.summary,
      },
    });
  } catch (err: any) {
    console.error("Error: ", err);
    return NextResponse.json(
      {
        status: false,
        message: "Error transcripting interview",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
