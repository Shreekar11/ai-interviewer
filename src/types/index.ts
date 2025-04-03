export interface Profile {
  id?: string;
  first_name: string;
  last_name: string;
  about_me: string;
  experience: Experience[];
  projects: Project[];
  skills: Skill[];
}

export interface Experience {
  company: string;
  position: string;
  description: string;
  start_date: string;
  end_date: string;
}

export interface Project {
  project_name: string;
  description: string;
  start_date: string;
  end_date: string;
}

export interface Skill {
  name: string;
}