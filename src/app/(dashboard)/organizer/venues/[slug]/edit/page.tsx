import VenueDetailsEditorPage from "@/components/features/dashboard/venues/VenueDetailsEditorPage";

type OrganizerVenueEditPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function OrganizerVenueEditPage({
  params,
}: OrganizerVenueEditPageProps) {
  const { slug } = await params;

  return <VenueDetailsEditorPage role="ORGANIZER" slug={slug} />;
}
