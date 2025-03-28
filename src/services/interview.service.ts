import { InterviewFeedback } from "@/types/interview";
import { createClient } from "../../supabase/client";
import { generatePersonalQuestions } from "@/utils/generatePersonalQuestions";

interface InterviewData {
  name: string;
  type: InterviewType;
  questions: string[];
  skills?: string[];
  jobDescription?: string;
}

// Enum for interview type (based on your schema)
export enum InterviewType {
  PERSONAL = "PERSONAL",
  CUSTOM = "CUSTOM",
}

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

  public async saveInterviewToSupabase(
    interviewData: InterviewData,
    setError: (error: string | null) => void
  ) {
    try {
      const supabase = await createClient();
      const session = await supabase.auth.getUser();

      const {
        data: { user },
      } = session;

      if (!user) {
        throw new Error("No user found");
      }
      if (interviewData.type === InterviewType.PERSONAL) {
        // Fetch user profile details
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("experience, projects, skills")
          .eq("fkUserId", user.id)
          .single();

        if (profileError) {
          throw new Error(`Error fetching profile: ${profileError.message}`);
        }

        if (!profileData) {
          throw new Error("User profile not found");
        }

        // Extract profile data
        const { experience, projects, skills } = profileData;

        const questions = await generatePersonalQuestions(
          experience,
          projects,
          skills
        );

        interviewData.questions = questions;
        interviewData.skills = skills.map(
          (skill: { name: string }) => skill.name
        );
      }

      const { error: supabaseError } = await supabase
        .from("interviews")
        .insert({
          fkUserId: user.id,
          name: interviewData.name,
          type: interviewData.type,
          questions: interviewData.questions,
          skills: interviewData.skills || [],
          jobDescription: interviewData.jobDescription || null,
          createdAt: new Date(),
        });

      if (supabaseError) {
        throw new Error(`Supabase error: ${supabaseError.message}`);
      }

      return { success: true };
    } catch (err: any) {
      setError(err.message || "An error occurred while saving the interview");
      console.error("Error: ", err);
      throw err;
    }
  }

  public async getInterviewsByUser(setError: (error: string | null) => void) {
    try {
      const supabase = await createClient();
      const session = await supabase.auth.getUser();

      const {
        data: { user },
      } = session;

      if (!user) {
        throw new Error("No user found");
      }

      const { data: interviews, error: supabaseError } = await supabase
        .from("interviews")
        .select("*")
        .eq("fkUserId", user.id);

      if (supabaseError) {
        throw new Error(`Supabase error: ${supabaseError.message}`);
      }

      return interviews;
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching interviews");
      console.error("Error: ", err);
      throw err;
    }
  }

  public async getInterviewById(
    interviewId: string,
    setError: (error: string | null) => void
  ) {
    try {
      const supabase = await createClient();

      const { data: interview, error: supabaseError } = await supabase
        .from("interviews")
        .select("*")
        .eq("id", interviewId)
        .single();

      if (supabaseError) {
        throw new Error(`Supabase error: ${supabaseError.message}`);
      }

      if (!interview) {
        throw new Error("Interview not found");
      }

      return interview;
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching the interview");
      console.error("Error: ", err);
      throw err;
    }
  }

  public async deleteInterview(
    interviewId: string,
    setError: (error: string | null) => void
  ) {
    try {
      const supabase = await createClient();
      const session = await supabase.auth.getUser();

      const {
        data: { user },
      } = session;

      if (!user) {
        throw new Error("No user found");
      }

      // Check if the interview belongs to the user
      const { data: existingInterview, error: fetchError } = await supabase
        .from("interviews")
        .select("fkUserId")
        .eq("id", interviewId)
        .single();

      if (fetchError) {
        throw new Error(`Supabase error: ${fetchError.message}`);
      }

      if (!existingInterview) {
        throw new Error("Interview not found");
      }

      if (existingInterview.fkUserId !== user.id) {
        throw new Error("You don't have permission to delete this interview");
      }

      const { error: deleteError } = await supabase
        .from("interviews")
        .delete()
        .eq("id", interviewId);

      if (deleteError) {
        throw new Error(`Supabase error: ${deleteError.message}`);
      }

      return { success: true };
    } catch (err: any) {
      setError(err.message || "An error occurred while deleting the interview");
      console.error("Error: ", err);
      throw err;
    }
  }
}
