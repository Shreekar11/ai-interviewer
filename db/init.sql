-- Create enum types
CREATE TYPE "InterviewType" AS ENUM ('PERSONAL', 'CUSTOM');
CREATE TYPE "FeedbackLabel" AS ENUM ('GOOD', 'NEEDS_IMPROVEMENT');

-- Create User table
CREATE TABLE "User" (
  "id" SERIAL PRIMARY KEY,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "clerkUserId" TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Profile table
CREATE TABLE "Profile" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "fkUserId" INTEGER NOT NULL UNIQUE,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "aboutMe" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  FOREIGN KEY ("fkUserId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Create Experience table
CREATE TABLE "Experience" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "fkProfileId" UUID NOT NULL UNIQUE,
  "company" TEXT NOT NULL,
  "position" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "startDate" TIMESTAMP WITH TIME ZONE NOT NULL,
  "endDate" TIMESTAMP WITH TIME ZONE NOT NULL,
  FOREIGN KEY ("fkProfileId") REFERENCES "Profile"("id") ON DELETE CASCADE
);

-- Create Project table
CREATE TABLE "Project" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "fkProfileId" UUID NOT NULL UNIQUE,
  "projectName" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "startDate" TIMESTAMP WITH TIME ZONE NOT NULL,
  "endDate" TIMESTAMP WITH TIME ZONE NOT NULL,
  FOREIGN KEY ("fkProfileId") REFERENCES "Profile"("id") ON DELETE CASCADE
);

-- Create Skill table
CREATE TABLE "Skill" (
  "id" SERIAL PRIMARY KEY,
  "fkProfileId" UUID NOT NULL UNIQUE,
  "skillName" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  FOREIGN KEY ("fkProfileId") REFERENCES "Profile"("id") ON DELETE CASCADE
);

-- Create Interview table
CREATE TABLE "Interview" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "fkUserId" INTEGER NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "type" "InterviewType" NOT NULL,
  "questions" TEXT[] NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("fkUserId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Create InterviewDetails table
CREATE TABLE "InterviewDetails" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "fkInterviewId" UUID NOT NULL UNIQUE,
  "video" TEXT NOT NULL,
  FOREIGN KEY ("fkInterviewId") REFERENCES "Interview"("id") ON DELETE CASCADE
);

-- Create Feedback table
CREATE TABLE "Feedback" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "fkInterviewDetailsId" UUID NOT NULL UNIQUE,
  "label" "FeedbackLabel" NOT NULL,
  "question" TEXT NOT NULL,
  "answer" TEXT NOT NULL,
  "feedback" TEXT NOT NULL,
  "suggesstionForImprovement" TEXT NOT NULL,
  FOREIGN KEY ("fkInterviewDetailsId") REFERENCES "InterviewDetails"("id") ON DELETE CASCADE
);

-- Create Summary table
CREATE TABLE "Summary" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "fkInterviewDetailsId" UUID NOT NULL UNIQUE,
  "relevantResponses" TEXT NOT NULL,
  "clarityAndStructure" TEXT NOT NULL,
  "professionalLanguage" TEXT NOT NULL,
  "initialIdeas" TEXT NOT NULL,
  "additionalNotableAspects" TEXT NOT NULL,
  "score" INTEGER NOT NULL,
  FOREIGN KEY ("fkInterviewDetailsId") REFERENCES "InterviewDetails"("id") ON DELETE CASCADE
);