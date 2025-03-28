// src/app/api/v1/personalQuestions/route.ts

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { experience, projects, skills } = body;

    // Validate input
    if (!experience || !Array.isArray(experience) || !projects || !Array.isArray(projects) || !skills || !Array.isArray(skills)) {
      return NextResponse.json(
        { error: "Invalid input. Please provide experience, projects, and skills as arrays." },
        { status: 400 }
      );
    }

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
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a smart interview assistant that generates personalized interview questions." },
        { role: "user", content: prompt }
      ],
      temperature: 0.8,
    });

    const content = response.choices[0].message.content;
    
    // @ts-ignore
    const questions = content
      .split("\n")
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0 && (line.endsWith("?") || /^\d+\./.test(line)))
      .map((line: string) => line.replace(/^\d+\.\s*/, ""));

    // Return the questions
    return NextResponse.json({ questions: questions.slice(0, 5) });
  } catch (error: any) {
    console.error("Error generating questions with OpenAI:", error);
    return NextResponse.json(
      { error: "Failed to generate personal interview questions" },
      { status: 500 }
    );
  }
}