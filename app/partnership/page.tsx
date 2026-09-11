import PartnershipLanding from "./PartnershipLanding";

export default function PartnershipPage({
  searchParams,
}: {
  searchParams: { sent?: string };
}) {
  const raw = searchParams.sent ?? "";
  const sentState = raw.startsWith("partner") ? "partner" : raw.startsWith("catalog") ? "catalog" : null;
  // sentKey йде в key спливаючого вікна — унікальний хвіст (timestamp) у "sent"
  // гарантує, що вікно монтується заново навіть при повторній відправці тієї ж форми.
  return <PartnershipLanding sentState={sentState} sentKey={raw} />;
}
