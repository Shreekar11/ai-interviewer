"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ProjectFormProps {
  data: {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
  };
  updateData: (data: any) => void;
}

export default function ProjectForm({ data, updateData }: ProjectFormProps) {
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
      <div className="space-y-2">
        <Label htmlFor="name" className="text-blue-800">
          Project Name
        </Label>
        <Input
          id="name"
          name="name"
          value={formState.name}
          onChange={handleChange}
          placeholder="Enter project name"
          className=""
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-blue-800">
          Project Description
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formState.description}
          onChange={handleChange}
          placeholder="Describe your project, its goals, and your role..."
          className="min-h-[120px] "
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="startDate" className="text-blue-800">
            Start Date
          </Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            value={formState.startDate}
            onChange={handleChange}
            className=""
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate" className="text-blue-800">
            End Date
          </Label>
          <Input
            id="endDate"
            name="endDate"
            type="date"
            value={formState.endDate}
            onChange={handleChange}
            className=""
          />
          <p className="text-xs text-blue-600">
            Leave empty if this is an ongoing project
          </p>
        </div>
      </div>
    </div>
  );
}
