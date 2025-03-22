import { InterviewFeedback } from "@/types/interview";
import { createClient } from "../../supabase/client";

/**
 * Service for handling interview-related database operations
 */
export class InterviewService {
  /**
   * Save interview details, feedbacks, and summary to the database
   * @param interviewId - The ID of the interview
   * @param result - The parsed feedback results
   * @returns The interview details with related data
   */
  static async saveFeedbackData(
    interviewId: string,
    result: InterviewFeedback
  ) {
    const supabase = createClient();

    // Create interview details
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

    // Save feedback items
    const feedback = result.feedbacks.map(async (feedback, index) => {
      const { error: feedbackResponseError } = await supabase
        .from("feedback")
        .insert({
          fk_interview_details_id: interviewDetails.id,
          label: feedback.label,
          question: feedback.question,
          answer: feedback.yourAnswer,
          feedback: feedback.feedback,
          suggesstion_for_improvement: feedback.suggesstionForImprovement,
        });

      if (feedbackResponseError) {
        throw new Error(
          `Error saving feedback ${index}: ${feedbackResponseError}`
        );
      }
    });

    // Save summary
    const { error: summaryError } = await supabase.from("summaries").insert({
      fk_interview_details_id: interviewDetails.id,
      relevant_responses: result.summary.relevantResponses,
      clarity_and_structure: result.summary.clarityAndStructure,
      professional_language: result.summary.professionalLanguage,
      initial_ideas: result.summary.initialIdeas,
      additional_notable_aspects: result.summary.additionalNotableAspects,
      score: result.summary.score,
    });

    if (summaryError) {
      throw new Error(`Error saving summary: ${summaryError}`);
    }

    return interviewDetails;
  }
}
