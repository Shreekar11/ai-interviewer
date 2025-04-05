"use client"; // Ensure this is a Client Component

import { useParams } from "next/navigation";
import InterviewCard from "@/components/interview/InterviewCard";
import useInterviewsType from "@/hooks/use-interview-type";
import { Skeleton } from "@/components/ui/skeleton";
import InterviewDialog from "@/components/interview/interview-dialog";

const allInterviews = {
  personal: [
    {
      id: 1,
      title: "Frontend Developer Interview",
      date: "12 May 2023",
      company: "Tech Solutions Inc.",
    },
    {
      id: 2,
      title: "React Developer Position",
      date: "18 May 2023",
      company: "Digital Innovators",
    },
  ],
  custom: [
    {
      id: 3,
      title: "Custom JavaScript Interview",
      date: "22 May 2023",
      tags: ["JavaScript", "React", "TypeScript"],
    },
    {
      id: 4,
      title: "Backend API Testing",
      date: "28 May 2023",
      tags: ["Postman", "REST", "GraphQL"],
    },
  ],
};

const InterviewsPage = () => {
  const params = useParams();
  const type = params?.type;

  const { loading, interviews } = useInterviewsType(
    type.toLocaleString().toUpperCase()
  );

  // Check if the type is valid
  if (typeof type !== "string" || !(type in allInterviews)) {
    return <p className="text-center text-gray-500">Invalid interview type</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6 capitalize">
        {type} Interviews
      </h1>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="border rounded-lg p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
              <div className="flex mt-4 justify-between items-center">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : interviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {interviews.map((interview, index) => (
            <InterviewCard
              key={index}
              title={interview.name}
              date={interview.createdAt || ""}
              type={type as "PERSONAL" | "CUSTOM"}
              tags={interview.skills || []}
            />
          ))}
        </div>
      ) : (
        <div className="my-[15rem] flex flex-col justify-center items-center space-y-3">
          <div className="">
            No {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}{" "}
            Interviews are available
          </div>
          <InterviewDialog />
        </div>
      )}
    </div>
  );
};

export default InterviewsPage;
