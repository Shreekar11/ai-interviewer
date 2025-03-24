"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Profile } from "@/types";

interface Projects {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}
interface ProjectFormProps {
  data: Projects[];
  setFormData: React.Dispatch<React.SetStateAction<Profile>>;
}

export default function ProjectForm({ data, setFormData }: ProjectFormProps) {
  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.map((project, i) =>
        i === index ? { ...project, [name]: value } : project
      ),
    }));
  };

  const addProject = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        { name: "", description: "", startDate: "", endDate: "" },
      ],
    }));
  };

  const removeProject = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      {data.map((project, index) => (
        <div key={index} className="border p-4 rounded-lg space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`name-${index}`} className="text-blue-800">
              Project Name
            </Label>
            <Input
              id={`name-${index}`}
              name="name"
              value={project.name}
              onChange={(e) => handleChange(index, e)}
              placeholder="Enter project name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`description-${index}`} className="text-blue-800">
              Project Description
            </Label>
            <Textarea
              id={`description-${index}`}
              name="description"
              value={project.description}
              onChange={(e) => handleChange(index, e)}
              placeholder="Describe your project, its goals, and your role..."
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
                value={project.startDate}
                onChange={(e) => handleChange(index, e)}
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
                value={project.endDate}
                onChange={(e) => handleChange(index, e)}
              />
              <p className="text-xs text-blue-600">
                Leave empty if this is an ongoing project
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => removeProject(index)}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Remove Project
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addProject}
        className="bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        + Add Another Project
      </button>
    </div>
  );
}
