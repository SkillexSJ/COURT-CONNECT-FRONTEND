"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  ArrowRight,
  BriefcaseBusiness,
  Loader2,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpSchema, type SignUpFormValues } from "@/lib/validations/auth";
import { authService } from "@/service/auth.service";
import { organizerService } from "@/service/organizer.service";

type Role = "USER" | "ORGANIZER";

function UserSignUpFields({
  form,
  isLoading,
}: {
  form: ReturnType<typeof useForm<SignUpFormValues>>;
  isLoading: boolean;
}) {
  return (
    <>
      <div className="space-y-2">
        <Label
          htmlFor="name"
          className="block text-xs font-bold tracking-widest uppercase text-foreground"
        >
          Full Name
        </Label>
        <Input
          id="name"
          placeholder="ALEXANDER STERLING"
          {...form.register("name")}
          className={`bg-transparent border-0 border-b-2 rounded-none px-0 py-2.5 md:py-3 focus-visible:ring-0 focus-visible:border-primary transition-colors text-sm md:text-base ${
            form.formState.errors.name ? "border-destructive" : "border-input"
          }`}
          disabled={isLoading}
        />
        {form.formState.errors.name?.message && (
          <p className="text-xs text-error">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="email"
          className="block text-xs font-bold tracking-widest uppercase text-foreground"
        >
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="alex@elitearena.com"
          {...form.register("email")}
          className={`bg-transparent border-0 border-b-2 rounded-none px-0 py-2.5 md:py-3 focus-visible:ring-0 focus-visible:border-primary transition-colors text-sm md:text-base ${
            form.formState.errors.email ? "border-destructive" : "border-input"
          }`}
          disabled={isLoading}
        />
        {form.formState.errors.email?.message && (
          <p className="text-xs text-error">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="password"
          className="block text-xs font-bold tracking-widest uppercase text-foreground"
        >
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••••••"
          {...form.register("password")}
          className={`bg-transparent border-0 border-b-2 rounded-none px-0 py-2.5 md:py-3 focus-visible:ring-0 focus-visible:border-primary transition-colors text-sm md:text-base ${
            form.formState.errors.password
              ? "border-destructive"
              : "border-input"
          }`}
          disabled={isLoading}
        />
        {form.formState.errors.password?.message && (
          <p className="text-xs text-error">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>
    </>
  );
}

function OrganizerExtraFields({
  form,
  isLoading,
}: {
  form: ReturnType<typeof useForm<SignUpFormValues>>;
  isLoading: boolean;
}) {
  return (
    <>
      <div className="space-y-2">
        <Label
          htmlFor="businessName"
          className="block text-xs font-bold tracking-widest uppercase text-foreground"
        >
          Business Name
        </Label>
        <Input
          id="businessName"
          placeholder="Your business name"
          {...form.register("businessName")}
          className={`bg-transparent border-0 border-b-2 rounded-none px-0 py-2.5 md:py-3 focus-visible:ring-0 focus-visible:border-primary transition-colors text-sm md:text-base ${
            form.formState.errors.businessName
              ? "border-destructive"
              : "border-input"
          }`}
          disabled={isLoading}
        />
        {form.formState.errors.businessName?.message && (
          <p className="text-xs text-destructive">
            {form.formState.errors.businessName.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="phoneNumber"
          className="block text-xs font-bold tracking-widest uppercase text-foreground"
        >
          Phone Number
        </Label>
        <Input
          id="phoneNumber"
          placeholder="+1 (555) 000-0000"
          {...form.register("phoneNumber")}
          className={`bg-transparent border-0 border-b-2 rounded-none px-0 py-2.5 md:py-3 focus-visible:ring-0 focus-visible:border-primary transition-colors text-sm md:text-base ${
            form.formState.errors.phoneNumber
              ? "border-destructive"
              : "border-input"
          }`}
          disabled={isLoading}
        />
        {form.formState.errors.phoneNumber?.message && (
          <p className="text-xs text-destructive">
            {form.formState.errors.phoneNumber.message}
          </p>
        )}
      </div>
    </>
  );
}

export function SignUpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<Role>("USER");

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      role: "USER",
      name: "",
      email: "",
      password: "",
      businessName: "",
      phoneNumber: "",
    },
  });

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    form.setValue("role", role, { shouldValidate: true });
  };

  async function onSubmit(values: SignUpFormValues) {
    try {
      setIsLoading(true);

      await authService.signUp({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      if (values.role === "ORGANIZER") {
        await organizerService.createProfile({
          businessName: values.businessName?.trim() || "Organizer",
          phoneNumber: values.phoneNumber?.trim() || undefined,
        });

        // Refresh auth session so role changes are reflected immediately.
        await authService.signOut();
        await authService.signIn({
          email: values.email,
          password: values.password,
        });
      }

      toast.success("Account created successfully!");
      router.push(values.role === "ORGANIZER" ? "/organizer" : "/");
      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "An error occurred during sign up";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full space-y-8">
      <div className="space-y-3">
        <h2 className="font-heading font-black text-3xl md:text-4xl text-foreground uppercase tracking-tight">
          Get Started
        </h2>
        <p className="text-muted-foreground text-sm md:text-base">
          Create your professional profile today.
        </p>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="space-y-7"
      >
        <div className="space-y-4">
          <Label className="font-sans text-xs font-bold tracking-widest text-foreground uppercase">
            Select your path
          </Label>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleRoleSelect("USER")}
              className={`relative flex flex-col items-center justify-center p-4 md:p-5 transition-all duration-300 border-2 ${
                selectedRole === "USER"
                  ? "border-primary bg-card"
                  : "border-border bg-muted hover:bg-accent"
              } active:scale-95`}
            >
              <UserRound className="w-6 h-6 md:w-7 md:h-7 mb-2 text-foreground" />
              <span className="font-heading font-bold text-xs md:text-sm uppercase tracking-tight text-foreground">
                Athlete
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect("ORGANIZER")}
              className={`relative flex flex-col items-center justify-center p-4 md:p-5 transition-all duration-300 border-2 ${
                selectedRole === "ORGANIZER"
                  ? "border-primary bg-card"
                  : "border-border bg-muted hover:bg-accent"
              } active:scale-95`}
            >
              <BriefcaseBusiness className="w-6 h-6 md:w-7 md:h-7 mb-2 text-foreground" />
              <span className="font-heading font-bold text-xs md:text-sm uppercase tracking-tight text-foreground">
                Organizer
              </span>
            </button>
          </div>

          {form.formState.errors.role?.message && (
            <p className="text-sm text-error">
              {form.formState.errors.role.message}
            </p>
          )}
        </div>

        <div className="space-y-5">
          <UserSignUpFields form={form} isLoading={isLoading} />

          {selectedRole === "ORGANIZER" && (
            <OrganizerExtraFields form={form} isLoading={isLoading} />
          )}
        </div>

        <div className="space-y-4 pt-3">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-secondary text-secondary-foreground font-heading font-black uppercase tracking-widest py-3 md:py-4 px-6 transition-all duration-300 hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2 text-sm md:text-base"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </>
            )}
          </Button>

          <p className="text-center font-sans text-xs md:text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-foreground font-bold underline decoration-secondary decoration-2 underline-offset-4 hover:text-primary transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
