import { NextRequest, NextResponse } from "next/server";
import { InterviewService } from "@/services/interview.service";
import { parseInterviewFeedback } from "@/utils/parse-feedback";
import { UserService } from "@/services/user.service";

export async function POST(req: NextRequest) {
  try {
    const { room_id, transcription } = await req.json();
    const [interviewId, authId] = room_id.split("&");

    // Formatting transcription data
    const transcript = [];
    for (let i = 0; i < transcription.length; i += 2) {
      transcript.push({
        assistant: transcription[i][1] || "",
        client: transcription[i + 1]?.[1] || "",
      });
    }

    const userService = new UserService();

    // Try to get user with service role to bypass RLS
    const userResult = await userService.getAuthUserWithServiceRole(authId);

    if (!userResult.status) {
      return NextResponse.json(
        {
          status: false,
          message: userResult.message,
          error: userResult.error,
        },
        { status: 404 }
      );
    }

    // Push job to Redis queue
    await processFeedbackAsync(interviewId, transcript);

    return NextResponse.json({
      status: true,
      message: "Feedback generation started",
      data: {
        interviewId,
        status: "processing",
      },
    });
  } catch (err: any) {
    console.error("Error: ", err);
    return NextResponse.json(
      {
        status: false,
        message: "Error initiating feedback generation",
        error: err.message,
      },
      { status: 500 }
    );
  }
}

// New endpoint to check feedback status
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const interviewId = searchParams.get('interviewId');

    if (!interviewId) {
      return NextResponse.json(
        {
          status: false,
          message: "Interview ID is required",
        },
        { status: 400 }
      );
    }

    const interviewService = new InterviewService();
    const interview = await interviewService.getInterviewById(interviewId);

    return NextResponse.json({
      status: true,
      data: interview,
    });
  } catch (err: any) {
    console.error("Error: ", err);
    return NextResponse.json(
      {
        status: false,
        message: "Error checking feedback status",
        error: err.message,
      },
      { status: 500 }
    );
  }
}

async function processFeedbackAsync(interviewId: string, transcript: any[]) {
  try {
    const model_response = await fetch(
      `${process.env.NEXT_PUBLIC_BASEURL}/api/v1/generate`,
      {
        method: "POST",
        body: JSON.stringify({ transcript }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!model_response.ok) {
      const res = await model_response.json();
      throw new Error(JSON.stringify(res.message));
    }

    const feedback_data = await model_response.json();
    const feedbacks = feedback_data.data?.split(/\n{2,}/);
    const result = parseInterviewFeedback(feedbacks);

    // Save feedback data
    const interviewService = new InterviewService();
    await interviewService.saveFeedbackData(interviewId, result);

    return {
      status: true,
      message: "Feedback saved successfully",
      data: result,
    };
  } catch (err: any) {
    console.error("Error in async processing: ", err);
    return {
      status: false,
      message: "Error saving feedback",
      error: err.message,
    };
  }
}
