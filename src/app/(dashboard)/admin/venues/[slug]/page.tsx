import VenueDetailsEditorPage from "@/components/features/dashboard/venues/VenueDetailsEditorPage";

type AdminVenueReviewPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function AdminVenueReviewPage({
  params,
}: AdminVenueReviewPageProps) {
  const { slug } = await params;

  return <VenueDetailsEditorPage role="ADMIN" slug={slug} />;
}
