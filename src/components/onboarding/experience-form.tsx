"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ExperienceForm({ data, updateData }) {
  const [formState, setFormState] = useState(data)

  useEffect(() => {
    updateData(formState)
  }, [formState, updateData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="company" className="text-blue-800">
            Company
          </Label>
          <Input
            id="company"
            name="company"
            value={formState.company}
            onChange={handleChange}
            placeholder="Enter company name"
            className=""
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="position" className="text-blue-800">
            Position
          </Label>
          <Input
            id="position"
            name="position"
            value={formState.position}
            onChange={handleChange}
            placeholder="Enter your job title"
            className=""
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-blue-800">
          Job Description
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formState.description}
          onChange={handleChange}
          placeholder="Describe your responsibilities, achievements, and skills used..."
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
          <p className="text-xs text-blue-600">Leave empty if you currently work here</p>
        </div>
      </div>
    </div>
  )
}

