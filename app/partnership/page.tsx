import PartnershipLanding from "./PartnershipLanding";

export default function PartnershipPage({
  searchParams,
}: {
  searchParams: { sent?: string };
}) {
  const sentState = searchParams.sent === "partner" || searchParams.sent === "catalog" ? searchParams.sent : null;
  return <PartnershipLanding sentState={sentState} />;
}
