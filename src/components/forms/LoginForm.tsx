"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { phoneSchema } from "@/lib/validations";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Loader2 } from "lucide-react";
import { toast } from "sonner";

type FormValues = z.infer<typeof phoneSchema>;

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to send OTP code");
      }

      toast.success("Verification code sent to your phone");
      
      // In development mode, auto copy code to help tester
      if (result.devOtp) {
        toast.info(`[Dev Mode] Generated OTP: ${result.devOtp}`, {
          duration: 10000,
        });
      }

      // Navigate to validation page passing phone in query
      router.push(`/auth/verify-otp?phone=${encodeURIComponent(data.phone)}`);
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-border/80 glass bg-card/65 animate-slide-up">
      <CardHeader className="space-y-1 text-left">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
          Sign In
        </CardTitle>
        <CardDescription>
          Enter your phone number to receive a 6-digit verification code.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="text-left">
                  <FormLabel className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <div className="relative flex items-center">
                      <Phone className="absolute left-3.5 h-4.5 w-4.5 text-muted-foreground" />
                      <Input
                        placeholder="+919876543210"
                        {...field}
                        className="pl-10 h-11 rounded-xl border-border/60"
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full h-11 font-semibold rounded-xl mt-2">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Code...
                </>
              ) : (
                "Send OTP Code"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
export default LoginForm;
