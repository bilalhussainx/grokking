// Minimal text PDF fixture. Every item is synthetic, not a real achievement.
const fs = require('node:fs');
const path = require('node:path');
const lines = [
  'SYNTHETIC QA RESUME - ASTRA TEST1',
  'Not a real student record. For authorized platform testing only.',
  '',
  'ACTIVITY',
  'QA Copper Finch Robotics Club',
  'Role: Member. Grade: 9. Hours per week: 2. Weeks per year: 8.',
  'Built a practice sensor circuit and kept a testing notebook.',
  'This is a synthetic activity for save and recall verification.',
  '',
  'HONOR',
  'QA Circuit Notebook Recognition',
  'School-level recognition. Grade 9. Synthetic QA fixture only.',
];
const escape = s => s.replace(/[\\()]/g, '\\$&');
const stream = 'BT /F1 11 Tf 50 750 Td 16 TL\n' + lines.map((s,i)=>(i?'T* ':'')+'('+escape(s)+') Tj').join('\n') + '\nET';
const objs = [
  '<< /Type /Catalog /Pages 2 0 R >>',
  '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
  '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
];
let pdf='%PDF-1.4\n'; const offsets=[0];
objs.forEach((s,i)=>{offsets.push(Buffer.byteLength(pdf));pdf+=`${i+1} 0 obj\n${s}\nendobj\n`;});
const xref=Buffer.byteLength(pdf);
pdf+=`xref\n0 ${objs.length+1}\n0000000000 65535 f \n`;
pdf+=offsets.slice(1).map(n=>String(n).padStart(10,'0')+' 00000 n \n').join('');
pdf+=`trailer\n<< /Size ${objs.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
fs.writeFileSync(path.join(__dirname,'qa-synthetic-resume.pdf'),pdf);
console.log('Wrote synthetic resume fixture:',Buffer.byteLength(pdf),'bytes');
