"use client";
import React from "react";
import { useRouter } from "next/navigation";
import InterviewCard from "../interview/InterviewCard";
import { useUser } from "@/context/user.context";
import InterviewDialog from "../interview/interview-dialog";
import { InterviewData } from "@/types/interview";
import InterviewDashboardSkeleton from "../interview/interview-skeleton";

interface DashboardContentProps {
  loading: boolean;
  interviews: InterviewData[];
}

const DashboardContent = ({ loading, interviews }: DashboardContentProps) => {
  const router = useRouter();
  const {
    user: { name },
  } = useUser();

  return (
    <>
      {loading ? (
        <InterviewDashboardSkeleton />
      ) : (
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-semibold">Welcome Back, {name}</h1>
            <InterviewDialog />
          </div>

          {/* Personal Interviews */}
          <>
            {interviews.filter((interview) => interview.type === "PERSONAL")
              .length !== 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-medium mb-4">
                  Personal Interviews
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {interviews
                    .filter((interview) => interview.type === "PERSONAL")
                    .slice(0, 2)
                    .map((interview, index) => (
                      <InterviewCard
                        key={index}
                        title={interview.name}
                        date={`${interview.createdAt} • ${interview.name}`}
                        type={interview.type}
                      />
                    ))}
                </div>
                {interviews.length > 2 && (
                  <button
                    className="mt-4 text-blue-500 hover:underline"
                    onClick={() => router.push("/interviews/personal")}
                  >
                    See More →
                  </button>
                )}
              </section>
            )}
          </>

          {/* Custom Interviews */}
          <>
            {interviews.filter((interview) => interview.type === "CUSTOM")
              .length !== 0 && (
              <section>
                <h2 className="text-xl font-medium mb-4">Custom Interviews</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {interviews
                    .filter((interview) => interview.type === "CUSTOM")
                    .slice(0, 2)
                    .map((interview, index) => (
                      <InterviewCard
                        key={index}
                        title={interview.name}
                        date={interview.createdAt || ""}
                        type={interview.type}
                        tags={interview.skills || []}
                      />
                    ))}
                </div>
                {interviews.length > 2 && (
                  <button
                    className="mt-4 text-blue-500 hover:underline"
                    onClick={() => router.push("/interviews/custom")}
                  >
                    See More →
                  </button>
                )}
              </section>
            )}
          </>
        </div>
      )}
    </>
  );
};

export default DashboardContent;
