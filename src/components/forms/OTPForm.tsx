"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface OTPFormProps {
  phone: string;
}

export function OTPForm({ phone }: OTPFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Handle inputs
  const handleChange = (index: number, val: string) => {
    // Only allow digits
    if (val && !/^\d$/.test(val)) return;

    const newValues = [...otpValues];
    newValues[index] = val;
    setOtpValues(newValues);

    // Auto-focus next input
    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Backspace handles previous input focus
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      const newValues = [...otpValues];
      newValues[index - 1] = "";
      setOtpValues(newValues);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    if (!/^\d{6}$/.test(pastedData)) return;

    const chars = pastedData.split("");
    setOtpValues(chars);
    inputRefs.current[5]?.focus();
  };

  const handleResend = async () => {
    setTimer(60);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Verification code resent");
      if (data.devOtp) {
        toast.info(`[Dev Mode] Generated OTP: ${data.devOtp}`, {
          duration: 10000,
        });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to resend code");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpValues.join("");
    if (code.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      toast.success("Verification successful");

      // Redirect depending on profile status
      if (result.isProfileComplete) {
        router.push("/dashboard");
      } else {
        router.push("/auth/profile-setup");
      }
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-border/80 glass bg-card/65 animate-slide-up">
      <CardHeader className="space-y-1 text-left">
        <Link href="/auth/login" className="flex items-center text-xs text-muted-foreground hover:text-primary transition-colors mb-2">
          <ArrowLeft className="h-3 w-3 mr-1" /> Back to Sign In
        </Link>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
          Verify OTP Code
        </CardTitle>
        <CardDescription>
          Enter the 6-digit code sent to your phone number: <span className="font-semibold text-foreground">{phone}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between gap-2">
            {otpValues.map((val, index) => (
              <Input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                maxLength={1}
                value={val}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-12 text-center text-xl font-bold rounded-xl border-border/60"
                disabled={isLoading}
                autoFocus={index === 0}
              />
            ))}
          </div>

          <Button type="submit" disabled={isLoading} className="w-full h-11 font-semibold rounded-xl">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Code"
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            {timer > 0 ? (
              <p>Resend code in <span className="font-semibold text-foreground">{timer}s</span></p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="font-semibold text-primary hover:underline transition-all"
              >
                Resend Code
              </button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
export default OTPForm;
