import { useEffect, useState } from "react";
import { InterviewData } from "@/types/interview";
import { InterviewService } from "@/services/interview.service";

const updatedInterviews = (interviews: any[]) => {
  const interviewData: InterviewData[] = interviews.map((interview) => {
    const data = {
      name: interview.name,
      type: interview.type,
      questions: interview.questions || [],
      skills: interview.skills || [],
      jobDescription: interview.job_description || "",
      createdAt: interview.created_at,
    };
    return data;
  });

  return interviewData;
};

const useInterviewsType = (type: string | string[]) => {
  const [loading, setLoading] = useState(false);
  const [interviews, setInterviews] = useState<InterviewData[]>([]);

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const interviewService = new InterviewService();
      const result = await interviewService.getInterviewsByType(type);
      if (!result.status) {
        throw new Error(result.message || "Error in retrieving interviews");
      }
      
      const formattedInterviews = updatedInterviews(result.data);

      setInterviews(formattedInterviews);
    } catch (err) {
      console.error("Error: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  return { loading, interviews, fetchInterviews };
};

export default useInterviewsType;
