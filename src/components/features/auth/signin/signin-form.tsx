"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInSchema, type SignInFormValues } from "@/lib/validations/auth";
import { authService } from "@/service/auth.service";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // STATE
  const [isLoading, setIsLoading] = React.useState(false);

  // FORM SETUP
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // SUBMISSION HANDLER
  async function onSubmit(values: SignInFormValues) {
    try {
      setIsLoading(true);

      await authService.signIn({
        email: values.email,
        password: values.password,
      });

      toast.success("Signed in successfully!");

      const callbackUrl = searchParams.get("callbackUrl");
      const nextPath =
        callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/dashboard";

      router.push(nextPath);
      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "An error occurred during sign in";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full space-y-8">
      <div className="space-y-3">
        <h2 className="font-heading font-black text-3xl md:text-4xl text-foreground uppercase tracking-tight">
          Welcome Back
        </h2>
        <p className="text-muted-foreground text-sm md:text-base">
          Access your professional dashboard.
        </p>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="space-y-7"
      >
        <div className="space-y-5">
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
              placeholder="alex@courtconnect.com"
              {...form.register("email")}
              className={`bg-transparent border-0 border-b-2 rounded-none px-0 py-2.5 md:py-3 focus-visible:ring-0 focus-visible:border-primary transition-colors text-sm md:text-base ${
                form.formState.errors.email
                  ? "border-destructive"
                  : "border-input"
              }`}
              disabled={isLoading}
            />
            {form.formState.errors.email?.message && (
              <p className="text-xs text-destructive">
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
              <p className="text-xs text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
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
                Signing In...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </>
            )}
          </Button>

          <p className="text-center font-sans text-xs md:text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-foreground font-bold underline decoration-secondary decoration-2 underline-offset-4 hover:text-primary transition-colors"
            >
              Create One
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
