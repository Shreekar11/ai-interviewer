"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Stepper,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperTitle,
  StepperDescription,
  StepperSeparator,
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
import { ProfileService } from "@/services/profile.service";
import { toast } from "sonner";

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

const OnboardingPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page");

  useEffect(() => {
    const pageStep = steps.find((step) => step.slug === page);
    setCurrentStep(pageStep?.id || 1);
  }, [page]);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Profile>({
    first_name: "",
    last_name: "",
    about_me: "",
    profile_image: "",
    projects: [
      { project_name: "", description: "", start_date: "", end_date: "" },
    ],
    experience: [
      {
        company: "",
        position: "",
        description: "",
        start_date: "",
        end_date: "",
      },
    ],
    skills: [{ skill_name: "" }],
  });

  const [errors, setErrors] = useState<string | null>(null);

  const validateFields = () => {
    let errorMsg = "";
    if (
      currentStep === 1 &&
      (!formData.first_name || !formData.last_name || !formData.about_me)
    ) {
      errorMsg = "Please fill in your personal information.";
    } else if (
      currentStep === 2 &&
      formData.projects.some(
        (project) => !project.project_name || !project.description
      )
    ) {
      errorMsg = "Please complete the project details.";
    } else if (
      currentStep === 3 &&
      formData.experience.some((exp) => !exp.company || !exp.position)
    ) {
      errorMsg = "Please complete your work experience.";
    } else if (
      currentStep === 4 &&
      formData.skills.some((skill) => !skill.skill_name)
    ) {
      errorMsg = "Please add at least one skill.";
    }

    if (errorMsg) {
      setErrors(errorMsg);
      return false;
    }
    setErrors(null);
    return true;
  };

  const handleNext = () => {
    if (!validateFields()) return;
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

  const handleSubmit = async () => {
    try {
      const profileService = new ProfileService();
      const result = await profileService.createProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
        about_me: formData.about_me,
        profile_image: formData.profile_image,
        experience: formData.experience,
        projects: formData.projects,
        skills: formData.skills,
      });

      if (result.status) {
        // Show success message
        toast.success("Profile completed successfully!");
        router.push("/dashboard");
      } else {
        // Show error message
        toast.error(result.message);
        if (result.error === "AUTH_ERROR") {
          router.push("/sign-in");
        } else if (result.error === "DUPLICATE_PROFILE") {
          router.push("/profile");
        }
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to save profile";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-96 bg-blue-50 border shadow-xl flex flex-col">
        <div className="p-6">
          <div className="flex items-center">
            <Image
              src="/assets/logo.png"
              alt="logo"
              height={30}
              width={30}
              className="px-1"
            />
            <h1 className="font-bold text-xl">InterviewPrep</h1>
          </div>
        </div>
        <div className="flex-1 p-6">
          <Stepper
            value={currentStep}
            onValueChange={setCurrentStep}
            orientation="vertical"
          >
            {steps.map((step, index) => (
              <StepperItem key={step.id} step={step.id}>
                <StepperTrigger asChild>
                  <div className="flex items-start gap-4 cursor-pointer w-full">
                    <StepperIndicator
                      className="data-[state=active]:bg-blue-500 
                    data-[state=completed]:bg-blue-500 mt-0.5"
                    >
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
            className="w-full flex items-center text-sm hover:text-white-600 
            bg-blue-500 hover:bg-blue-600 text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 flex flex-col w-full h-screen">
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

            {errors && (
              <p className="bg-red-50 rounded-lg shadow-md p-2 text-red-500 mb-4">
                {errors}
              </p>
            )}
            <div className="bg-white rounded-xl border shadow-lg p-8 mb-8">
              {currentStep === 1 && (
                <PersonalInfoForm
                  first_name={formData.first_name}
                  last_name={formData.last_name}
                  about_me={formData.about_me}
                  profile_image={formData.profile_image}
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
                <SkillsForm data={formData.skills} setFormData={setFormData} />
              )}
            </div>
            <div className="flex justify-between">
              <Button
                onClick={handlePrev}
                disabled={currentStep === 1}
                variant="outline"
              >
                Previous
              </Button>
              {currentStep < 4 ? (
                <Button
                  onClick={handleNext}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Complete
                </Button>
              )}
            </div>
          </div>
        </main>
      </ScrollArea>
    </div>
  );
}

export default OnboardingPage;
