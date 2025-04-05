"use client"; // Ensure this is a Client Component

import { useParams } from "next/navigation";
import InterviewCard from "@/components/interview/InterviewCard";
import useInterviewsType from "@/hooks/use-interview-type";
import { Skeleton } from "@/components/ui/skeleton";
import InterviewDialog from "@/components/interview/interview-dialog";

const InterviewsPage = () => {
  const params = useParams();
  const type = params?.type;

  const { loading, interviews } = useInterviewsType(
    type.toLocaleString().toUpperCase()
  );

  // Check if the type is valid
  if (typeof type !== "string") {
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
