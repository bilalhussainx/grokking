import { InterviewProvider } from "@/contexts/InterviewContext";

export default function CollegeInterviewsLayout({ children }: { children: React.ReactNode }) {
  return <InterviewProvider>{children}</InterviewProvider>;
}
