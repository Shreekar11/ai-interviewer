import { createClient } from "@/utils/supabase/client";
import { InterviewData, InterviewFeedback } from "@/types/interview";
import { generateCustomQuestions } from "@/utils/generate-custom-question";
import { generatePersonalQuestions } from "@/utils/generate-personal-questions";

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
  public async saveFeedbackData(
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

  public async saveInterviewToSupabase(interviewData: InterviewData) {
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        return {
          status: false,
          message: "No active session found. Please sign in again.",
          error: "AUTH_ERROR",
        };
      }

      // Get the current auth user ID
      const authUserId = session.user.id;

      // Get the user record to get the correct user ID from users table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("auth_id", authUserId)
        .single();

      if (userError || !userData) {
        return {
          status: false,
          message: `User account not found: ${
            userError?.message || "Please complete registration"
          }`,
          error: "USER_NOT_FOUND",
        };
      }

      const userId = userData.id;

      if (interviewData.type === "PERSONAL") {
        // Fetch user profile details
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("experience, projects, skills")
          .eq("fk_user_id", userId)
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
      } else {
        const questions = await generateCustomQuestions(
          interviewData.skills || [],
          interviewData.jobDescription || ""
        );

        interviewData.questions = questions;
      }

      const { data: interviewResult, error: supabaseError } = await supabase
        .from("interviews")
        .insert({
          fk_user_id: userId,
          name: interviewData.name,
          type: interviewData.type,
          questions: interviewData.questions,
          skills: interviewData.skills || [],
          job_description: interviewData.jobDescription || [],
          created_at: new Date(),
        })
        .select()
        .single();

      if (supabaseError) {
        throw new Error(`Supabase error: ${supabaseError.message}`);
      }

      return {
        status: true,
        data: interviewResult,
        message: "Interview created successfully!",
      };
    } catch (err: any) {
      console.error("Error: ", err);
      throw err;
    }
  }

  public async getInterviewsByUser() {
    try {
      const supabase = createClient();

      // Get the current user
      const {
        data: { user: current_user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !current_user) {
        throw new Error("Unauthorized");
      }

      // Get user data
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("auth_id", current_user.id)
        .single();

      if (userError) {
        throw new Error(`Error fetching profile: ${userError.message}`);
      }

      const { data: interviews, error: supabaseError } = await supabase
        .from("interviews")
        .select("*")
        .eq("fk_user_id", user.id);

      if (supabaseError) {
        throw new Error(`Supabase error: ${supabaseError.message}`);
      }

      return {
        status: true,
        message: "Interviews retrieved successfully!",
        data: interviews,
      };
    } catch (err: any) {
      console.error("Error: ", err);
      throw err;
    }
  }

  public async getInterviewById(
    interviewId: string,
    setError: (error: string | null) => void
  ) {
    try {
      const supabase = createClient();

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

      return {
        status: true,
        message: "Interviews retrieved successfully!",
        data: interview,
      };
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching the interview");
      console.error("Error: ", err);
      throw err;
    }
  }

  public async getInterviewsByType(type: string | string[]) {
    try {
      const supabase = createClient();

      const { data: interviews, error: supabaseError } = await supabase
        .from("interviews")
        .select("*")
        .eq("type", type)

      if (supabaseError) {
        throw new Error(`Supabase error: ${supabaseError.message}`);
      }

      console.log(interviews);

      if (!(interviews.length > 0)) {
        throw new Error("Interview not found");
      }

      return {
        status: true,
        message: "Interviews retrieved successfully!",
        data: interviews,
      };
    } catch (err: any) {
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
      // Get the current user
      const {
        data: { user: current_user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !current_user) {
        throw new Error("Unauthorized");
      }

      // Get user data
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("auth_id", current_user.id)
        .single();

      if (userError) {
        throw new Error(`Error fetching profile: ${userError.message}`);
      }

      // Check if the interview belongs to the user
      const { data: existingInterview, error: fetchError } = await supabase
        .from("interviews")
        .select("fk_user_id")
        .eq("id", interviewId)
        .single();

      if (fetchError) {
        throw new Error(`Supabase error: ${fetchError.message}`);
      }

      if (!existingInterview) {
        throw new Error("Interview not found");
      }

      if (existingInterview.fk_user_id !== user.id) {
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
