"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PlusCircle, X } from "lucide-react";
import { Profile } from "@/types";

interface Experience {
  company: string;
  position: string;
  description: string;
  start_date: string;
  end_date: string;
}

interface ExperienceFormProps {
  data: Experience[];
  setFormData: React.Dispatch<React.SetStateAction<Profile>>;
}

export default function ExperienceForm({
  data,
  setFormData,
}: ExperienceFormProps) {
  const [experienceList, setExperienceList] = useState<Experience[]>(
    data.length
      ? data
      : [
          {
            company: "",
            position: "",
            description: "",
            start_date: "",
            end_date: "",
          },
        ]
  );

  const handleExperienceChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const updatedExperience = [...experienceList];
    updatedExperience[index][name as keyof Experience] = value;
    setExperienceList(updatedExperience);
  };

  const addExperience = () => {
    setExperienceList([
      ...experienceList,
      {
        company: "",
        position: "",
        description: "",
        start_date: "",
        end_date: "",
      },
    ]);
  };

  const removeExperience = (index: number) => {
    if (experienceList.length > 1) {
      const updatedExperience = [...experienceList];
      updatedExperience.splice(index, 1);
      setExperienceList(updatedExperience);
    }
  };

  // Update formData when experienceList changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      experience: experienceList, // Now correctly storing an array of experiences
    }));
  }, [experienceList, setFormData]);

  return (
    <div className="space-y-6">
      {experienceList.map((experience, index) => (
        <div key={index} className="space-y-4 border p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor={`company-${index}`} className="text-blue-800">
                Company
              </Label>
              <Input
                id={`company-${index}`}
                name="company"
                value={experience.company}
                onChange={(e) => handleExperienceChange(index, e)}
                placeholder="Enter company name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`position-${index}`} className="text-blue-800">
                Position
              </Label>
              <Input
                id={`position-${index}`}
                name="position"
                value={experience.position}
                onChange={(e) => handleExperienceChange(index, e)}
                placeholder="Enter your job title"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`description-${index}`} className="text-blue-800">
              Job Description
            </Label>
            <Textarea
              id={`description-${index}`}
              name="description"
              value={experience.description}
              onChange={(e) => handleExperienceChange(index, e)}
              placeholder="Describe your responsibilities..."
              className="min-h-[120px]"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor={`startDate-${index}`} className="text-blue-800">
                Start Date
              </Label>
              <Input
                id={`startDate-${index}`}
                name="startDate"
                type="date"
                value={experience.start_date}
                onChange={(e) => handleExperienceChange(index, e)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`endDate-${index}`} className="text-blue-800">
                End Date
              </Label>
              <Input
                id={`endDate-${index}`}
                name="endDate"
                type="date"
                value={experience.end_date}
                onChange={(e) => handleExperienceChange(index, e)}
              />
              <p className="text-xs text-blue-600">
                Leave empty if you currently work here
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            onClick={() => removeExperience(index)}
            disabled={experienceList.length === 1}
            className="text-red-700 hover:text-red-900 hover:bg-red-50"
          >
            Remove
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addExperience}
        className="mt-2 flex items-center gap-2"
      >
        <PlusCircle className="h-4 w-4" />
        Add Another Experience
      </Button>
    </div>
  );
}
