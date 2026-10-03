// src/lib/cc/agent/context-budget.ts
// Approximate context sizing, not a tokenizer or monetary spend guarantee.
export function estimateTokens(value:string):number {
 let ascii=0,other=0;for(const c of value){if(c.codePointAt(0)!<=127)ascii++;else other++;}
 return Math.ceil(ascii/3+other);
}
export function summarizePriorReleased(parts:readonly string[]):string[] {
 const out:string[]=[];let budget=448,omitted=0;
 for(let i=parts.length-1;i>=0;i--){
  const chars=Array.from(parts[i]);let tail=chars.slice(-600).join("");
  while(tail && estimateTokens(tail)>Math.min(160,budget))tail=Array.from(tail).slice(1).join("");
  if(tail){out.unshift(tail);budget-=estimateTokens(tail);}
  if(tail!==parts[i])omitted++;
  if(budget<=0){omitted+=i;break;}
 }
 const marker="[PRIOR_CONTEXT_TRUNCATED: earlier or partial segments omitted; exact retained tails follow; abstain if assembly cannot be assessed.]";
 if(omitted)out.unshift(marker);
 while(estimateTokens(JSON.stringify(out))>512){
  if(out[0]!==marker)out.unshift(marker);
  out.splice(1,1);
 }
 return out;
}
