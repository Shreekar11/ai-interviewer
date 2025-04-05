"use client";
import DashboardContent from "@/components/dashboard/dashboard-content";
import useInterviews from "@/hooks/use-interviews";

export default function DashboardPage() {
  const { loading, interviews } = useInterviews();

  return <DashboardContent loading={loading} interviews={interviews} />;
}
