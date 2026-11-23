"use client";

import { useState } from "react";
import Link from "next/link";
import { Save, Loader2, Crown } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { updateProfileAction } from "@/lib/action/profile";
import { ImageUploader } from "@/components/dashboard/ImageUploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { UserProfile } from "@/types";

export default function UpdateProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">Update Profile</h1>
          <p className="text-sm text-muted-foreground">
            Keep your contact details, bio, and profile picture up to date.
          </p>
        </div>

        {user.plan !== "pro" && user.role !== "admin" && (
          <Link href="/pricing">
            <Button size="sm" className="bg-amber-500 text-slate-950 hover:bg-amber-400">
              <Crown className="h-4 w-4" />
              Upgrade to Pro
            </Button>
          </Link>
        )}
      </div>

      {/* `key` remounts the form whenever the account changes, so the fields
          always start from the stored profile without an effect. */}
      <ProfileForm key={user._id} user={user} />
    </div>
  );
}

function ProfileForm({ user }: { user: UserProfile }) {
  const { setUser } = useAuth();

  const [name, setName] = useState(user.name || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [bio, setBio] = useState(user.bio || "");
  const [image, setImage] = useState(user.image || "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateProfileAction({ name, phone, bio, image });
      setUser(res.user);
      toast.success(res.message);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <ImageUploader
            label="Profile Picture (Direct ImgBB Upload)"
            value={image}
            onChange={setImage}
            aspectClass="h-28 w-28 rounded-full"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Full Name</Label>
              <Input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Email (Read-Only)</Label>
              <Input type="email" disabled value={user.email} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Phone Number</Label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+880 17XXXXXXXX"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Bio / Academic Background</Label>
            <Textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Share your qualifications, subjects, or learning goals..."
            />
          </div>

          <Button type="submit" disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
