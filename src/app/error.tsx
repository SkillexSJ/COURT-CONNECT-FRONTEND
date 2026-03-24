"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-10 w-10 text-destructive" />
      </div>
      <h1 className="mb-2 text-3xl font-bold tracking-tight">
        Something went wrong!
      </h1>
      <p className="mb-8 max-w-[500px] text-muted-foreground">
        We encountered an unexpected error. Our team has been notified. Please
        try refreshing the page.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} variant="default" size="lg">
          <RefreshCcw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
        <Button
          onClick={() => (window.location.href = "/")}
          variant="outline"
          size="lg"
        >
          Go Home
        </Button>
      </div>
    </div>
  );
}
