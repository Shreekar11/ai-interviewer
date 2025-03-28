// utils/generatePersonalQuestions.ts

export async function generatePersonalQuestions(
    experience: any[],
    projects: any[],
    skills: any[]
  ) {
    try {
      // Import OpenAI in your file
      const OpenAI = require("openai");
  
      // Initialize OpenAI client
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
  
      // Prepare the context for OpenAI
      const experienceContext = experience.map((exp: any) => 
        `${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate}): ${exp.description}`
      ).join("\n");
  
      const projectsContext = projects.map((proj: any) => 
        `Project: ${proj.name} - ${proj.description}`
      ).join("\n");
  
      const skillsContext = skills.map((skill: any) => skill.name).join(", ");
  
      // Create the prompt for OpenAI
      const prompt = `
      Based on the following user profile, generate 5 personalized interview questions:
  
      Experience:
      ${experienceContext}
  
      Projects:
      ${projectsContext}
  
      Skills:
      ${skillsContext}
  
      Generate 5 questions that cover the user's experience, projects, and skills. Focus on challenging 
      technical questions related to their skills and projects, and behavioral questions based on their experience.
      Return only the questions as an array of strings, without any additional text.
      `;
  
      // Call OpenAI API
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a smart interview assistant that generates personalized interview questions." },
          { role: "user", content: prompt }
        ],
        temperature: 0.8,
      });
  

      const content = response.choices[0].message.content;
      
      const questions = content
        .split("\n")
        .map((line: string) => line.trim())
        .filter((line: string) => line.length > 0 && (line.endsWith("?") || /^\d+\./.test(line)))
        .map((line: string) => line.replace(/^\d+\.\s*/, ""));
  
      return questions.slice(0, 5); // Ensure we return exactly 10 questions
    } catch (error: any) {
      console.error("Error generating questions with OpenAI:", error);
      throw new Error("Failed to generate personal interview questions");
    }
  }