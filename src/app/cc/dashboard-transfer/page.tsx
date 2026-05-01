// Legacy redirect. The unified /cc/dashboard auto-picks the transfer
// variant when is_transfer_student is true. The profile-completion form
// previously hosted here moved to /cc/transfer-profile.
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function TransferDashboardLegacyPage() {
  redirect("/cc/dashboard");
}
