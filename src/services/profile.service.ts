import { Profile } from "@/types";
import { createClient } from "../../supabase/client";

/**
 * Service for handling profile-related database operations
 */
export class ProfileService {
  /**
   * Create a new profile for the current user
   * @param data Profile data to create
   * @returns The created profile
   */
  static async createProfile(data: Profile) {
    const { first_name, last_name, about_me, experience, projects, skills } =
      data;

    const supabase = createClient();
    const session = await supabase.auth.getUser();

    const {
      data: { user },
    } = session;

    if (!user) {
      throw new Error("No user found");
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .insert({
        first_name,
        last_name,
        about_me,
      })
      .select("*")
      .single();

    if (profileError) {
      throw new Error(`Error inserting profile: ${profileError.message}`);
    }

    const profileId = profile.id;

    const insertExperiences = experience.map((exp) => ({
      ...exp,
      fk_profile_id: profileId,
    }));

    const insertProjects = projects.map((proj) => ({
      ...proj,
      fk_profile_id: profileId,
    }));

    const insertSkills = skills.map((skill) => ({
      ...skill,
      fk_profile_id: profileId,
    }));

    const { error: experienceError } = await supabase
      .from("experiences")
      .insert(insertExperiences);

    if (experienceError) {
      throw new Error(
        `Error inserting experiences: ${experienceError.message}`
      );
    }

    const { error: projectError } = await supabase
      .from("projects")
      .insert(insertProjects);

    if (projectError) {
      throw new Error(`Error inserting projects: ${projectError.message}`);
    }

    const { error: skillError } = await supabase
      .from("skills")
      .insert(insertSkills);

    if (skillError) {
      throw new Error(`Error inserting skills: ${skillError.message}`);
    }

    return profile;
  }

  /**
   * Get the profile for the current user
   * @returns The profile with related data
   */
  static async getProfileByUserId() {
    const supabase = createClient();

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    // Get profile with related data
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select(
        `
        *,
        experiences (*),
        projects (*),
        skills (*)
      `
      )
      .eq("fk_user_id", user.id)
      .single();

    if (profileError) {
      throw new Error(`Error fetching profile: ${profileError.message}`);
    }

    return profile;
  }

  /**
   * Update an existing profile and all related data
   * @param data Updated profile data
   * @returns The updated profile with related data
   */
  static async updateProfile(data: Profile) {
    const {
      id,
      first_name,
      last_name,
      about_me,
      experience,
      projects,
      skills,
    } = data;

    const supabase = createClient();

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name,
          last_name,
          about_me,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (profileError) {
        throw new Error(`Error updating profile: ${profileError.message}`);
      }

      // Delete existing related data
      const { error: deleteExpError } = await supabase
        .from("experiences")
        .delete()
        .eq("fk_profile_id", id);

      const { error: deleteProjError } = await supabase
        .from("projects")
        .delete()
        .eq("fk_profile_id", id);

      const { error: deleteSkillError } = await supabase
        .from("skills")
        .delete()
        .eq("fk_profile_id", id);

      if (deleteExpError || deleteProjError || deleteSkillError) {
        throw new Error("Error deleting existing data");
      }

      // Insert new experiences
      if (experience && experience.length > 0) {
        const { error: expError } = await supabase.from("experiences").insert(
          experience.map((exp) => ({
            ...exp,
            fk_profile_id: id,
          }))
        );

        if (expError) {
          throw new Error(`Error updating experiences: ${expError.message}`);
        }
      }

      // Insert new projects
      if (projects && projects.length > 0) {
        const { error: projError } = await supabase.from("projects").insert(
          projects.map((proj) => ({
            ...proj,
            fk_profile_id: id,
          }))
        );

        if (projError) {
          throw new Error(`Error updating projects: ${projError.message}`);
        }
      }

      // Insert new skills
      if (skills && skills.length > 0) {
        const { error: skillError } = await supabase.from("skills").insert(
          skills.map((skill) => ({
            ...skill,
            fk_profile_id: id,
          }))
        );

        if (skillError) {
          throw new Error(`Error updating skills: ${skillError.message}`);
        }
      }

      // Fetch and return updated profile with all related data
      const { data: updatedProfile, error: fetchError } = await supabase
        .from("profiles")
        .select(
          `
          *,
          experiences (*),
          projects (*),
          skills (*)
        `
        )
        .eq("id", id)
        .single();

      if (fetchError) {
        throw new Error(
          `Error fetching updated profile: ${fetchError.message}`
        );
      }

      return updatedProfile;
    } catch (error: any) {
      throw new Error(`Error updating profile: ${error.message}`);
    }
  }
}
