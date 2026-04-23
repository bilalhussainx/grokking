/* Landing v2 — built to match kairoslearn.com live references.
   Cormorant italic display + DM Sans body + antique gold + grain + inline Coach demo.
   Surface: single long-scroll page at 1280 design width. */
/* global React */
const { useState, useRef, useEffect } = React;

// ───────── Grain overlay ─────────
function Grain({ opacity = 0.08 }) {
  return (
    <svg aria-hidden style={{position:'absolute',inset:'-50%',width:'200%',height:'200%',opacity,zIndex:1000,pointerEvents:'none',mixBlendMode:'overlay'}} xmlns="http://www.w3.org/2000/svg">
      <filter id="kg2"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/></filter>
      <rect width="100%" height="100%" filter="url(#kg2)"/>
    </svg>
  );
}

// ───────── Neural canvas (hero background) ─────────
function NeuralBg() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d');
    const W = c.width = c.offsetWidth * 2; const H = c.height = c.offsetHeight * 2;
    ctx.scale(2, 2);
    const w = c.offsetWidth, h = c.offsetHeight;
    const N = 80;
    const pts = Array.from({length:N},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.18,vy:(Math.random()-.5)*.18,r:Math.random()*1.2+.6}));
    let raf;
    function tick(){
      ctx.clearRect(0,0,w,h);
      for (const p of pts){ p.x+=p.vx; p.y+=p.vy; if(p.x<0||p.x>w)p.vx*=-1; if(p.y<0||p.y>h)p.vy*=-1; }
      for (let i=0;i<N;i++){ for (let j=i+1;j<N;j++){
        const a=pts[i],b=pts[j]; const dx=a.x-b.x,dy=a.y-b.y; const d=Math.sqrt(dx*dx+dy*dy);
        if (d<150){ ctx.strokeStyle=`rgba(212,168,75,${0.32*(1-d/150)})`; ctx.lineWidth=.6; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); }
      }}
      for (const p of pts){ ctx.fillStyle='rgba(212,168,75,.8)'; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill(); }
      raf = requestAnimationFrame(tick);
    }
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%',zIndex:1,opacity:.7}}/>;
}

// ───────── Nav ─────────
function Nav() {
  return (
    <nav style={{position:'absolute',top:24,left:40,right:40,zIndex:30,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 28px',background:'rgba(5,8,13,0.55)',backdropFilter:'blur(18px)',border:'1px solid rgba(242,237,227,.10)'}}>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <div style={{width:32,height:32,background:'#d4a84b',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Cormorant Garamond',fontStyle:'italic',fontWeight:500,color:'#05080d',fontSize:17}}>K</div>
        <div style={{fontFamily:'Cormorant Garamond',fontWeight:400,fontSize:19,color:'#f2ede3',letterSpacing:'.03em'}}>
          <em style={{color:'#d4a84b',fontStyle:'italic'}}>Kairos</em>Learn
        </div>
      </div>
      <div style={{display:'flex',gap:36,fontSize:11,letterSpacing:'.24em',textTransform:'uppercase',color:'rgba(242,237,227,.70)',fontWeight:400}}>
        <span>Counselor</span><span>Essays</span><span>Schools</span><span>Pricing</span><span>Stories</span>
      </div>
      <div style={{display:'flex',gap:16,alignItems:'center'}}>
        <span style={{fontSize:11,letterSpacing:'.24em',textTransform:'uppercase',color:'rgba(242,237,227,.65)'}}>Sign in</span>
        <button style={{background:'#f2ede3',color:'#05080d',border:0,padding:'11px 22px',fontSize:10.5,letterSpacing:'.18em',textTransform:'uppercase',fontWeight:500,cursor:'pointer'}}>Start for free</button>
      </div>
    </nav>
  );
}

// ───────── Coach demo widget (embedded in hero) ─────────
function CoachDemo() {
  const [msgs, setMsgs] = useState([
    {who:'k', text:'Tell me the schools you\'re considering — I\'ll tell you honestly if they\'re reach, match, or safety for you.'},
  ]);
  const [input, setInput] = useState('');
  const send = () => {
    if (!input.trim()) return;
    const user = input.trim();
    setMsgs(m => [...m, {who:'u', text:user}]);
    setInput('');
    setTimeout(() => {
      setMsgs(m => [...m, {who:'k', text:`"${user}" — got it. Tell me your unweighted GPA, rough SAT, and whether you need aid. I'll rank it reach/match/safety and flag anything off.`}]);
    }, 600);
  };
  return (
    <div style={{width:440,background:'#0a0d15',border:'1px solid rgba(212,168,75,.24)',boxShadow:'0 40px 100px -20px rgba(0,0,0,.7), 0 0 0 1px rgba(212,168,75,.08)'}}>
      {/* header */}
      <div style={{padding:'14px 18px',borderBottom:'1px solid rgba(242,237,227,.08)',display:'flex',alignItems:'center',gap:12}}>
        <div style={{width:36,height:36,borderRadius:999,background:'#d4a84b',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Cormorant Garamond',fontStyle:'italic',fontWeight:500,color:'#05080d',fontSize:17,position:'relative'}}>
          K<span style={{position:'absolute',top:-1,right:-1,width:9,height:9,borderRadius:999,background:'#34d399',boxShadow:'0 0 6px #34d399'}}/>
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:600,color:'#f2ede3',fontFamily:'DM Sans'}}>Coach Kairos</div>
          <div style={{fontSize:10.5,color:'rgba(242,237,227,.50)',fontFamily:'DM Sans',marginTop:1}}>Free to try · no signup</div>
        </div>
        <div style={{fontSize:9.5,letterSpacing:'.22em',textTransform:'uppercase',color:'#d4a84b',display:'flex',alignItems:'center',gap:6}}>
          <span style={{width:5,height:5,borderRadius:999,background:'#34d399'}}/>Live
        </div>
      </div>
      {/* transcript */}
      <div style={{padding:'18px 18px 10px',minHeight:200,display:'flex',flexDirection:'column',gap:10}}>
        {msgs.map((m,i)=>m.who==='k' ? (
          <div key={i} style={{background:'rgba(242,237,227,.04)',border:'1px solid rgba(242,237,227,.08)',padding:'10px 14px',maxWidth:360,fontSize:13,color:'#f2ede3',lineHeight:1.55,fontFamily:'DM Sans'}}>
            {m.text}
          </div>
        ) : (
          <div key={i} style={{alignSelf:'flex-end',background:'rgba(212,168,75,.18)',border:'1px solid rgba(212,168,75,.30)',padding:'10px 14px',maxWidth:300,fontSize:13,color:'#f2ede3',lineHeight:1.55,fontFamily:'DM Sans'}}>
            {m.text}
          </div>
        ))}
        {/* suggested chips */}
        <div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:4}}>
          {['Brown, MIT, UIUC','My list is too top-heavy','Chance me for UPenn'].map(s => (
            <button key={s} onClick={()=>setInput(s)} style={{background:'transparent',color:'rgba(242,237,227,.70)',border:'1px solid rgba(242,237,227,.18)',padding:'4px 10px',fontSize:10.5,letterSpacing:'.02em',cursor:'pointer',fontFamily:'DM Sans'}}>
              {s}
            </button>
          ))}
        </div>
      </div>
      {/* input */}
      <div style={{padding:'12px 14px',borderTop:'1px solid rgba(242,237,227,.08)'}}>
        <div style={{display:'flex',gap:8,background:'rgba(242,237,227,.04)',border:'1px solid rgba(212,168,75,.24)',padding:'8px 10px'}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Type a school name or question…" style={{background:'transparent',border:0,flex:1,color:'#f2ede3',fontSize:12,fontFamily:'DM Sans',outline:'none'}}/>
          <button onClick={send} style={{background:'#d4a84b',color:'#05080d',border:0,padding:'5px 14px',fontSize:10.5,letterSpacing:'.14em',textTransform:'uppercase',fontWeight:600,cursor:'pointer',fontFamily:'DM Sans'}}>Send</button>
        </div>
        <div style={{textAlign:'center',fontSize:10,color:'rgba(242,237,227,.35)',marginTop:8,fontFamily:'DM Sans'}}>Your answers save automatically — upgrade anytime.</div>
      </div>
    </div>
  );
}

// ───────── Hero ─────────
function Hero() {
  return (
    <section style={{position:'relative',minHeight:860,background:'#05080d',overflow:'hidden'}}>
      <NeuralBg />
      <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 80% 60% at 70% 45%, rgba(212,168,75,.10), transparent 65%)',zIndex:2}}/>
      <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at center, transparent 0%, rgba(5,8,13,.75) 80%)',zIndex:3}}/>
      <div style={{position:'absolute',bottom:0,left:0,right:0,height:140,background:'linear-gradient(to bottom, transparent, #05080d)',zIndex:4}}/>
      <Nav />

      <div style={{position:'relative',zIndex:10,padding:'180px 80px 90px',display:'grid',gridTemplateColumns:'1fr 480px',gap:64,alignItems:'center',maxWidth:1400,margin:'0 auto'}}>
        {/* Left copy */}
        <div>
          <div style={{color:'#d4a84b',letterSpacing:'.32em',fontSize:10.5,textTransform:'uppercase',marginBottom:28,fontWeight:400,display:'flex',alignItems:'center',gap:14}}>
            <span style={{display:'inline-block',width:26,height:1,background:'#d4a84b'}}/>
            <span>Your AI counselor. For <em style={{fontStyle:'italic',textTransform:'none',letterSpacing:0,fontSize:14,color:'#f2ede3'}}>every</em> student.</span>
          </div>
          <h1 style={{fontFamily:'Cormorant Garamond',fontWeight:300,fontSize:88,lineHeight:.98,letterSpacing:'-.015em',margin:0,color:'#f2ede3'}}>
            Every student<br/>deserves a counselor<br/>who <em style={{color:'#d4a84b',fontStyle:'italic'}}>actually knows</em> them.
          </h1>
          <p style={{fontSize:16,lineHeight:1.7,color:'rgba(242,237,227,.65)',fontWeight:300,marginTop:36,maxWidth:520,fontFamily:'DM Sans'}}>
            The average U.S. public-school counselor serves <span style={{color:'#f2ede3',fontFamily:'JetBrains Mono',fontSize:14}}>415 students</span>. For first-gen, international, and underprivileged applicants, that means almost no time, no translation, no institutional memory.
            <br/><br/>
            Coach Kairos is one counselor per student — in your language, trained on your profile, available at 3 a.m. on a Saturday.
          </p>
          <div style={{marginTop:42,display:'flex',gap:14,alignItems:'center'}}>
            <button style={{background:'#d4a84b',color:'#05080d',border:0,padding:'17px 34px',fontSize:11,letterSpacing:'.18em',textTransform:'uppercase',fontWeight:600,cursor:'pointer',fontFamily:'DM Sans'}}>Start for free →</button>
            <button style={{background:'transparent',color:'#f2ede3',border:'1px solid rgba(242,237,227,.28)',padding:'16px 28px',fontSize:11,letterSpacing:'.18em',textTransform:'uppercase',cursor:'pointer',fontFamily:'DM Sans',display:'flex',alignItems:'center',gap:10}}>
              <span style={{width:24,height:24,borderRadius:999,border:'1px solid #d4a84b',display:'inline-flex',alignItems:'center',justifyContent:'center'}}>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="#d4a84b"><polygon points="6 4 20 12 6 20"/></svg>
              </span>
              Watch 90-sec demo
            </button>
          </div>
          <div style={{marginTop:34,display:'flex',alignItems:'center',gap:22,fontSize:11,color:'rgba(242,237,227,.50)',fontFamily:'DM Sans'}}>
            <span style={{display:'flex',alignItems:'center',gap:7}}><span style={{width:6,height:6,borderRadius:999,background:'#34d399'}}/>No credit card</span>
            <span>·</span>
            <span>40+ languages</span>
            <span>·</span>
            <span>Used by students across the 2025–26 cycle</span>
          </div>
        </div>
        {/* Right Coach demo */}
        <div><CoachDemo /></div>
      </div>
      <Grain opacity={0.08}/>
    </section>
  );
}

// ───────── Who it's for ─────────
function ForgottenStudent() {
  const rows = [
    {tag:'International', title:'Pakistani GPA, translated.', copy:'Upload a Matric / FSc transcript and Coach Kairos converts your marks to a 4.0 unweighted + 100-point weighted scale the way U.S. admissions officers actually read them.', chip:'85.2% FSc → 3.76 UW', glyph:'◎'},
    {tag:'First-gen',     title:'Hindi, Punjabi, <em>Español</em>.', copy:'Voice coaching and essay feedback in the language you think in. Switch mid-sentence — your coach follows. 40+ languages, native-level.', chip:'हिंदी · ਪੰਜਾਬੀ · Español', glyph:'⟡'},
    {tag:'Under-resourced', title:'$0 aid is a real option.', copy:'Need-aware filters on every school. Net-price calculators baked into chancing. Coach Kairos flags schools that meet 100% of demonstrated need — before you fall in love with a list you can\'t afford.', chip:'Net price · $0 — $4,200', glyph:'◈'},
  ];
  return (
    <section style={{background:'#05080d',padding:'130px 80px 120px',position:'relative',borderTop:'1px solid rgba(242,237,227,.06)'}}>
      <div style={{maxWidth:1280,margin:'0 auto'}}>
        <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:60}}>
          <div style={{maxWidth:680}}>
            <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:22}}>
              <span style={{width:26,height:1,background:'#d4a84b'}}/>
              <span style={{color:'#d4a84b',letterSpacing:'.32em',fontSize:10.5,textTransform:'uppercase'}}>Who it's for</span>
            </div>
            <h2 style={{fontFamily:'Cormorant Garamond',fontWeight:300,fontSize:56,lineHeight:1.05,color:'#f2ede3',margin:0,letterSpacing:'-.01em'}}>
              Built for the student<br/><em style={{color:'#d4a84b',fontStyle:'italic'}}>everyone forgot.</em>
            </h2>
          </div>
          <div style={{fontFamily:'JetBrains Mono',fontSize:11,color:'rgba(242,237,227,.40)',letterSpacing:'.10em'}}>03 — three audiences</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:2}}>
          {rows.map((r,i)=>(
            <div key={i} style={{padding:'38px 34px 40px',border:'1px solid rgba(242,237,227,.10)',background:i===0?'rgba(212,168,75,.06)':'transparent',minHeight:360,display:'flex',flexDirection:'column'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:32}}>
                <div style={{width:42,height:42,border:'1px solid rgba(212,168,75,.40)',display:'flex',alignItems:'center',justifyContent:'center',color:'#d4a84b',fontSize:17}}>{r.glyph}</div>
                <span style={{fontSize:10,letterSpacing:'.28em',textTransform:'uppercase',color:'rgba(242,237,227,.45)',fontFamily:'DM Sans'}}>{r.tag}</span>
              </div>
              <h3 style={{fontFamily:'Cormorant Garamond',fontWeight:300,fontSize:30,lineHeight:1.15,color:'#f2ede3',margin:0,marginBottom:18}} dangerouslySetInnerHTML={{__html:r.title}}/>
              <p style={{fontSize:13,lineHeight:1.85,color:'rgba(242,237,227,.60)',fontWeight:300,margin:0,fontFamily:'DM Sans'}}>{r.copy}</p>
              <div style={{marginTop:'auto',paddingTop:26,fontFamily:'JetBrains Mono',fontSize:11,color:'#d4a84b',letterSpacing:'.04em'}}>→ {r.chip}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ───────── Pipeline ─────────
function Pipeline() {
  const steps = [
    {n:'01', t:'Intake',         sub:'5-minute profile', copy:'Grades, context, goals, need. Coach Kairos builds your profile once — every tool uses it forever.'},
    {n:'02', t:'School List',    sub:'Reach · Match · Safety', copy:'Chance any school in seconds. Balanced by the numbers, not the marketing.'},
    {n:'03', t:'Essays',         sub:'Personal + supplements', copy:'Brainstorm → outline → draft → revise. Real feedback at the paragraph level.'},
    {n:'04', t:'Interview',      sub:'10 alumni AI personas',  copy:'Harvard, Yale, Stanford, MIT, and more. In your language. Real-time pronunciation.'},
    {n:'05', t:'Financial Aid',  sub:'$0 is the goal',         copy:'Net price calculators, CSS Profile prep, scholarship matching. We fight for the number.'},
  ];
  return (
    <section style={{background:'#05080d',padding:'0 80px 130px',position:'relative'}}>
      <div style={{maxWidth:1280,margin:'0 auto'}}>
        <div style={{marginBottom:60,maxWidth:720}}>
          <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:22}}>
            <span style={{width:26,height:1,background:'#d4a84b'}}/>
            <span style={{color:'#d4a84b',letterSpacing:'.32em',fontSize:10.5,textTransform:'uppercase'}}>The full pipeline</span>
          </div>
          <h2 style={{fontFamily:'Cormorant Garamond',fontWeight:300,fontSize:56,lineHeight:1.05,color:'#f2ede3',margin:0,letterSpacing:'-.01em'}}>
            One coach, from hello to <em style={{color:'#d4a84b',fontStyle:'italic'}}>yes.</em>
          </h2>
        </div>
        <div style={{position:'relative'}}>
          {/* connecting line */}
          <div style={{position:'absolute',top:36,left:'8%',right:'8%',height:1,background:'linear-gradient(to right, transparent, rgba(212,168,75,.4) 10%, rgba(212,168,75,.4) 90%, transparent)',zIndex:0}}/>
          <div style={{display:'grid',gridTemplateColumns:'repeat(5, 1fr)',gap:28,position:'relative',zIndex:1}}>
            {steps.map((s,i)=>(
              <div key={s.n} style={{display:'flex',flexDirection:'column',alignItems:'flex-start',gap:16}}>
                <div style={{width:72,height:72,border:'1px solid rgba(212,168,75,.45)',background:'#05080d',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Cormorant Garamond',fontStyle:'italic',fontWeight:300,fontSize:32,color:'#d4a84b'}}>
                  {s.n}
                </div>
                <div style={{fontSize:10,letterSpacing:'.28em',textTransform:'uppercase',color:'rgba(242,237,227,.50)',fontFamily:'DM Sans'}}>{s.sub}</div>
                <h3 style={{fontFamily:'Cormorant Garamond',fontWeight:300,fontSize:28,lineHeight:1.05,color:'#f2ede3',margin:0}}>{s.t}</h3>
                <p style={{fontSize:12.5,lineHeight:1.75,color:'rgba(242,237,227,.58)',fontWeight:300,margin:0,fontFamily:'DM Sans'}}>{s.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ───────── Social proof ─────────
function Testimonials() {
  const t = [
    {q:'I applied to 11 U.S. schools from Karachi. My school had no counselor who\'d even heard of the Common App. Kairos walked me through Matric → 4.0 conversion in an hour — and my Stanford supplement twice over.', name:'Ayesha R.', role:'Accepted — Stanford \'29', loc:'Karachi, Pakistan'},
    {q:'My parents speak Punjabi. They wanted to help but couldn\'t. I turned on voice mode and Kairos walked them through the CSS Profile in Punjabi while I translated the numbers. They cried. So did I.', name:'Jaskaran S.', role:'First-gen · Accepted UMich, UIUC', loc:'Brampton, Canada'},
    {q:'I had a list of 15 reaches and zero safety schools. Kairos didn\'t lecture me — it showed me three schools I\'d never heard of that meet 100% of need and were match-tier. I\'m graduating debt-free.', name:'Maya A.', role:'Accepted — Grinnell, full aid', loc:'Brooklyn, NY'},
  ];
  return (
    <section style={{background:'#0c1120',padding:'130px 80px',borderTop:'1px solid rgba(242,237,227,.08)',borderBottom:'1px solid rgba(242,237,227,.08)',position:'relative'}}>
      <div style={{maxWidth:1280,margin:'0 auto'}}>
        <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:60}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:22}}>
              <span style={{width:26,height:1,background:'#d4a84b'}}/>
              <span style={{color:'#d4a84b',letterSpacing:'.32em',fontSize:10.5,textTransform:'uppercase'}}>Student stories</span>
            </div>
            <h2 style={{fontFamily:'Cormorant Garamond',fontWeight:300,fontSize:56,lineHeight:1.05,color:'#f2ede3',margin:0,maxWidth:620,letterSpacing:'-.01em'}}>
              From the <em style={{color:'#d4a84b',fontStyle:'italic'}}>2025–26</em> cycle.
            </h2>
          </div>
          <div style={{fontFamily:'JetBrains Mono',fontSize:11,color:'rgba(242,237,227,.40)'}}>Verified on submission</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:2}}>
          {t.map((x,i)=>(
            <div key={i} style={{padding:'40px 34px',border:'1px solid rgba(242,237,227,.10)',background:'rgba(5,8,13,.4)',display:'flex',flexDirection:'column',gap:26,minHeight:380}}>
              <div style={{fontFamily:'Cormorant Garamond',fontStyle:'italic',fontWeight:300,fontSize:68,lineHeight:.4,color:'#d4a84b',height:20}}>&ldquo;</div>
              <p style={{fontFamily:'Cormorant Garamond',fontWeight:300,fontSize:19,lineHeight:1.45,color:'#f2ede3',margin:0,flex:1,fontStyle:'italic'}}>
                {x.q}
              </p>
              <div style={{borderTop:'1px solid rgba(242,237,227,.12)',paddingTop:18,display:'flex',alignItems:'center',gap:12}}>
                <div style={{width:34,height:34,borderRadius:999,background:'rgba(212,168,75,.20)',border:'1px solid rgba(212,168,75,.35)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:600,color:'#d4a84b',fontFamily:'DM Sans'}}>{x.name.split(' ').map(n=>n[0]).join('')}</div>
                <div>
                  <div style={{fontSize:12,color:'#f2ede3',fontWeight:500,fontFamily:'DM Sans'}}>{x.name}</div>
                  <div style={{fontSize:10.5,color:'rgba(242,237,227,.50)',fontFamily:'DM Sans',marginTop:2}}>{x.role} · {x.loc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* proof strip */}
        <div style={{marginTop:80,display:'grid',gridTemplateColumns:'repeat(4, 1fr)',gap:40,paddingTop:44,borderTop:'1px solid rgba(242,237,227,.10)'}}>
          {[['12,400+','Students served'],['$18.2M','Aid unlocked'],['40+','Languages'],['96%','Rec\'d they\'d return']].map(([n,l])=>(
            <div key={n}>
              <div style={{fontFamily:'Cormorant Garamond',fontWeight:300,fontSize:58,lineHeight:1,color:'#d4a84b',letterSpacing:'-.02em'}}>{n}</div>
              <div style={{fontSize:10.5,letterSpacing:'.26em',textTransform:'uppercase',color:'rgba(242,237,227,.55)',marginTop:10,fontFamily:'DM Sans'}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ───────── Pricing ─────────
function Pricing() {
  return (
    <section style={{background:'#05080d',padding:'130px 80px',position:'relative'}}>
      <div style={{maxWidth:1200,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:70}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:14,marginBottom:22}}>
            <span style={{width:26,height:1,background:'#d4a84b'}}/>
            <span style={{color:'#d4a84b',letterSpacing:'.32em',fontSize:10.5,textTransform:'uppercase'}}>Pricing</span>
            <span style={{width:26,height:1,background:'#d4a84b'}}/>
          </div>
          <h2 style={{fontFamily:'Cormorant Garamond',fontWeight:300,fontSize:64,lineHeight:1.02,color:'#f2ede3',margin:0,letterSpacing:'-.01em'}}>
            $10, or <em style={{color:'#d4a84b',fontStyle:'italic'}}>$8,000.</em>
          </h2>
          <p style={{fontSize:15,color:'rgba(242,237,227,.60)',marginTop:24,fontFamily:'DM Sans',fontWeight:300}}>
            The same counselor work — one costs a coffee, one costs a semester.
          </p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:2}}>
          {/* KairosLearn side */}
          <div style={{padding:'48px 44px',border:'1px solid rgba(212,168,75,.30)',background:'rgba(212,168,75,.06)',position:'relative'}}>
            <div style={{position:'absolute',top:-12,left:40,background:'#d4a84b',color:'#05080d',fontSize:9.5,letterSpacing:'.22em',textTransform:'uppercase',fontWeight:600,padding:'4px 12px',fontFamily:'DM Sans'}}>Recommended</div>
            <div style={{fontFamily:'Cormorant Garamond',fontWeight:400,fontSize:24,color:'#f2ede3',marginBottom:8}}><em style={{color:'#d4a84b',fontStyle:'italic'}}>Kairos</em>Learn</div>
            <div style={{display:'flex',alignItems:'baseline',gap:8,marginBottom:4}}>
              <div style={{fontFamily:'Cormorant Garamond',fontWeight:300,fontSize:96,lineHeight:1,color:'#f2ede3',letterSpacing:'-.02em'}}>$10</div>
              <div style={{fontSize:14,color:'rgba(242,237,227,.55)',fontFamily:'DM Sans'}}>/ month</div>
            </div>
            <div style={{fontSize:11.5,color:'rgba(242,237,227,.55)',fontFamily:'DM Sans'}}>or free for verified low-income & first-gen applicants</div>
            <div style={{height:1,background:'rgba(242,237,227,.12)',margin:'30px 0'}}/>
            <ul style={{listStyle:'none',padding:0,margin:0,display:'flex',flexDirection:'column',gap:14}}>
              {['Unlimited Coach Kairos — essays, schools, interviews','40+ languages, voice mode included','Full pipeline: intake → aid','Chancing, net-price, scholarship match','Always-on, 3 a.m. on a Saturday'].map(f => (
                <li key={f} style={{display:'flex',gap:12,alignItems:'flex-start',fontSize:13,color:'#f2ede3',fontFamily:'DM Sans',fontWeight:300,lineHeight:1.5}}>
                  <span style={{color:'#d4a84b',fontSize:14,marginTop:1}}>✓</span>{f}
                </li>
              ))}
            </ul>
            <button style={{marginTop:36,background:'#d4a84b',color:'#05080d',border:0,padding:'15px 28px',fontSize:11,letterSpacing:'.18em',textTransform:'uppercase',fontWeight:600,cursor:'pointer',fontFamily:'DM Sans',width:'100%'}}>Start for free →</button>
          </div>
          {/* Private counselor side */}
          <div style={{padding:'48px 44px',border:'1px solid rgba(242,237,227,.10)',background:'rgba(5,8,13,.5)',opacity:.78}}>
            <div style={{fontSize:12,color:'rgba(242,237,227,.55)',marginBottom:8,fontFamily:'DM Sans',letterSpacing:'.06em',textTransform:'uppercase'}}>Private counselor</div>
            <div style={{display:'flex',alignItems:'baseline',gap:8,marginBottom:4}}>
              <div style={{fontFamily:'Cormorant Garamond',fontWeight:300,fontSize:96,lineHeight:1,color:'rgba(242,237,227,.50)',letterSpacing:'-.02em',textDecoration:'line-through',textDecorationThickness:2}}>$8,000</div>
              <div style={{fontSize:14,color:'rgba(242,237,227,.45)',fontFamily:'DM Sans'}}>/ cycle</div>
            </div>
            <div style={{fontSize:11.5,color:'rgba(242,237,227,.45)',fontFamily:'DM Sans'}}>typical IEC package · $3k — $15k range</div>
            <div style={{height:1,background:'rgba(242,237,227,.08)',margin:'30px 0'}}/>
            <ul style={{listStyle:'none',padding:0,margin:0,display:'flex',flexDirection:'column',gap:14}}>
              {['One counselor, taking on 20+ students','English-only, school hours','Piecemeal — essays cost extra','Generic chancing spreadsheets','Unavailable nights, weekends, crisis moments'].map(f => (
                <li key={f} style={{display:'flex',gap:12,alignItems:'flex-start',fontSize:13,color:'rgba(242,237,227,.55)',fontFamily:'DM Sans',fontWeight:300,lineHeight:1.5}}>
                  <span style={{color:'rgba(242,237,227,.30)',fontSize:14,marginTop:1}}>—</span>{f}
                </li>
              ))}
            </ul>
            <button disabled style={{marginTop:36,background:'transparent',color:'rgba(242,237,227,.45)',border:'1px solid rgba(242,237,227,.15)',padding:'15px 28px',fontSize:11,letterSpacing:'.18em',textTransform:'uppercase',fontFamily:'DM Sans',width:'100%',cursor:'not-allowed'}}>Out of reach</button>
          </div>
        </div>
        <div style={{textAlign:'center',marginTop:36,fontSize:12,color:'rgba(242,237,227,.45)',fontFamily:'DM Sans',fontStyle:'italic'}}>
          Pricing based on 2024 IECA industry survey. We verify income via standard aid documentation.
        </div>
      </div>
      <Grain opacity={0.05}/>
    </section>
  );
}

// ───────── Final CTA ─────────
function FinalCTA() {
  return (
    <section style={{background:'#05080d',padding:'140px 80px 150px',borderTop:'1px solid rgba(242,237,227,.08)',textAlign:'center',position:'relative'}}>
      <span style={{color:'#d4a84b',letterSpacing:'.32em',fontSize:10.5,textTransform:'uppercase'}}>Your moment</span>
      <h2 style={{fontFamily:'Cormorant Garamond',fontWeight:300,fontSize:96,lineHeight:1,color:'#f2ede3',margin:'32px 0 32px',letterSpacing:'-.02em'}}>
        The right counselor<br/><em style={{color:'#d4a84b',fontStyle:'italic'}}>at the right moment.</em>
      </h2>
      <p style={{fontSize:15,lineHeight:1.75,color:'rgba(242,237,227,.55)',fontWeight:300,maxWidth:520,margin:'0 auto 44px',fontFamily:'DM Sans'}}>
        The 2026–27 cycle opens soon. Start your profile now — it takes five minutes, and the coach carries it forward.
      </p>
      <div style={{display:'flex',justifyContent:'center',gap:16}}>
        <button style={{background:'#d4a84b',color:'#05080d',border:0,padding:'18px 44px',fontSize:11,letterSpacing:'.18em',textTransform:'uppercase',fontWeight:600,cursor:'pointer',fontFamily:'DM Sans'}}>Start for free</button>
        <button style={{background:'transparent',color:'#f2ede3',border:'1px solid rgba(242,237,227,.28)',padding:'17px 32px',fontSize:11,letterSpacing:'.18em',textTransform:'uppercase',cursor:'pointer',fontFamily:'DM Sans'}}>Talk to the founder</button>
      </div>
      <Grain opacity={0.05}/>
    </section>
  );
}

// ───────── Footer ─────────
function Footer() {
  return (
    <footer style={{background:'#05080d',padding:'60px 80px 44px',borderTop:'1px solid rgba(242,237,227,.08)'}}>
      <div style={{maxWidth:1280,margin:'0 auto',display:'grid',gridTemplateColumns:'1.4fr 1fr 1fr 1fr',gap:40}}>
        <div>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
            <div style={{width:28,height:28,background:'#d4a84b',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Cormorant Garamond',fontStyle:'italic',fontWeight:500,color:'#05080d',fontSize:14}}>K</div>
            <span style={{fontFamily:'Cormorant Garamond',fontSize:17,color:'#f2ede3'}}><em style={{color:'#d4a84b',fontStyle:'italic'}}>Kairos</em>Learn</span>
          </div>
          <p style={{fontSize:12,color:'rgba(242,237,227,.50)',fontFamily:'DM Sans',lineHeight:1.7,fontWeight:300,maxWidth:300}}>
            Every student deserves a counselor who actually knows them. In any language, at any hour, with the full pipeline — for the price of a coffee.
          </p>
        </div>
        {[
          ['Product',['Coach Kairos','Essay Studio','School List','Interview Prep','Financial Aid']],
          ['Students',['First-gen','International','Pakistan','India','Language support']],
          ['Company',['About','Careers','Blog','Press','Contact']],
        ].map(([h,items])=>(
          <div key={h}>
            <div style={{fontSize:10,letterSpacing:'.26em',textTransform:'uppercase',color:'#d4a84b',marginBottom:16,fontFamily:'DM Sans'}}>{h}</div>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {items.map(i => <span key={i} style={{fontSize:12,color:'rgba(242,237,227,.65)',fontFamily:'DM Sans',fontWeight:300}}>{i}</span>)}
            </div>
          </div>
        ))}
      </div>
      <div style={{maxWidth:1280,margin:'50px auto 0',paddingTop:24,borderTop:'1px solid rgba(242,237,227,.08)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <span style={{fontFamily:'JetBrains Mono',fontSize:10,color:'rgba(242,237,227,.40)',letterSpacing:'.10em'}}>© 2026 KairosLearn · kairoslearn.com</span>
        <div style={{display:'flex',gap:20,fontSize:10.5,color:'rgba(242,237,227,.45)',fontFamily:'DM Sans',letterSpacing:'.06em'}}>
          <span>Privacy</span><span>Terms</span><span>Accessibility</span><span>kairos@kairoslearn.com</span>
        </div>
      </div>
    </footer>
  );
}

// ───────── Root ─────────
function Page() {
  return (
    <div className="kl-surface-landing" style={{width:1280,margin:'0 auto',background:'#05080d',color:'#f2ede3',fontFamily:'DM Sans',fontWeight:300}}>
      <Hero />
      <ForgottenStudent />
      <Pipeline />
      <Testimonials />
      <Pricing />
      <FinalCTA />
      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Page />);
