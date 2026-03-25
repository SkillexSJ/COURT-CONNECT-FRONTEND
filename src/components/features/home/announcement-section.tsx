"use client";

import { useMemo } from "react";
import { useHomeAnnouncementsQuery } from "@/hooks/queries/use-announcement-query";
import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from "@/components/ui/marquee";

export function AnnouncementSection() {

  // QUERY
  const announcementsQuery = useHomeAnnouncementsQuery({
    limit: 20,
    sortBy: "-publishedAt",
  });

  const items = useMemo(
    () => announcementsQuery.data?.data ?? [],
    [announcementsQuery.data?.data],
  );

  const hasItems = items.length > 0;

  return (
    <section className="bg-secondary py-4">
      <div className="mx-auto max-w-screen-2xl overflow-hidden px-6 md:px-12">
        {announcementsQuery.isLoading ? (
          <div className="h-6 w-full animate-pulse bg-primary/15" />
        ) : hasItems ? (
          <Marquee className="w-full">
            <MarqueeFade side="left" className="from-secondary" />
            <MarqueeFade side="right" className="from-secondary" />
            <MarqueeContent speed={40}>
              {items.map((announcement) => (
                <MarqueeItem key={announcement.id} className="mx-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary px-2 py-0.5 font-display text-[10px] font-black uppercase tracking-[0.16em] text-secondary">
                      {announcement.title}
                    </span>
                    <span className="font-display text-sm font-black uppercase tracking-widest text-primary/85">
                      {announcement.content}
                    </span>
                  </div>
                </MarqueeItem>
              ))}
            </MarqueeContent>
          </Marquee>
        ) : (
          <p className="font-display text-sm font-black uppercase tracking-[0.2em] text-primary">
            Stay tuned for upcoming announcements and booking updates.
          </p>
        )}
      </div>
    </section>
  );
}
