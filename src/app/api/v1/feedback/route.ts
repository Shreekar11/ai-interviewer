import { NextRequest, NextResponse } from "next/server";
import { InterviewService } from "@/services/interview.service";
import { parseInterviewFeedback } from "@/utils/parse-feedback";
import { UserService } from "@/services/user.service";

/*
68a39d4c-f97a-4620-a077-88018c85c040 [
  [
    'Assistant',
    'Welcome to the AI interview! This interview will consist of questions about your resume and a case study style question to assess your technical skills. Minimize long pauses during you your responses, otherwise you may be cut off prematurely. Are you ready to begin the interview?'
  ],
  [ 'Client', "Yes. I'm ready." ],
  [
    'Assistant',
    "Great, let's get started. 1. Describe a challenging situation you faced while building a complex feature using React and TypeScript, and explain how you leveraged TypeScript's type system to overcome it. Detail the specific error(s) encountered and your problem-solving process."
  ],
  [
    'Client',
    "Yeah. So I've been doing wonderful projects using React. With TypeScript. And, basically, I have used React for implementing our daily user interfaces. And TypeScript, which is a super set of JavaScript. For using type types of code."
  ],
  [
    'Assistant',
    'Thank you for sharing your experience. Could you please provide a specific example of a challenging situation you encountered while building a feature with React and TypeScript, and explain how you utilized TypeScript’s type system to resolve the issue?'
  ],
  [
    'Client',
    'So property would any challenges which are faced building React application with React and TypeScript. There is no such challenge which I faced, but the, the process which I followed was, like, first of all, using TypeScript was to fetch the data from the back end server, and, and change the data according to the type which we have declared on the front end. So yeah.'
  ],
  [
    'Assistant',
    'Thank you for your response. To further understand your experience, can you describe a specific instance where you encountered a type error or a mismatch between the front-end and back-end data, and how you resolved it using TypeScript?'
  ],
  [
    'Client',
    'Thanks for the interview. I would like to end this interview now.'
  ],
  [
    'Assistant',
    'Thank you for your time today. If you wish to revisit these questions or continue at another time, feel free to do so. Please leave the room at your convenience. Goodbye.'
  ],
  [ 'Client', 'Before that, could you give me feedback of my' ],
  [
    'Assistant',
    'Certainly. Based on the brief interaction, it seems you have experience with React and TypeScript; however, it would be beneficial to provide specific examples and clearer explanations when discussing your experiences and problem-solving processes. This will help convey your technical problem-solving abilities more effectively. In future interviews, focusing on particular challenges and detailing how you addressed them can significantly strengthen your responses. Thank you for your participation, and I wish you the best in your future endeavors. Goodbye.'
  ]
]
*/

export async function POST(req: NextRequest) {
  try {
    // const { room_id: interviewId, transcription } = await req.json();
    const interviewId = "68a39d4c-f97a-4620-a077-88018c85c040";
    const authId = "7011e86a-5c32-4a11-8acc-8fd512e37ba9";
    const transcription = [
      [
        "Assistant",
        "Welcome to the AI interview! This interview will consist of questions about your resume and a case study style question to assess your technical skills. Minimize long pauses during you your responses, otherwise you may be cut off prematurely. Are you ready to begin the interview?",
      ],
      ["Client", "Yes. I'm ready."],
      [
        "Assistant",
        "Great, let's get started. 1. Describe a challenging situation you faced while building a complex feature using React and TypeScript, and explain how you leveraged TypeScript's type system to overcome it. Detail the specific error(s) encountered and your problem-solving process.",
      ],
      [
        "Client",
        "Yeah. So I've been doing wonderful projects using React. With TypeScript. And, basically, I have used React for implementing our daily user interfaces. And TypeScript, which is a super set of JavaScript. For using type types of code.",
      ],
      [
        "Assistant",
        "Thank you for sharing your experience. Could you please provide a specific example of a challenging situation you encountered while building a feature with React and TypeScript, and explain how you utilized TypeScript’s type system to resolve the issue?",
      ],
      [
        "Client",
        "So property would any challenges which are faced building React application with React and TypeScript. There is no such challenge which I faced, but the, the process which I followed was, like, first of all, using TypeScript was to fetch the data from the back end server, and, and change the data according to the type which we have declared on the front end. So yeah.",
      ],
      [
        "Assistant",
        "Thank you for your response. To further understand your experience, can you describe a specific instance where you encountered a type error or a mismatch between the front-end and back-end data, and how you resolved it using TypeScript?",
      ],
      [
        "Client",
        "Thanks for the interview. I would like to end this interview now.",
      ],
      [
        "Assistant",
        "Thank you for your time today. If you wish to revisit these questions or continue at another time, feel free to do so. Please leave the room at your convenience. Goodbye.",
      ],
      ["Client", "Before that, could you give me feedback of my"],
      [
        "Assistant",
        "Certainly. Based on the brief interaction, it seems you have experience with React and TypeScript; however, it would be beneficial to provide specific examples and clearer explanations when discussing your experiences and problem-solving processes. This will help convey your technical problem-solving abilities more effectively. In future interviews, focusing on particular challenges and detailing how you addressed them can significantly strengthen your responses. Thank you for your participation, and I wish you the best in your future endeavors. Goodbye.",
      ],
    ];

    // Formatting transcription data
    const transcript = [];
    for (let i = 0; i < transcription.length; i += 2) {
      transcript.push({
        assistant: transcription[i][1] || "",
        client: transcription[i + 1]?.[1] || "",
      });
    }

    const userService = new UserService();

    // Try to get user with service role to bypass RLS
    const userResult = await userService.getAuthUserWithServiceRole(authId);

    if (!userResult.status) {
      return NextResponse.json(
        {
          status: false,
          message: userResult.message,
          error: userResult.error,
        },
        { status: 404 }
      );
    }

    // const model_response = await fetch(
    //   `${process.env.NEXT_PUBLIC_BASEURL}/api/v1/generate`,
    //   {
    //     method: "POST",
    //     body: JSON.stringify({ transcript }),
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );

    // if (!model_response.ok) {
    //   const res = await model_response.json();
    //   throw new Error(JSON.stringify(res.message));
    // }

    // const feedback_data = await model_response.json();

    // const feedbacks = feedback_data.data?.split(/\n{2,}/);

    const result = {
      feedback: [
        {
          label: "GOOD",
          question:
            "Welcome to the AI interview! This interview will consist of questions about your resume and a case study style question to assess your technical skills. Minimize long pauses during you your responses, otherwise you may be cut off prematurely. Are you ready to begin the interview?",
          yourAnswer: "Yes. I'm ready.",
          feedback: "This is a suitable and concise confirmation.",
          category: "Formality of Language, Conciseness",
          suggestionsForImprovement: "None",
        },
        {
          label: "NEEDS_IMPROVEMENT",
          question:
            "Great, let's get started. 1. Describe a challenging situation you faced while building a complex feature using React and TypeScript, and explain how you leveraged TypeScript's type system to overcome it. Detail the specific error(s) encountered and your problem-solving process.",
          yourAnswer:
            "Yeah. So I've been doing wonderful projects using React. With TypeScript. And, basically, I have used React for implementing our daily user interfaces. And TypeScript, which is a super set of JavaScript. For using type types of code.",
          feedback:
            "This answer is too general and doesn't address the specific question about a challenging situation and how you overcame it. You're simply defining React and TypeScript.",
          category:
            "Relevance to Question, Completeness of Answer, Clarity of Content",
          suggestionsForImprovement:
            "Provide a specific example of a challenge you faced. Explain the error encountered and your problem-solving approach using TypeScript.",
        },
        {
          label: "NEEDS_IMPROVEMENT",
          question:
            "Thank you for sharing your experience. Could you please provide a specific example of a challenging situation you encountered while building a feature with React and TypeScript, and explain how you utilized TypeScript’s type system to resolve the issue?",
          yourAnswer:
            "So property would any challenges which are faced building React application with React and TypeScript. There is no such challenge which I faced, but the, the process which I followed was, like, first of all, using TypeScript was to fetch the data from the back end server, and, and change the data according to the type which we have declared on the front end. So yeah.",
          feedback:
            "Claiming you haven't faced any challenges is not a good response. It implies a lack of experience or inability to recognize challenges. Describing the general process of fetching and typing data is not a specific example of problem-solving.",
          category:
            "Relevance to Question, Completeness of Answer, Clarity of Content",
          suggestionsForImprovement:
            'Even if the project was smooth, create a hypothetical scenario or a common challenge you\'ve researched and explain how you would address it. Focus on the "how" using TypeScript.',
        },
        {
          label: "NEEDS_IMPROVEMENT",
          question:
            "Thank you for your response. To further understand your experience, can you describe a specific instance where you encountered a type error or a mismatch between the front-end and back-end data, and how you resolved it using TypeScript?",
          yourAnswer:
            "Thanks for the interview. I would like to end this interview now.",
          feedback:
            "Abruptly ending the interview is highly unprofessional and suggests an inability to handle difficult questions or a lack of preparation.",
          category:
            "Relevance to Question, Formality of Language, Completeness of Answer",
          suggestionsForImprovement:
            "Even if you don't know the answer, try to explain your thought process or ask for clarification. Never end an interview prematurely.",
        },
        {
          label: "GOOD",
          question:
            "Thank you for your time today. If you wish to revisit these questions or continue at another time, feel free to do so. Please leave the room at your convenience. Goodbye.",
          yourAnswer: "Before that, could you give me feedback of my",
          feedback: "It's good that you are seeking feedback.",
          category: "Formality of Language",
          suggestionsForImprovement: "None",
        },
        {
          label: "GOOD",
          question:
            "Certainly. Based on the brief interaction, it seems you have experience with React and TypeScript; however, it would be beneficial to provide specific examples and clearer explanations when discussing your experiences and problem-solving processes. This will help convey your technical problem-solving abilities more effectively. In future interviews, focusing on particular challenges and detailing how you addressed them can significantly strengthen your responses. Thank you for your participation, and I wish you the best in your future endeavors. Goodbye.",
          yourAnswer: "",
          feedback: "No answer provided.",
          category: "N/A",
          suggestionsForImprovement: "N/A",
        },
      ],
      summary: {
        relevantResponses:
          "Your responses lacked specific details and alignment with the core question about problem-solving with TypeScript.",
        clarityAndStructure:
          "Your explanations were too general and lacked a clear, structured approach.",
        professionalLanguage:
          "While your language was generally polite, abruptly ending the interview was highly unprofessional.",
        initialIdeas:
          "The initial responses showed some awareness of React and TypeScript concepts, but lacked depth.",
        additionalNotableAspects:
          "You need to prepare specific examples of challenges you've faced and how you resolved them. Practicing common interview questions is crucial.",
        score: "2/10",
      },
    };

    // Use the interview service to save feedback data
    const interviewService = new InterviewService();
    await interviewService.saveFeedbackData(interviewId, result);

    return NextResponse.json({
      status: true,
      message: "Feedback generated successfully!",
      data: {
        feedback: result.feedback,
        summary: result.summary,
      },
    });
  } catch (err: any) {
    console.error("Error: ", err);
    return NextResponse.json(
      {
        status: false,
        message: "Error transcripting interview",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
