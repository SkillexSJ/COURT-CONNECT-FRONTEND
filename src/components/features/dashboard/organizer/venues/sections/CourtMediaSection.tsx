import Image from "next/image";
import { IconCamera, IconCloudUpload, IconTrash } from "@tabler/icons-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  primaryPreview: string | null;
  galleryImages: File[];
  onPrimaryChange: (file: File | null) => void;
  onGalleryChange: (files: FileList | null) => void;
  onRemoveGalleryImage: (index: number) => void;
};

export function CourtMediaSection({
  primaryPreview,
  galleryImages,
  onPrimaryChange,
  onGalleryChange,
  onRemoveGalleryImage,
}: Props) {
  return (
    <Card className="rounded-sm border-border bg-card">
      <CardHeader>
        <CardTitle className="font-heading text-xl font-black uppercase tracking-tight text-primary">
          II. Court Media
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <label className="group relative col-span-2 flex aspect-video cursor-pointer items-center justify-center overflow-hidden border-2 border-dashed border-primary/30 bg-muted/30">
            {primaryPreview ? (
              <Image
                src={primaryPreview}
                alt="Primary preview"
                fill
                loading="eager"
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 66vw, 40vw"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <IconCamera className="size-7" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Primary Image
                </span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) =>
                onPrimaryChange(event.target.files?.[0] ?? null)
              }
            />
            <span className="absolute top-2 left-2 bg-secondary px-2 py-1 text-[10px] font-black text-secondary-foreground uppercase">
              Primary
            </span>
          </label>

          <label className="flex aspect-video cursor-pointer items-center justify-center border-2 border-dashed border-border text-center text-xs font-bold text-muted-foreground uppercase tracking-wide">
            Add gallery images
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(event) => onGalleryChange(event.target.files)}
            />
          </label>
        </div>

        {galleryImages.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {galleryImages.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between border border-border bg-background px-3 py-2 text-xs"
              >
                <span className="truncate pr-3">{file.name}</span>
                <button
                  type="button"
                  onClick={() => onRemoveGalleryImage(index)}
                  className="text-destructive"
                >
                  <IconTrash className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <IconCloudUpload className="size-4" />
          Selected images will upload to Cloudinary when you submit the venue.
        </div>
      </CardContent>
    </Card>
  );
}
