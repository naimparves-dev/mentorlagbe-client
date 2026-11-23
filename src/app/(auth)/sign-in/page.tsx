import { Suspense } from "react";
import { SignInForm } from "@/components/auth/SignInForm";

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="py-12 text-sm">Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
}
