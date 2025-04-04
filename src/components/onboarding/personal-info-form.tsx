"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Profile } from "@/types";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

interface PersonalInfoFormProps {
  first_name: string;
  last_name: string;
  about_me: string;
  profile_image?: string;
  setFormData: React.Dispatch<React.SetStateAction<Profile>>;
}

export default function PersonalInfoForm({
  first_name,
  last_name,
  about_me,
  profile_image,
  setFormData,
}: PersonalInfoFormProps) {
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(profile_image || null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Initialize Supabase client
  const supabase = createClient();
  
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setUploadError(null);
      
      if (!e.target.files || e.target.files.length === 0) {
        return;
      }
      
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `public/${fileName}`;  // Use a public folder
      
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (error) {
        console.error('Upload error details:', error);
        setUploadError(`${error.message}`);
        throw error;
      }
      
      // Get public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);
        
      // Update form data with the image URL
      const imageUrl = urlData.publicUrl;
      setImagePreview(imageUrl);
      setFormData((prev) => ({ ...prev, profile_image: imageUrl }));
      
    } catch (error: any) {
      console.error('Error uploading image:', error);
      setUploadError(error?.message || 'Error uploading image. Please try again.');
    } finally {
      setUploading(false);
    }
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
            name="first_name"
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
            name="last_name"
            value={last_name}
            onChange={handleChange}
            placeholder="Enter your last name"
            className=""
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="profileImage" className="text-blue-800">
          Profile Image
        </Label>
        <div className="flex flex-col items-start gap-4">
          {imagePreview && (
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-blue-300">
              <Image 
                src={imagePreview} 
                alt="Profile preview" 
                fill 
                className="object-cover"
              />
            </div>
          )}
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center gap-4">
              <Input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="max-w-xs"
                disabled={uploading}
              />
              {uploading && <span className="text-sm text-blue-600">Uploading...</span>}
            </div>
            {uploadError && (
              <div className="text-red-500 text-sm">{uploadError}</div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="aboutMe" className="text-blue-800">
          About Me
        </Label>
        <Textarea
          id="aboutMe"
          name="about_me"
          value={about_me}
          onChange={handleChange}
          placeholder="Tell us about yourself, your interests, and your goals..."
          className="min-h-[150px] "
        />
      </div>
    </div>
  );
}