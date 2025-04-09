"use client";

import { Mail } from "lucide-react";
import { getUser } from "@/queries/user";
import { useEffect, useState } from "react";
import useProfile from "@/hooks/use-profile";

// ui components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileSkeleton } from "@/components/profile/profile-skeleton";
import { useUser } from "@/context/user.context";

const ProfilePage = () => {
  const { loading, profile: userData } = useProfile();
  const { user } = useUser();

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <main className="container p-4 md:p-6">
      <div className="mb-8 flex flex-col items-center gap-6 md:flex-row md:items-start">
        <Avatar className="h-24 w-24 ring-4 ring-blue-500 ring-offset-2 md:h-32 md:w-32">
          <AvatarImage
            src={userData?.profile_image}
            alt={`${userData?.first_name} ${userData?.last_name}`}
          />
          <AvatarFallback className="text-blue-500 text-2xl">
            {userData?.first_name.charAt(0)}
            {userData?.last_name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold text-blue-800">
            {userData?.first_name} {userData?.last_name}
          </h2>
          <p className="text-blue-800">
            {userData?.experiences[userData?.experiences.length - 1].position} @
            {userData?.experiences[userData?.experiences.length - 1].company}
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-2 md:justify-start">
            <Badge
              variant="outline"
              className="flex items-center gap-1 border-blue-300 text-blue-700"
            >
              <Mail className="h-3 w-3" />
              {user.email}
            </Badge>
          </div>
        </div>
      </div>

      <Card className="border mb-8">
        <CardHeader className="border-b border-blue-100 bg-blue-50">
          <CardTitle className="text-blue-700">About Me</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p>{userData?.about_me}</p>
        </CardContent>
      </Card>

      <Card className="border mb-8">
        <CardHeader className="border-b border-blue-100 bg-blue-50">
          <CardTitle className="text-blue-700">Experience</CardTitle>
          <CardDescription>My professional journey</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {userData?.experiences.map((exp, index) => (
              <div key={index}>
                <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                  <div>
                    <h3 className="font-semibold text-blue-800">
                      {exp.position}
                    </h3>
                    <p className="text-sm text-blue-600">{exp.company}</p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-700"
                  >
                    {formatDate(exp.start_date)} - {formatDate(exp.end_date)}
                  </Badge>
                </div>
                <p className="mt-2 text-sm">{exp.description}</p>
                {index < userData.experiences.length - 1 && (
                  <Separator className="mt-4 bg-blue-100" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border mb-8">
        <CardHeader className="border-b border-blue-100 bg-blue-50">
          <CardTitle className="text-blue-700">Projects</CardTitle>
          <CardDescription>What I&apos;ve built</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {userData?.projects.map((project, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="p-4 bg-blue-50 border-b border-blue-100">
                  <CardTitle className="text-lg text-blue-700">
                    {project?.project_name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-3">
                  <p className="mb-4 text-sm">{project.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border mb-8">
        <CardHeader className="border-b border-blue-100 bg-blue-50">
          <CardTitle className="text-blue-700">Skills</CardTitle>
          <CardDescription>Technologies I work with</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2">
            {userData?.skills.map((skill, index) => (
              <Badge
                key={index}
                className="bg-blue-100 text-blue-700 hover:bg-blue-500 hover:text-white"
              >
                {skill.skill_name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default ProfilePage;
