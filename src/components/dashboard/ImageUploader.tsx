"use client";

import React, { useState } from "react";
import { Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { uploadImageToImgBB } from "@/lib/action/imgbb";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  aspectClass?: string;
}

export function ImageUploader({
  label,
  value,
  onChange,
  aspectClass = "h-40 w-full",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    setUploading(true);
    try {
      const url = await uploadImageToImgBB(file);
      onChange(url);
      toast.success("Image uploaded to ImgBB!");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error
          ? err.message
          : "ImgBB upload failed. You can also paste an image URL."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2.5">
      <Label>{label}</Label>

      <div
        className={`relative overflow-hidden rounded-xl border border-dashed bg-muted/40 ${aspectClass}`}
      >
        {value ? (
          <img src={value} alt="Preview" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-muted-foreground">
            <ImageIcon className="h-8 w-8" />
            <span className="text-xs font-medium">No image selected</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload Image File
            </>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>

        <Input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste an image URL directly (optional)"
          className="flex-1"
        />
      </div>
    </div>
  );
}
