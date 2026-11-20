import { SignIn } from "@clerk/nextjs";
import { Suspense } from "react";

export default function SignInPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Suspense fallback={<div className="text-sm text-muted-foreground">Loading sign in...</div>}>
        <SignIn />
      </Suspense>
    </div>
  );
}
