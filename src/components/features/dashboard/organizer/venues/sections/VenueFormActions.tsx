import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type Props = {
  isSubmitting: boolean;
  onBack: () => void;
};

export function VenueFormActions({ isSubmitting, onBack }: Props) {
  return (
    <>
      <Separator />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-muted-foreground">
          Your venue will be submitted as pending approval after save.
        </p>
        <div className="flex w-full gap-3 md:w-auto">
          <Button
            type="button"
            variant="outline"
            className="w-full md:w-auto"
            onClick={onBack}
          >
            Go Back
          </Button>
          <Button
            type="submit"
            className="w-full md:w-auto bg-primary text-primary-foreground"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" /> Saving Venue
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
