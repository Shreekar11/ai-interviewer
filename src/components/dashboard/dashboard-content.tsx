"use client";

import { useRouter } from "next/navigation";
import { Interview } from "@/types/interview";
import { useUser } from "@/context/user.context";

import InterviewCard from "../interview/interview-card";
import InterviewDialog from "../interview/interview-dialog";
import InterviewDashboardSkeleton from "../interview/interview-skeleton";

interface DashboardContentProps {
  loading: boolean;
  interviews: Interview[];
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
            {interviews.filter(
              (interview) => interview.interviewData.type === "PERSONAL"
            ).length !== 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-medium mb-4">
                  Personal Interviews
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {interviews
                    .filter(
                      (interview) => interview.interviewData.type === "PERSONAL"
                    )
                    .slice(0, 2)
                    .map((interview, index) => (
                      <InterviewCard
                        key={index}
                        id={interview.interviewData.id}
                        title={interview.interviewData.name}
                        date={`${interview.interviewData.createdAt} • ${interview.interviewData.name}`}
                        type={interview.interviewData.type}
                        isFeedback={interview.interviewFeedback.feedback.length > 0}
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
            {interviews.filter(
              (interview) => interview.interviewData.type === "CUSTOM"
            ).length !== 0 && (
              <section>
                <h2 className="text-xl font-medium mb-4">Custom Interviews</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {interviews
                    .filter(
                      (interview) => interview.interviewData.type === "CUSTOM"
                    )
                    .slice(0, 2)
                    .map((interview, index) => (
                      <InterviewCard
                        key={index}
                        id={interview.interviewData.id}
                        title={interview.interviewData.name}
                        date={interview.interviewData.createdAt || ""}
                        type={interview.interviewData.type}
                        tags={interview.interviewData.skills || []}
                        isFeedback={interview.interviewFeedback.feedback.length > 0}
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
