import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../../supabase/client";

export async function POST(req: NextRequest) {
  try {
    const { room_id: interviewId, transcription } = await req.json();

    const supabase = createClient();

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

    const { data: interviewDetails, error: interviewDetailsError } =
      await supabase
        .from("interview_details")
        .insert({ fk_interview_id: interviewId })
        .select("*")
        .single();

    if (interviewDetailsError) {
      throw new Error(
        `Error inserting interview detail: ${interviewDetailsError.message}`
      );
    }

    const feedback = result.feedbacks.map(async (feedback) => {
      await supabase.from("feedback").insert({
        fk_interview_details_id: interviewDetails.id,
        label: feedback.label,
        question: feedback.question,
        answer: feedback.yourAnswer,
        feedback: feedback.feedback,
        suggesstion_for_improvement: feedback.suggesstionForImprovement,
      });
    });

    await supabase.from("summaries").insert({
      fk_interview_details_id: interviewDetails.id,
      relevant_responses: result.summary.relevantResponses,
      clarity_and_structure: result.summary.clarityAndStructure,
      professional_language: result.summary.professionalLanguage,
      initial_ideas: result.summary.initialIdeas,
      additional_notable_aspects: result.summary.additionalNotableAspects,
      score: result.summary.score,
    });

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
