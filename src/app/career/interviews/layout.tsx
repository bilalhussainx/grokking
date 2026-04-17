import { InterviewProvider } from "@/contexts/InterviewContext";

export default function CareerInterviewsLayout({ children }: { children: React.ReactNode }) {
  return <InterviewProvider>{children}</InterviewProvider>;
}
