// /dashboard → / (the homepage IS the dashboard for logged-in users)
// Some external links and muscle-memory navigation hit /dashboard. Redirect
// instead of 404. Spec: P0 fix 2026-04-07
import { redirect } from "next/navigation";

export default function DashboardRedirect() {
  redirect("/");
}
