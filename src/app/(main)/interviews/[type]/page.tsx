"use client"; // Ensure this is a Client Component

import { useParams } from "next/navigation";
import InterviewCard from "@/components/interview/InterviewCard";

const allInterviews = {
  personal: [
    { id: 1, title: "Frontend Developer Interview", date: "12 May 2023", company: "Tech Solutions Inc." },
    { id: 2, title: "React Developer Position", date: "18 May 2023", company: "Digital Innovators" },
  ],
  custom: [
    { id: 3, title: "Custom JavaScript Interview", date: "22 May 2023", tags: ["JavaScript", "React", "TypeScript"] },
    { id: 4, title: "Backend API Testing", date: "28 May 2023", tags: ["Postman", "REST", "GraphQL"] },
  ],
};

const InterviewsPage = () => {
  const params = useParams(); 
  const type = params?.type;

  // Check if the type is valid
  if (typeof type !== "string" || !(type in allInterviews)) {
    return <p className="text-center text-gray-500">Invalid interview type</p>;
  }

  const interviews = allInterviews[type as keyof typeof allInterviews];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6 capitalize">{type} Interviews</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {interviews.map((interview) => (
          <InterviewCard
            key={interview.id}
            title={interview.title}
            date={interview.date}
            type={type as "personal" | "custom"}
            tags={"tags" in interview ? interview.tags : []} // ✅ Ensures `tags` is always an array
          />
        ))}
      </div>
    </div>
  );
};

export default InterviewsPage;
