"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PersonalInfoFormProps {
  data: {
    firstName: string;
    lastName: string;
    aboutMe: string;
  };
  updateData: (data: any) => void;
}

export default function PersonalInfoForm({
  data,
  updateData,
}: PersonalInfoFormProps) {
  const [formState, setFormState] = useState(data);

  useEffect(() => {
    updateData(formState);
  }, [formState, updateData]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-blue-800">
            First Name
          </Label>
          <Input
            id="firstName"
            name="firstName"
            value={formState.firstName}
            onChange={handleChange}
            placeholder="Enter your first name"
            className=""
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-blue-800">
            Last Name
          </Label>
          <Input
            id="lastName"
            name="lastName"
            value={formState.lastName}
            onChange={handleChange}
            placeholder="Enter your last name"
            className=""
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="aboutMe" className="text-blue-800">
          About Me
        </Label>
        <Textarea
          id="aboutMe"
          name="aboutMe"
          value={formState.aboutMe}
          onChange={handleChange}
          placeholder="Tell us about yourself, your interests, and your goals..."
          className="min-h-[150px] "
        />
      </div>
    </div>
  );
}
