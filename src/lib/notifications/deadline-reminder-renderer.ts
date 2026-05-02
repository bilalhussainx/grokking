export function renderDeadlineReminderEmail(input: {
  studentName: string | null;
  schoolName: string;
  deadlineType: string;
  daysAway: number;
  deadlineDateIso: string;
  appOrigin: string;
}): { subject: string; html: string } {
  const { studentName, schoolName, deadlineType, daysAway, deadlineDateIso, appOrigin } = input;
  const greeting = studentName ? `Hey ${studentName},` : "Hey,";
  const urgency = daysAway <= 1 ? " — this is tomorrow" : "";
  const subject = `${schoolName} ${deadlineType} deadline in ${daysAway} day${daysAway === 1 ? "" : "s"}${urgency}`;
  const html = `
    <p>${greeting}</p>
    <p>Your <strong>${schoolName} ${deadlineType}</strong> deadline is in <strong>${daysAway} day${daysAway === 1 ? "" : "s"}</strong> (${deadlineDateIso}).</p>
    <p><a href="${appOrigin}/applications" style="background:#D4AF37;color:#05080d;padding:12px 18px;border-radius:8px;text-decoration:none;display:inline-block">Open the application checklist →</a></p>
    <p style="color:#666;font-size:12px">You can disable these reminders in your account settings.</p>
  `;
  return { subject, html };
}
