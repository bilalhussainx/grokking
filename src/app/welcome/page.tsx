import DaybreakHomepage from "@/components/marketing/daybreak/DaybreakHomepage";

// Signed-out visitors on "/" are rewritten here by middleware. Keeping the
// public homepage on its own route means it's server-rendered and doesn't
// ship the signed-in dashboard or the course catalogue that "/" carries.
export default function WelcomePage() {
  return <DaybreakHomepage />;
}
