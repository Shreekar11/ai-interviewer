export interface Profile {
  personal: {
    firstName: string;
    lastName: string;
    aboutMe: string;
  };
  projects: {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
  }[];
  experience: {
    company: string;
    position: string;
    description: string;
    startDate: string;
    endDate: string;
  }[];
  skills: { name: string }[];
}
