import { openai } from "@/utils/openai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { transcript } = await req.json();
    const prompt = `Analyze the following interview conversation based on the transcript and provide feedback directly to the interviewee. 
        ${transcript
          .map(
            (
              exchange: {
                assistant: string;
                client: string;
              },
              index: number
            ) => `
        Question ${index + 1}: ${exchange.assistant}
        Answer ${index + 1}: ${exchange.client}
        `
          )
          .join("\n")}
        
        For each response, STRICTLY FOLLOW this exact formatting WITHOUT ANY ASTERISKS:
        
        Label: [Good/Needs Improvement]
        Question: [Interviewer's question]
        Your Answer: [Interviewee's answer]
        Feedback: [Provide direct feedback to the interviewee]
        Category: [List applicable categories from:
        - Formality of Language
        - Clarity of Content
        - Logical Organization
        - Conciseness
        - Relevance to Question
        - Completeness of Answer]
        Suggestions for improvement: [Specific improvements for each listed category]
        
        Overall Performance Summary
        After analyzing all individual responses, provide a summary using this format:

        For each response, STRICTLY FOLLOW this exact formatting WITHOUT ANY ASTERISKS:

        Relevant Responses: [How well answers aligned with questions]
        Clarity and Structure: [Coherence and organization of answers]
        Professional Language: [Professionalism of language]
        Initial Ideas: [Originality or thoughtfulness]
        Additional Notable Aspects: [Other strengths or improvement areas]
        Score: [X/10]
        
        IMPORTANT INSTRUCTIONS:
        1. Use the EXACT format shown above
        2. Do NOT use asterisks anywhere
        3. Be direct and specific in your feedback
        4. Address the interviewee directly
        
        Example:
        Label: Needs Improvement
        Question: Tell me about your previous work experience
        Your Answer: I worked at companies and did stuff
        Feedback: Your response lacks specific details and professional language
        Category: Formality of Language, Clarity of Content, Completeness of Answer
        Suggestions for improvement: Use more formal business language, Provide specific details about roles and responsibilities, Include timeline and company names with concrete achievements
        
        Example Overall Performance Summary:
        Relevant Responses: Your responses needed more alignment with the questions asked
        Clarity and Structure: Responses lacked proper structure and organization
        Professional Language: Language used was too informal for an interview setting
        Initial Ideas: You showed some creative thinking in your approaches
        Additional Notable Aspects: Need to improve response completeness
        Score: 5/10`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant that provides structured, direct feedback to interviewees on their responses, including an overall performance summary.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 2500,
      temperature: 0.7,
    });

    const gpt_feedback =
      response.choices[0].message.content &&
      response.choices[0].message.content.trim();

    return NextResponse.json({
      status: true,
      message: "Feedback generated successfully!",
      data: gpt_feedback,
    });
  } catch (err: any) {
    console.log("Error: ", err);
  }
}
