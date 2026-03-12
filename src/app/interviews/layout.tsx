import { InterviewProvider } from "@/contexts/InterviewContext";

export default function InterviewsLayout({ children }: { children: React.ReactNode }) {
  return <InterviewProvider>{children}</InterviewProvider>;
}
