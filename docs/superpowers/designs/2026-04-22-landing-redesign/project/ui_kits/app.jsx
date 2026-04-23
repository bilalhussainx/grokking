/* global React, lucide */
const { useState } = React;

const I = ({ name, size = 16, color = 'currentColor', stroke = 1.75, style = {} }) => {
  // Minimal inline Lucide set — only what the kit needs
  const paths = {
    GraduationCap: <><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></>,
    BookOpen: <><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></>,
    ListOrdered: <><path d="M10 12h11"/><path d="M10 18h11"/><path d="M10 6h11"/><path d="M4 10h2"/><path d="M4 6h1v4"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></>,
    Target: <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>,
    MessageCircle: <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>,
    Users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    Share2: <><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.59 13.51 6.83 3.98"/><path d="m15.41 6.51-6.82 3.98"/></>,
    ArrowRight: <><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></>,
    Sparkles: <><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z"/></>,
    Send: <><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></>,
    Search: <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></>,
    Clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    MapPin: <><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></>,
    Building: <><rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/></>,
    Mic: <><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></>,
    Plus: <><path d="M12 5v14M5 12h14"/></>,
    Check: <path d="M20 6 9 17l-5-5"/>,
    X: <><path d="M18 6 6 18M6 6l18 18"/></>,
    Pencil: <><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></>,
    Volume: <><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></>,
    Chevron: <path d="m9 18 6-6-6-6"/>,
    List: <><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>,
    File: <><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><polyline points="14 2 14 8 20 8"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={style}>
      {paths[name]}
    </svg>
  );
};

// ═══════════════ Sidebar ═══════════════
function Sidebar({ active }) {
  const items = [
    ['Dashboard','GraduationCap'],
    ['Essay Studio','BookOpen'],
    ['Activities','ListOrdered'],
    ['My Schools','Target'],
    ['Interview Prep','MessageCircle'],
    ['Recommenders','Users'],
    ['Share Link','Share2'],
  ];
  return (
    <aside style={{width:230,background:'#0a0a0a',borderRight:'1px solid rgba(255,255,255,.08)',padding:'22px 14px',display:'flex',flexDirection:'column',gap:24}}>
      <div style={{display:'flex',alignItems:'center',gap:10,padding:'0 6px'}}>
        <div style={{width:32,height:32,borderRadius:10,background:'#D4AF37',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Cormorant Garamond',fontWeight:500,fontStyle:'italic',color:'#000',fontSize:16}}>K</div>
        <div style={{fontFamily:'Cormorant Garamond',fontSize:17,color:'#f0ece2'}}><em style={{color:'#D4AF37',fontStyle:'italic'}}>Kairos</em>Learn</div>
      </div>
      <div>
        <div style={{fontSize:9.5,letterSpacing:'.18em',textTransform:'uppercase',color:'rgba(255,255,255,.35)',padding:'0 8px 10px'}}>Counselor</div>
        <div style={{display:'flex',flexDirection:'column',gap:2}}>
          {items.map(([name,icon])=>{
            const isActive = name === active;
            return (
              <div key={name} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 10px',borderRadius:10,background:isActive?'rgba(212,175,55,.10)':'transparent',border:`1px solid ${isActive?'rgba(212,175,55,.30)':'transparent'}`,color:isActive?'#D4AF37':'rgba(255,255,255,.75)',fontSize:13,fontWeight:isActive?600:400,cursor:'pointer'}}>
                <I name={icon} size={15} color={isActive?'#D4AF37':'rgba(255,255,255,.55)'}/>
                <span>{name}</span>
                {isActive && <span style={{marginLeft:'auto',width:5,height:5,borderRadius:999,background:'#D4AF37'}}/>}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{marginTop:'auto',padding:'12px 10px',borderRadius:12,background:'rgba(212,175,55,.06)',border:'1px solid rgba(212,175,55,.20)'}}>
        <div style={{fontSize:11,color:'rgba(255,255,255,.60)',marginBottom:4}}>On the free plan</div>
        <div style={{fontSize:12,color:'#D4AF37',fontWeight:500}}>Unlimited essays · always</div>
      </div>
    </aside>
  );
}

// ═══════════════ Topbar ═══════════════
function Topbar({ breadcrumb }) {
  return (
    <div style={{height:56,borderBottom:'1px solid rgba(255,255,255,.08)',padding:'0 24px',display:'flex',alignItems:'center',gap:14}}>
      <div style={{fontSize:12,color:'rgba(255,255,255,.50)'}}>College Counselor</div>
      <div style={{fontSize:12,color:'rgba(255,255,255,.30)'}}>/</div>
      <div style={{fontSize:12,color:'#fff',fontWeight:500}}>{breadcrumb}</div>
      <div style={{flex:1}}/>
      <div style={{fontSize:11,color:'rgba(255,255,255,.55)',display:'flex',alignItems:'center',gap:6,padding:'5px 10px',borderRadius:8,background:'rgba(255,255,255,.04)'}}>
        <span style={{width:6,height:6,borderRadius:999,background:'#34d399'}}/>Draft autosaved
      </div>
      <div style={{fontSize:11,color:'rgba(255,255,255,.50)',padding:'5px 10px',borderRadius:8,background:'rgba(255,255,255,.04)',display:'flex',alignItems:'center',gap:6}}>🇺🇸 English</div>
      <div style={{width:30,height:30,borderRadius:999,background:'rgba(212,175,55,.15)',border:'1px solid rgba(212,175,55,.30)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:600,color:'#D4AF37'}}>MA</div>
    </div>
  );
}

// ═══════════════ Dashboard ═══════════════
function ToolCard({ icon, title, sub, meta, cta, highlight }) {
  return (
    <div style={{background:'#141414',border:`1px solid ${highlight?'rgba(212,175,55,.30)':'rgba(255,255,255,.08)'}`,borderRadius:16,padding:18,display:'flex',flexDirection:'column',gap:12,cursor:'pointer',position:'relative'}}>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <div style={{width:40,height:40,borderRadius:12,background:'rgba(212,175,55,.10)',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <I name={icon} size={19} color="#D4AF37"/>
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:14,fontWeight:600,color:'#fff'}}>{title}</div>
          <div style={{fontSize:11.5,color:'rgba(255,255,255,.50)',marginTop:2}}>{sub}</div>
        </div>
        <I name="Chevron" size={14} color="rgba(255,255,255,.30)"/>
      </div>
      <div style={{borderTop:'1px solid rgba(255,255,255,.06)',paddingTop:10,fontFamily:'JetBrains Mono',fontSize:10.5,color:'rgba(255,255,255,.45)',display:'flex',justifyContent:'space-between'}}>
        <span>{meta}</span>
        {cta && <span style={{color:'#D4AF37'}}>{cta} →</span>}
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div style={{padding:'28px 32px',display:'flex',flexDirection:'column',gap:24}}>
      <div>
        <div style={{fontSize:10.5,letterSpacing:'.18em',textTransform:'uppercase',color:'rgba(255,255,255,.45)',marginBottom:8}}>Welcome back, Maya</div>
        <div style={{fontSize:28,fontWeight:700,color:'#fff',letterSpacing:'-.01em'}}>Your <em style={{fontFamily:'Cormorant Garamond',fontStyle:'italic',fontWeight:400,color:'#D4AF37'}}>application</em> toolkit.</div>
        <div style={{fontSize:13,color:'rgba(255,255,255,.55)',marginTop:6}}>Deadlines first — Yale EA in <span style={{color:'#fcd34d'}}>18 days</span>. Let's keep moving.</div>
      </div>

      {/* stats strip */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4, 1fr)',gap:12}}>
        {[
          ['Essays in progress','3','1 past due'],
          ['Schools on list','9','2 reach · 4 match · 3 safety'],
          ['Activities','8 / 10','2 slots open'],
          ['Recommenders','2 / 3','Ms. Alvarez pending'],
        ].map(([l,v,sub])=>(
          <div key={l} style={{background:'#141414',border:'1px solid rgba(255,255,255,.08)',borderRadius:12,padding:'14px 16px'}}>
            <div style={{fontSize:10,letterSpacing:'.10em',textTransform:'uppercase',color:'rgba(255,255,255,.40)',marginBottom:4}}>{l}</div>
            <div style={{fontFamily:'JetBrains Mono',fontSize:24,fontWeight:500,color:'#fff'}}>{v}</div>
            <div style={{fontSize:10.5,color:'rgba(255,255,255,.45)',marginTop:2}}>{sub}</div>
          </div>
        ))}
      </div>

      {/* tool cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(2, 1fr)',gap:12}}>
        <ToolCard icon="BookOpen" title="Essay Studio" sub="AI-guided essay writing — your words, your story" meta="3 essays · 642 / 1 950 words" cta="Continue drafting" highlight/>
        <ToolCard icon="Target" title="My Schools" sub="Search, track, and chance every school on your list" meta="9 schools · 6 reach / match / safety" cta="Rebalance"/>
        <ToolCard icon="ListOrdered" title="Activities Optimizer" sub="Edit bullets, get AI feedback, run full review" meta="8 activities · last review 2h ago" cta="Open"/>
        <ToolCard icon="MessageCircle" title="Interview Prep" sub="Practice with 10 Ivy+ alumni AI personas" meta="2 sessions · avg 82% fluency" cta="Start session"/>
        <ToolCard icon="Users" title="Recommenders" sub="Send the right packet, in the right order" meta="2 of 3 confirmed" cta="Nudge"/>
        <ToolCard icon="Share2" title="Counselor Share Link" sub="A read-only view for your school counselor" meta="Link active · 1 viewer" cta="Manage"/>
      </div>
    </div>
  );
}

// ═══════════════ Essay Studio (right-half preview) ═══════════════
function EssayStudio() {
  return (
    <div style={{background:'#0a0a0a',borderTop:'1px solid rgba(255,255,255,.06)',padding:'24px 32px'}}>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
        <div style={{fontSize:10.5,letterSpacing:'.18em',textTransform:'uppercase',color:'#D4AF37'}}>Now drafting</div>
        <span style={{padding:'2px 10px',borderRadius:999,fontSize:10.5,fontWeight:500,color:'#fcd34d',background:'rgba(245,158,11,.20)'}}>Draft</span>
        <span style={{marginLeft:'auto',fontFamily:'JetBrains Mono',fontSize:11,color:'rgba(255,255,255,.50)'}}>142 / 650 words</span>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 300px',gap:14}}>
        <div style={{background:'#141414',border:'1px solid rgba(255,255,255,.08)',borderRadius:14,padding:20}}>
          <div style={{fontSize:10,letterSpacing:'.10em',textTransform:'uppercase',color:'rgba(255,255,255,.40)',marginBottom:8}}>Personal Statement · Common App</div>
          <div style={{fontSize:14,fontWeight:600,color:'#fff',marginBottom:12}}>Describe a topic you find so engaging it makes you lose all track of time.</div>
          <div style={{fontSize:13,lineHeight:1.7,color:'rgba(255,255,255,.85)'}}>
            The first time I stayed up until 3 a.m. was for a <span style={{background:'rgba(212,175,55,.20)',color:'#fcd34d'}}>Python script</span> — not homework, not a game, a script I was writing to help my <em>abuela</em> read her medication labels. She'd ask me to translate them; I kept mis-hearing the dosage. So I built a camera app that said the lines back in Spanish.
            <span style={{display:'inline-block',width:8,height:15,background:'#D4AF37',marginLeft:2,verticalAlign:'-2px',animation:'b 1s infinite'}}/>
          </div>
          <div style={{marginTop:16,display:'flex',gap:8}}>
            <button style={{background:'#D4AF37',color:'#000',border:0,padding:'8px 14px',fontSize:12,fontWeight:600,borderRadius:10,cursor:'pointer',display:'flex',alignItems:'center',gap:6}}><I name="Sparkles" size={13}/>Run full review</button>
            <button style={{background:'rgba(212,175,55,.10)',color:'#D4AF37',border:'1px solid rgba(212,175,55,.30)',padding:'7px 12px',fontSize:12,borderRadius:10,cursor:'pointer'}}>Ask the coach</button>
            <button style={{background:'transparent',color:'rgba(255,255,255,.60)',border:'1px solid rgba(255,255,255,.10)',padding:'7px 12px',fontSize:12,borderRadius:10,cursor:'pointer'}}>Save draft</button>
          </div>
        </div>
        <div style={{background:'#141414',border:'1px solid rgba(255,255,255,.08)',borderRadius:14,padding:14}}>
          <div style={{fontSize:10,letterSpacing:'.10em',textTransform:'uppercase',color:'rgba(255,255,255,.40)',marginBottom:10}}>Outline</div>
          {[['Hook — abuela + mis-heard dosage',true],['Build — the Python script',true],['Turn — the first test-run',false],['Reflect — what mattered wasn\'t code',false]].map(([l,done])=>(
            <div key={l} style={{display:'flex',gap:8,alignItems:'flex-start',padding:'7px 0',borderTop:l.startsWith('Build')||l.startsWith('Turn')||l.startsWith('Reflect')?'1px solid rgba(255,255,255,.05)':'none'}}>
              <div style={{width:14,height:14,borderRadius:4,background:done?'#D4AF37':'transparent',border:`1px solid ${done?'#D4AF37':'rgba(255,255,255,.25)'}`,display:'flex',alignItems:'center',justifyContent:'center',marginTop:2,flexShrink:0}}>
                {done && <I name="Check" size={10} color="#000" stroke={3}/>}
              </div>
              <div style={{fontSize:11.5,color:done?'rgba(255,255,255,.55)':'#fff',textDecoration:done?'line-through':'none',lineHeight:1.5}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════ Coach Drawer ═══════════════
function CoachDrawer() {
  return (
    <aside style={{width:340,background:'#0a0a0a',borderLeft:'1px solid rgba(255,255,255,.08)',display:'flex',flexDirection:'column'}}>
      <div style={{padding:'16px 18px',borderBottom:'1px solid rgba(255,255,255,.06)',display:'flex',alignItems:'center',gap:10}}>
        <div style={{width:36,height:36,borderRadius:999,background:'rgba(212,175,55,.15)',border:'1px solid rgba(212,175,55,.30)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Cormorant Garamond',fontWeight:500,fontStyle:'italic',color:'#D4AF37',position:'relative'}}>K
          <span style={{position:'absolute',top:-2,right:-2,width:9,height:9,borderRadius:999,background:'#34d399',boxShadow:'0 0 8px #34d399'}}/>
        </div>
        <div>
          <div style={{fontSize:13,fontWeight:600,color:'#fff'}}>Coach Kairos</div>
          <div style={{fontSize:10.5,color:'#34d399'}}>Reading your draft</div>
        </div>
        <I name="Volume" size={14} color="rgba(255,255,255,.40)" style={{marginLeft:'auto'}}/>
      </div>
      <div style={{flex:1,padding:16,display:'flex',flexDirection:'column',gap:10,overflow:'hidden'}}>
        <div style={{display:'flex',gap:8,alignItems:'flex-start'}}>
          <div style={{width:24,height:24,borderRadius:999,background:'rgba(212,175,55,.15)',border:'1px solid rgba(212,175,55,.30)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:'#D4AF37',flexShrink:0}}>K</div>
          <div style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',borderRadius:12,borderTopLeftRadius:3,padding:'8px 12px',fontSize:12,color:'rgba(255,255,255,.90)',lineHeight:1.55}}>
            I'll read your draft as you write. Your hook landed — <em>abuela</em> + the 3 a.m. detail is specific and earns the rest of the essay.
          </div>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'flex-start',justifyContent:'flex-end'}}>
          <div style={{background:'rgba(212,175,55,.20)',border:'1px solid rgba(212,175,55,.30)',borderRadius:12,borderTopRightRadius:3,padding:'8px 12px',fontSize:12,color:'#f0ece2',lineHeight:1.55,maxWidth:220}}>Does para 2 ramble?</div>
          <div style={{width:24,height:24,borderRadius:999,background:'rgba(255,255,255,.10)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:600,color:'rgba(255,255,255,.70)',flexShrink:0}}>M</div>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'flex-start'}}>
          <div style={{width:24,height:24,borderRadius:999,background:'rgba(212,175,55,.15)',border:'1px solid rgba(212,175,55,.30)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:'#D4AF37',flexShrink:0,position:'relative'}}>K
            <span style={{position:'absolute',top:-2,right:-2,width:7,height:7,borderRadius:999,background:'#34d399',animation:'pul 1s infinite'}}/>
          </div>
          <div style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',borderRadius:12,borderTopLeftRadius:3,padding:'8px 12px',fontSize:12,color:'rgba(255,255,255,.90)',lineHeight:1.55}}>
            A touch. Line 2 ("I kept mis-hearing the dosage") is the pivot — the sentence before it can be tightened<span style={{display:'inline-block',width:6,height:12,background:'#D4AF37',verticalAlign:'-2px',animation:'b 1s infinite',marginLeft:2}}/>
          </div>
        </div>
        <div style={{marginTop:'auto',display:'flex',flexWrap:'wrap',gap:6}}>
          {['Tighten the opener','Show more of abuela','Check word count','Read aloud'].map(p=>(
            <button key={p} style={{background:'rgba(212,175,55,.08)',color:'#D4AF37',border:'1px solid rgba(212,175,55,.25)',borderRadius:999,padding:'4px 10px',fontSize:10.5,cursor:'pointer'}}>{p}</button>
          ))}
        </div>
      </div>
      <div style={{padding:12,borderTop:'1px solid rgba(255,255,255,.06)'}}>
        <div style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(212,175,55,.30)',borderRadius:12,padding:'8px 10px',display:'flex',alignItems:'center',gap:8}}>
          <I name="Mic" size={14} color="rgba(255,255,255,.50)"/>
          <input placeholder="Ask the coach..." style={{background:'transparent',border:0,color:'#fff',fontSize:12,flex:1,outline:'none',fontFamily:'Inter'}}/>
          <button style={{background:'#D4AF37',border:0,borderRadius:8,width:26,height:26,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
            <I name="Send" size={12} color="#000" stroke={2.5}/>
          </button>
        </div>
      </div>
    </aside>
  );
}

// ═══════════════ Full dashboard composition ═══════════════
function ProductApp() {
  return (
    <div className="kl-surface-app" style={{width:1320,background:'#000',color:'#f0ece2',display:'flex',fontFamily:'Inter'}}>
      <Sidebar active="Essay Studio"/>
      <div style={{flex:1,display:'flex',flexDirection:'column'}}>
        <Topbar breadcrumb="Essay Studio"/>
        <Dashboard />
        <EssayStudio />
      </div>
      <CoachDrawer />
      <style>{`@keyframes b {0%,49%{opacity:1}50%,100%{opacity:0}} @keyframes pul {0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.5);opacity:.3}}`}</style>
    </div>
  );
}

window.ProductApp = ProductApp;
