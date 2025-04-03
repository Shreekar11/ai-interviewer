"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Profile } from "@/types";
interface PersonalInfoFormProps {
  first_name: string;
  last_name: string;
  about_me: string;
  setFormData: React.Dispatch<React.SetStateAction<Profile>>;
}

export default function PersonalInfoForm({
  first_name,
  last_name,
  about_me,
  setFormData,
}: PersonalInfoFormProps) {
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
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
            value={first_name}
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
            value={last_name}
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
          value={about_me}
          onChange={handleChange}
          placeholder="Tell us about yourself, your interests, and your goals..."
          className="min-h-[150px] "
        />
      </div>
    </div>
  );
}
