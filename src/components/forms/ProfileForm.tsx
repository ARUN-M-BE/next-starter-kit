"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "@/lib/validations";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Home, MapPin, Landmark, Compass, Loader2 } from "lucide-react";
import { toast } from "sonner";

type FormValues = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      address: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
      avatar: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      toast.success("Profile setup complete!");
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl border-border/80 glass bg-card/65 animate-slide-up">
      <CardHeader className="text-left space-y-1">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
          Complete Profile
        </CardTitle>
        <CardDescription>
          Provide your details to complete setup and access the dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-left">
            
            {/* General Info Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground border-b pb-2">Personal Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-muted-foreground uppercase">Full Name</FormLabel>
                      <FormControl>
                        <div className="relative flex items-center">
                          <User className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="John Doe" {...field} className="pl-10 h-10 rounded-xl" />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-muted-foreground uppercase">Email Address</FormLabel>
                      <FormControl>
                        <div className="relative flex items-center">
                          <Mail className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="john@example.com" {...field} className="pl-10 h-10 rounded-xl" />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-muted-foreground uppercase">Biography</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about yourself..."
                        className="min-h-[80px] rounded-xl"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* Address Info Section */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-semibold text-foreground border-b pb-2">Physical Address</h3>
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-muted-foreground uppercase">Street Address</FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        <Home className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="123 Main St" {...field} className="pl-10 h-10 rounded-xl" value={field.value || ""} />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-muted-foreground uppercase">City</FormLabel>
                      <FormControl>
                        <div className="relative flex items-center">
                          <Landmark className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Mumbai" {...field} className="pl-10 h-10 rounded-xl" value={field.value || ""} />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-muted-foreground uppercase">State / Region</FormLabel>
                      <FormControl>
                        <div className="relative flex items-center">
                          <Compass className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Maharashtra" {...field} className="pl-10 h-10 rounded-xl" value={field.value || ""} />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-muted-foreground uppercase">Country</FormLabel>
                      <FormControl>
                        <div className="relative flex items-center">
                          <MapPin className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="India" {...field} className="pl-10 h-10 rounded-xl" value={field.value || ""} />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-muted-foreground uppercase">Zip / Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="400001" {...field} className="h-10 rounded-xl" value={field.value || ""} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-11 font-semibold rounded-xl mt-4">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Profile...
                </>
              ) : (
                "Complete Setup"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
export default ProfileForm;
