'use client';
import { useRef, useState, type FormEvent } from 'react';
import { Button, Select } from '@/components/ui/daybreak';
import { QUICK_CHECK_COPY, getNextStep, firstPlanningQuestion, type QuickCheckLanguage, type Stage, type Destination, type Concern } from '@/lib/daybreak';

const stages: Stage[] = ['early','junior','applying','submitted','decisions','transfer'];
const destinations: Destination[] = ['us','ca','exploring'];
const concerns: Concern[] = ['schools','cost','essay'];
type Answers = { stage: Stage | ''; destination: Destination | ''; concern: Concern | '' };
const empty: Answers = { stage: '', destination: '', concern: '' };
type Ready = 'yes' | 'no' | 'unsure' | '';

export default function NextStepCheck({ language }: { language: QuickCheckLanguage }) {
  const copy = QUICK_CHECK_COPY[language];
  const [answers, setAnswers] = useState<Answers>(empty);
  const [submitted, setSubmitted] = useState(false);
  const [ready, setReady] = useState<Ready[]>(['','','','']);
  const [planning, setPlanning] = useState<string | null>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);
  const stageRef = useRef<HTMLSelectElement>(null);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const result = submitted && answers.stage && answers.destination && answers.concern ? getNextStep(answers.stage, answers.destination, answers.concern, language) : null;
  function invalidate() { setSubmitted(false);setReady(['','','','']);setPlanning(null);if(detailsRef.current)detailsRef.current.open=false; }
  function submit(e: FormEvent<HTMLFormElement>) { e.preventDefault();setSubmitted(true);requestAnimationFrame(()=>resultRef.current?.focus()); }
  return <section className="db-quick-check db-card" lang={language} dir={language==='ur'?'rtl':'ltr'} aria-labelledby="next-step-title">
    <div className="db-check-heading"><h2 id="next-step-title">{copy.check}</h2><span className="db-small db-check-note" lang="en" dir="ltr">A place to begin.</span></div>
    <form className="db-check-fields" onSubmit={submit}>
      <Select id="next-stage" ref={stageRef} label={copy.labels[0]} required value={answers.stage} onChange={e=>{setAnswers({...answers,stage:e.target.value as Stage});invalidate();}}><option value="" disabled>{copy.choose}</option>{stages.map((value,i)=><option key={value} value={value}>{copy.stages[i]}</option>)}</Select>
      <Select id="next-destination" label={copy.labels[1]} required value={answers.destination} onChange={e=>{setAnswers({...answers,destination:e.target.value as Destination});invalidate();}}><option value="" disabled>{copy.choose}</option>{destinations.map((value,i)=><option key={value} value={value}>{copy.destinations[i]}</option>)}</Select>
      <Select id="next-concern" label={copy.labels[2]} required value={answers.concern} onChange={e=>{setAnswers({...answers,concern:e.target.value as Concern});invalidate();}}><option value="" disabled>{copy.choose}</option>{concerns.map((value,i)=><option key={value} value={value}>{copy.concerns[i]}</option>)}</Select>
      <Button type="submit">{copy.submit}<span aria-hidden="true">{language==='ur'?'←':'→'}</span></Button>
    </form>
    <div className="db-check-foot"><p className="db-small">{copy.privacy}</p><a href="#cost-check">{copy.jump}</a></div>
    <div aria-live="polite">{result && <section className="db-next-result">
      <p className="db-eyebrow">{copy.based}</p><h3 tabIndex={-1} ref={resultRef}>{copy.result}</h3><p>{result.action}</p><p className="db-small">{result.hint}</p>
      <div className="db-open-question"><strong>{copy.open}</strong><p>{result.question}</p></div>
      <details ref={detailsRef} className="db-planning" lang="en" dir="ltr"><summary>Find the first missing piece · English</summary><p className="db-small">Optional: check what you already know. This is a planning check, not an admissions assessment.</p>
        <form onSubmit={e=>{e.preventDefault();setPlanning(firstPlanningQuestion(ready));}}>
          {['I have a school or program to research','I have checked its current requirements','I have recorded cost and possible funding','I know my next task'].map((label,i)=><Select key={label} label={label} value={ready[i]} onChange={e=>{setReady(ready.map((value,n)=>n===i?e.target.value as Ready:value));setPlanning(null);}}><option value="">Choose one</option><option value="yes">Yes</option><option value="no">Not yet</option><option value="unsure">Not sure</option></Select>)}
          <Button variant="secondary" type="submit">Check my next question</Button>
        </form><p role="status">{planning}</p>
      </details>
      <Button variant="quiet" onClick={()=>{setAnswers(empty);invalidate();stageRef.current?.focus();}}>{copy.reset}</Button>
    </section>}</div>
  </section>;
}
