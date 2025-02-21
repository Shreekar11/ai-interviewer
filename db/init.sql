CREATE TABLE "User" (
    id SERIAL PRIMARY KEY,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    clerkUserId TEXT UNIQUE NOT NULL,
    createdAt TIMESTAMP DEFAULT now()
);

CREATE TABLE "Profile" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fkUserId INT UNIQUE NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    aboutMe TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT now(),
    updatedAt TIMESTAMP DEFAULT now(),
    CONSTRAINT fk_profile_user FOREIGN KEY (fkUserId) REFERENCES "User"(id) ON DELETE CASCADE
);

CREATE TABLE "Experience" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fkProfileId UUID UNIQUE NOT NULL,
    company TEXT NOT NULL,
    position TEXT NOT NULL,
    description TEXT NOT NULL,
    startDate TIMESTAMP NOT NULL,
    endDate TIMESTAMP NOT NULL,
    CONSTRAINT fk_experience_profile FOREIGN KEY (fkProfileId) REFERENCES "Profile"(id) ON DELETE CASCADE
);

CREATE TABLE "Project" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fkProfileId UUID UNIQUE NOT NULL,
    projectName TEXT NOT NULL,
    description TEXT NOT NULL,
    startDate TIMESTAMP NOT NULL,
    endDate TIMESTAMP NOT NULL,
    CONSTRAINT fk_project_profile FOREIGN KEY (fkProfileId) REFERENCES "Profile"(id) ON DELETE CASCADE
);

CREATE TABLE "Skill" (
    id SERIAL PRIMARY KEY,
    fkProfileId UUID UNIQUE NOT NULL,
    skillName TEXT NOT NULL,
    description TEXT NOT NULL,
    CONSTRAINT fk_skill_profile FOREIGN KEY (fkProfileId) REFERENCES "Profile"(id) ON DELETE CASCADE
);

CREATE TABLE "Interview" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fkUserId INT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('PERSONAL', 'CUSTOM')),
    questions TEXT[] NOT NULL,
    createdAt TIMESTAMP DEFAULT now(),
    CONSTRAINT fk_interview_user FOREIGN KEY (fkUserId) REFERENCES "User"(id) ON DELETE CASCADE
);

CREATE TABLE "InterviewFeedback" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fkInterviewId UUID UNIQUE NOT NULL,
    CONSTRAINT fk_feedback_interview FOREIGN KEY (fkInterviewId) REFERENCES "Interview"(id) ON DELETE CASCADE
);

CREATE TABLE "Feedback" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fkInterviewFeedbackId UUID UNIQUE NOT NULL,
    label TEXT NOT NULL CHECK (label IN ('GOOD', 'NEEDS_IMPROVEMENT')),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    feedback TEXT NOT NULL,
    suggesstionForImprovement TEXT NOT NULL,
    score INT NOT NULL,
    CONSTRAINT fk_feedback_feedback FOREIGN KEY (fkInterviewFeedbackId) REFERENCES "InterviewFeedback"(id) ON DELETE CASCADE
);
