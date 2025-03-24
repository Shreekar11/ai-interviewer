"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";
import { Button } from "@/components/ui/button";
import PersonalInfoForm from "@/components/onboarding/personal-info-form";
import ProjectForm from "@/components/onboarding/project-form";
import ExperienceForm from "@/components/onboarding/experience-form";
import SkillsForm from "@/components/onboarding/skills-form";
import {
  Briefcase,
  Building2,
  Lightbulb,
  UserCircle,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Profile } from "@/types";

const steps = [
  {
    id: 1,
    title: "Personal Info",
    description: "Basic information",
    icon: UserCircle,
    slug: "personal",
  },
  {
    id: 2,
    title: "Project",
    description: "Project details",
    icon: Briefcase,
    slug: "project",
  },
  {
    id: 3,
    title: "Experience",
    description: "Work history",
    icon: Building2,
    slug: "experience",
  },
  {
    id: 4,
    title: "Skills",
    description: "Your expertise",
    icon: Lightbulb,
    slug: "skills",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = searchParams.get("page");

  useEffect(() => {
    const pageStep = steps.find((step) => step.slug === page);
    setCurrentStep(pageStep?.id || 1);
  }, [page]);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Profile>({
    personal: {
      firstName: "",
      lastName: "",
      aboutMe: "",
    },
    projects: [
      {
        name: "",
        description: "",
        startDate: "",
        endDate: "",
      },
    ],
    experience: [
      {
        company: "",
        position: "",
        description: "",
        startDate: "",
        endDate: "",
      },
    ],
    skills: [{ name: "" }],
  });

  const handleStepChange = (stepId: number) => {
    setCurrentStep(stepId);
  };

  const handleNext = () => {
    if (currentStep < 4) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);

      const newStep = steps.find((step) => step.id === nextStep);
      router.push(`/onboarding?page=${newStep?.slug}`);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);

      const newStep = steps.find((step) => step.id === prevStep);
      router.push(`/onboarding?page=${newStep?.slug}`);
    }
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    // Here you would typically send the data to your backend
    alert("Profile completed successfully!");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left sidebar with vertical stepper - increased width */}
      <div className="w-96 bg-blue-50 border shadow-xl flex flex-col">
        <div className="p-6">
          <div className="flex items-center">
            <Image
              src={"/assets/logo.png"}
              alt="logo"
              height={30}
              width={30}
              quality={100}
              layout="fixed"
              className="px-1"
            />
            <h1 className="font-bold text-xl">InterviewPrep</h1>
          </div>
        </div>

        <div className="flex-1 p-6">
          <Stepper
            value={currentStep}
            onValueChange={handleStepChange}
            orientation="vertical"
            className="h-full"
          >
            {steps.map((step, index) => (
              <StepperItem
                key={step.id}
                step={step.id}
                className="mb-8 last:mb-0"
              >
                <StepperTrigger asChild>
                  <div className="flex items-start gap-4 cursor-pointer w-full">
                    <StepperIndicator className="data-[state=active]:bg-blue-500 data-[state=completed]:bg-blue-500 mt-0.5">
                      <step.icon className="h-4 w-4" />
                    </StepperIndicator>
                    <div className="flex flex-col items-start">
                      <StepperTitle className="text-blue-900 font-medium">
                        {step.title}
                      </StepperTitle>
                      <StepperDescription className="text-sm text-gray-500">
                        {step.description}
                      </StepperDescription>
                    </div>
                  </div>
                </StepperTrigger>
                {index < steps.length - 1 && (
                  <StepperSeparator className="ml-3 h-12 group-data-[state=completed]/step:bg-blue-500" />
                )}
              </StepperItem>
            ))}
          </Stepper>
        </div>

        <div className="p-6 mt-auto">
          <Button
            variant={"ghost"}
            onClick={() => router.push("/")}
            className="w-full flex items-center text-sm hover:text-white-600 bg-blue-500 hover:bg-blue-600 text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          </Button>
        </div>
      </div>

      {/* Right content area */}
      <ScrollArea className="flex-1 flex flex-col w-full h-screen">
        <div className="">
          <main className="flex-1 p-8">
            <div className="max-w-3xl mx-auto">
              {/* Content header */}
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-blue-900">
                  {currentStep === 1 && "Tell us about yourself"}
                  {currentStep === 2 && "Share your project details"}
                  {currentStep === 3 && "What's your work experience?"}
                  {currentStep === 4 && "What skills do you have?"}
                </h1>
                <p className="text-blue-600 mt-2">
                  {currentStep === 1 && "Complete your profile to get started"}
                  {currentStep === 2 &&
                    "Tell us about a significant project you've worked on"}
                  {currentStep === 3 && "Share your professional background"}
                  {currentStep === 4 && "Add skills to showcase your expertise"}
                </p>
              </div>

              {/* Form content */}
              <div className="bg-white rounded-xl border shadow-lg p-8 mb-8">
                {currentStep === 1 && (
                  <PersonalInfoForm
                    data={formData.personal}
                    setFormData={setFormData}
                  />
                )}
                {currentStep === 2 && (
                  <ProjectForm
                    data={formData.projects}
                    setFormData={setFormData}
                  />
                )}
                {currentStep === 3 && (
                  <ExperienceForm
                    data={formData.experience}
                    setFormData={setFormData}
                  />
                )}
                {currentStep === 4 && (
                  <SkillsForm
                    data={formData.skills}
                    setFormData={setFormData}
                  />
                )}
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between">
                <Button
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                  variant="outline"
                  className="text-black w-32"
                >
                  Previous
                </Button>

                {currentStep < 4 ? (
                  <Button
                    onClick={handleNext}
                    className="bg-blue-500 hover:bg-blue-600 text-white w-32"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    className="bg-blue-500 hover:bg-blue-600 text-white w-32"
                  >
                    Complete
                  </Button>
                )}
              </div>

              {/* Progress indicators */}
              <div className="flex justify-center mt-8 gap-2">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`h-1.5 rounded-full ${
                      step.id === currentStep
                        ? "w-8 bg-blue-500"
                        : step.id < currentStep
                        ? "w-8 bg-blue-300"
                        : "w-8 bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          </main>
        </div>
      </ScrollArea>
    </div>
  );
}
