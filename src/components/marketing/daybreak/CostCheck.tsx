'use client';
import { useRef, useState, type FormEvent } from 'react';
import { Button, Field, Select } from '@/components/ui/daybreak';
import { calculateGap } from '@/lib/daybreak';

const empty = {annualCost:'',grants:'',familyContribution:''};
type Calculation = ReturnType<typeof calculateGap>;
export default function CostCheck() {
  const [amounts,setAmounts]=useState(empty),[currency,setCurrency]=useState('USD');
  const [result,setResult]=useState<Calculation|null>(null),[unknown,setUnknown]=useState(false),[currencyChanged,setCurrencyChanged]=useState(false);
  const heading=useRef<HTMLHeadingElement>(null),error=useRef<HTMLParagraphElement>(null),first=useRef<HTMLInputElement>(null),unknownHeading=useRef<HTMLHeadingElement>(null);
  const money=(cents:number)=>new Intl.NumberFormat('en',{style:'currency',currency,currencyDisplay:'code'}).format(cents/100);
  function change(field:keyof typeof empty,value:string) {setAmounts({...amounts,[field]:value});setResult(null);setUnknown(false);}
  function submit(e:FormEvent<HTMLFormElement>) {e.preventDefault();const next=calculateGap(amounts);setResult(next);setUnknown(false);requestAnimationFrame(()=>next.ok?heading.current?.focus():error.current?.focus());}
  function reset() {setAmounts(empty);setCurrency('USD');setResult(null);setUnknown(false);setCurrencyChanged(false);first.current?.focus();}
  return <section id="cost-check" className="db-section db-cost-section" aria-labelledby="cost-title">
    <div className="db-section-intro"><p className="db-eyebrow">When cost is on your mind</p><h2 id="cost-title">Let’s put the numbers<br/>on the table.</h2><p>Use amounts you already have. If you don’t know one yet, we’ll help you work out what to collect.</p><p className="db-small">This check uses your entries. It does not estimate what a school will award you.</p></div>
    <div className="db-card db-cost-tool"><form onSubmit={submit} noValidate>
      <h3>Your annual amounts</h3><Select label="Currency for every amount" value={currency} onChange={e=>{setCurrency(e.target.value);setAmounts(empty);setResult(null);setUnknown(false);setCurrencyChanged(true);}}><option value="USD">USD</option><option value="CAD">CAD</option></Select>
      <p className="db-small" role="status">{currencyChanged?'Amounts cleared. Changing currency does not convert your entries.':`${currency} for all three amounts. No conversion is performed.`}</p>
      <Field ref={first} id="annual-cost" label="Total annual cost" hint="Include tuition and living costs." type="number" min="0" max="10000000" step="0.01" inputMode="decimal" value={amounts.annualCost} onChange={e=>change('annualCost',e.target.value)} error={result && !result.ok && result.field==='annualCost'?result.error:undefined}/>
      <Field id="grants" label="Confirmed grants & scholarships" hint="Exclude loans and unconfirmed awards." type="number" min="0" max="10000000" step="0.01" inputMode="decimal" value={amounts.grants} onChange={e=>change('grants',e.target.value)} error={result && !result.ok && result.field==='grants'?result.error:undefined}/>
      <Field id="family-contribution" label="Family contribution" type="number" min="0" max="10000000" step="0.01" inputMode="decimal" value={amounts.familyContribution} onChange={e=>change('familyContribution',e.target.value)} error={result && !result.ok && result.field==='familyContribution'?result.error:undefined}/>
      {result && !result.ok && <p ref={error} tabIndex={-1} role="alert" className="db-error">Check the highlighted amount. {result.error}</p>}
      <Button type="submit">Calculate the gap <span aria-hidden="true">→</span></Button>
      <Button variant="quiet" onClick={()=>{setUnknown(true);setResult(null);requestAnimationFrame(()=>unknownHeading.current?.focus());}}>I don’t know the amounts yet</Button>
    </form><div className="db-cost-answer" aria-live="polite">
      {unknown?<><h3 ref={unknownHeading} tabIndex={-1}>Collect these three things.</h3><ol><li>The school’s current annual cost, including living costs.</li><li>Your confirmed grants and their renewal conditions.</li><li>What your family could contribute each year.</li></ol><p>Keep a source and date with each number. Leave missing amounts unknown.</p><Button variant="quiet" onClick={()=>{setUnknown(false);first.current?.focus();}}>Back to my numbers</Button></>
      :result?.ok?<><p className="db-eyebrow">Based on your entries</p><h3 ref={heading} tabIndex={-1}>{result.gapCents===0?'Your entered amounts cover this cost.':'Your remaining annual gap.'}</h3><p className="db-cost-amount">{money(result.gapCents)}</p><p>{money(result.annualCostCents)} annual cost − {money(result.grantsCents)} grants − {money(result.familyContributionCents)} family contribution.</p>{result.overcovered&&<p>Contributions exceed this cost, so the remaining gap is shown as zero.</p>}<p className="db-small">Check whether awards renew and costs could change. Loans are not included. A zero gap does not confirm affordability.</p><Button variant="quiet" onClick={reset}>Clear and start again</Button></>
      :<><span className="db-empty-motif" aria-hidden="true">?</span><h3>Unknown is a place to start.</h3><p>Nothing is treated as zero unless you enter zero.</p></>}
    </div></div>
  </section>;
}
