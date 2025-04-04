"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import InterviewCard from "../interview/InterviewCard";
import { useUser } from "@/context/user.context";

interface Interview {
  id: number;
  title: string;
  date: string;
  company?: string;
  tags?: string[];
}

const DashboardContent = () => {
  const router = useRouter();
  const { user: { name } } = useUser(); 
  const personalInterviews: Interview[] = [
    { id: 1, title: "Frontend Developer Interview", date: "12 May 2023", company: "Tech Solutions Inc." },
    { id: 2, title: "React Developer Position", date: "18 May 2023", company: "Digital Innovators" },
    { id: 3, title: "Full Stack Developer Interview", date: "25 May 2023", company: "Startup Hub" },
  ];

  const customInterviews: Interview[] = [
    { id: 4, title: "Custom JavaScript Interview", date: "22 May 2023", tags: ["JavaScript", "React", "TypeScript"] },
    { id: 5, title: "System Design Practice", date: "25 May 2023", tags: ["Architecture", "Scalability"] },
    { id: 6, title: "Backend API Testing", date: "28 May 2023", tags: ["Postman", "REST", "GraphQL"] },
  ];

  return (
    <div className="flex-1 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Welcome Back, {name}</h1>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Interview
        </Button>
      </div>

      {/* Personal Interviews */}
      <section className="mb-8">
        <h2 className="text-xl font-medium mb-4">Personal Interviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {personalInterviews.slice(0, 2).map((interview) => (
            <InterviewCard
              key={interview.id}
              title={interview.title}
              date={`${interview.date} • ${interview.company}`}
              type="personal"
            />
          ))}
        </div>
        {personalInterviews.length > 2 && (
          <button
            className="mt-4 text-blue-500 hover:underline"
            onClick={() => router.push("/interviews/personal")}
          >
            See More →
          </button>
        )}
      </section>

      {/* Custom Interviews */}
      <section>
        <h2 className="text-xl font-medium mb-4">Custom Interviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {customInterviews.slice(0, 2).map((interview) => (
            <InterviewCard
              key={interview.id}
              title={interview.title}
              date={interview.date}
              type="custom"
              tags={interview.tags || []}
            />
          ))}
        </div>
        {customInterviews.length > 2 && (
          <button
            className="mt-4 text-blue-500 hover:underline"
            onClick={() => router.push("/interviews/custom")}
          >
            See More →
          </button>
        )}
      </section>
    </div>
  );
};

export default DashboardContent;
