import { SignUp } from "@clerk/nextjs";
import { Suspense } from "react";

export default function SignUpPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Suspense fallback={<div className="text-sm text-muted-foreground">Loading sign up...</div>}>
        <SignUp />
      </Suspense>
    </div>
  );
}
