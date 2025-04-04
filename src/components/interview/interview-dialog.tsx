"use client"

import type React from "react"

import { useState } from "react"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type InterviewType = "PERSONAL" | "CUSTOM"

export default function InterviewDialog() {
  const [open, setOpen] = useState(false)
  const [interviewType, setInterviewType] = useState<InterviewType>("PERSONAL")
  const [formData, setFormData] = useState({
    name: "",
    skills: "",
    description: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTypeChange = (value: InterviewType) => {
    setInterviewType(value as InterviewType)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", { ...formData, type: interviewType })
    setOpen(false)
    // Reset form
    setFormData({ name: "", skills: "", description: "" })
    setInterviewType("PERSONAL")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Interview
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Interview</DialogTitle>
            <DialogDescription>Set up a new interview session. Click proceed when you're done.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={interviewType} onValueChange={handleTypeChange}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select interview type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERSONAL">PERSONAL</SelectItem>
                  <SelectItem value="CUSTOM">CUSTOM</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {interviewType === "CUSTOM" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills</Label>
                  <Input
                    id="skills"
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    required={interviewType === "CUSTOM"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required={interviewType === "CUSTOM"}
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
              Proceed
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
