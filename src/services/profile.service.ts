import { Profile } from "@/types";
import { createClient } from "../../supabase/client";

export const createProfile = async (data: Profile) => {
  const { first_name, last_name, about_me, experience, projects, skills } =
    data;
  try {
    const supabase = await createClient();
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
      .select("id")
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
  } catch (error) {
    console.log("Error: ", error);
  }
};