"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PlusCircle, X, Lightbulb } from "lucide-react"

export default function SkillsForm({ data, updateData }) {
  const [skills, setSkills] = useState(data.length ? data : [{ name: "" }])

  useEffect(() => {
    updateData(skills)
  }, [skills, updateData])

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...skills]
    updatedSkills[index].name = value
    setSkills(updatedSkills)
  }

  const addSkill = () => {
    setSkills([...skills, { name: "" }])
  }

  const removeSkill = (index) => {
    if (skills.length > 1) {
      const updatedSkills = [...skills]
      updatedSkills.splice(index, 1)
      setSkills(updatedSkills)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {skills.map((skill, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex-1">
              <Label htmlFor={`skill-${index}`} className="sr-only">
                Skill {index + 1}
              </Label>
              <Input
                id={`skill-${index}`}
                value={skill.name}
                onChange={(e) => handleSkillChange(index, e.target.value)}
                placeholder="Enter a skill (e.g., JavaScript, Project Management)"
                className=""
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeSkill(index)}
              disabled={skills.length === 1}
              className="text-blue-700 hover:text-blue-900 hover:bg-blue-50"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={addSkill}
        className="mt-2 flex items-center gap-2"
      >
        <PlusCircle className="h-4 w-4" />
        Add Another Skill
      </Button>
    </div>
  )
}

