/* global React */
const { useState, useEffect, useRef } = React;

function Grain() {
  return (
    <svg className="kl-grain" xmlns="http://www.w3.org/2000/svg"
      style={{position:'absolute',inset:'-50%',width:'200%',height:'200%',opacity:.10,zIndex:1000,pointerEvents:'none',mixBlendMode:'overlay'}}>
      <filter id="ng"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/></filter>
      <rect width="100%" height="100%" filter="url(#ng)"/>
    </svg>
  );
}

function NeuralCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const x = c.getContext('2d'); const W = c.width = c.offsetWidth; const H = c.height = c.offsetHeight;
    const N = 70;
    const pts = Array.from({length:N},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25}));
    let raf;
    function tick(){
      x.clearRect(0,0,W,H);
      for(const p of pts){ p.x+=p.vx; p.y+=p.vy; if(p.x<0||p.x>W)p.vx*=-1; if(p.y<0||p.y>H)p.vy*=-1; }
      for(let i=0;i<N;i++){ for(let j=i+1;j<N;j++){
        const a=pts[i],b=pts[j]; const dx=a.x-b.x,dy=a.y-b.y; const d=Math.sqrt(dx*dx+dy*dy);
        if(d<140){ x.strokeStyle=`rgba(212,168,75,${0.28*(1-d/140)})`; x.lineWidth=.6; x.beginPath(); x.moveTo(a.x,a.y); x.lineTo(b.x,b.y); x.stroke(); }
      }}
      for(const p of pts){ x.fillStyle='rgba(212,168,75,0.75)'; x.beginPath(); x.arc(p.x,p.y,1.4,0,Math.PI*2); x.fill(); }
      raf = requestAnimationFrame(tick);
    }
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%',zIndex:1}}/>;
}

function LandingNav() {
  return (
    <div style={{position:'absolute',top:24,left:40,right:40,zIndex:20,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 24px',background:'rgba(5,8,13,0.55)',backdropFilter:'blur(16px)',border:'1px solid rgba(242,237,227,.09)'}}>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <div style={{width:30,height:30,background:'#d4a84b',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Cormorant Garamond',fontStyle:'italic',fontWeight:500,color:'#05080d',fontSize:16}}>K</div>
        <div style={{fontFamily:'Cormorant Garamond',fontWeight:400,fontSize:18,color:'#f2ede3',letterSpacing:'.04em'}}>
          <em style={{color:'#d4a84b',fontStyle:'italic'}}>Kairos</em>Learn
        </div>
      </div>
      <div style={{display:'flex',gap:34,fontSize:11,letterSpacing:'.22em',textTransform:'uppercase',color:'rgba(242,237,227,.65)',fontWeight:400}}>
        <span>Counselor</span><span>Essays</span><span>Schools</span><span>Voice</span><span>Pricing</span>
      </div>
      <div style={{display:'flex',gap:14,alignItems:'center'}}>
        <span style={{fontSize:11,letterSpacing:'.22em',textTransform:'uppercase',color:'rgba(242,237,227,.60)'}}>Sign in</span>
        <button style={{background:'#f2ede3',color:'#05080d',border:0,padding:'10px 22px',fontSize:10.5,letterSpacing:'.16em',textTransform:'uppercase',fontWeight:500,cursor:'pointer'}}>Try free</button>
      </div>
    </div>
  );
}

function HeroCopy() {
  return (
    <div style={{position:'absolute',zIndex:10,inset:0,display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',padding:'0 80px',textAlign:'center'}}>
      <div style={{color:'#d4a84b',letterSpacing:'.32em',fontSize:10.5,textTransform:'uppercase',marginBottom:28,fontWeight:400}}>
        <span style={{display:'inline-block',width:30,height:1,background:'#d4a84b',verticalAlign:'middle',marginRight:14}}/>
        College counselor for everyone
        <span style={{display:'inline-block',width:30,height:1,background:'#d4a84b',verticalAlign:'middle',marginLeft:14}}/>
      </div>
      <h1 style={{fontFamily:'Cormorant Garamond',fontWeight:300,fontSize:112,lineHeight:.92,letterSpacing:'-.02em',margin:0,color:'#f2ede3'}}>
        Learn at the<br/><em style={{color:'#d4a84b',fontStyle:'italic'}}>Right Moment.</em>
      </h1>
      <p style={{fontSize:17,lineHeight:1.75,color:'rgba(242,237,227,.60)',fontWeight:300,marginTop:34,maxWidth:580}}>
        Your free AI college counselor — voice coaching, adaptive tutors, and structured support across <em style={{fontStyle:'italic',color:'#d4a84b'}}>40+ languages</em>. For first-gen students. In your language.
      </p>
      <div style={{marginTop:44,display:'flex',gap:16}}>
        <button style={{background:'#f2ede3',color:'#05080d',border:0,padding:'16px 34px',fontSize:11,letterSpacing:'.16em',textTransform:'uppercase',fontWeight:500,cursor:'pointer'}}>Begin — free</button>
        <button style={{background:'transparent',color:'#f2ede3',border:'1px solid rgba(242,237,227,.28)',padding:'15px 32px',fontSize:11,letterSpacing:'.16em',textTransform:'uppercase',cursor:'pointer'}}>See the vision</button>
      </div>
      <div style={{position:'absolute',bottom:32,left:0,right:0,display:'flex',flexDirection:'column',alignItems:'center',gap:10}}>
        <span style={{fontSize:9.5,letterSpacing:'.30em',textTransform:'uppercase',color:'rgba(242,237,227,.35)'}}>Scroll</span>
        <span style={{width:1,height:40,background:'linear-gradient(to bottom, rgba(242,237,227,.35), transparent)'}}/>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section style={{position:'relative',height:860,background:'#05080d',overflow:'hidden'}}>
      <NeuralCanvas />
      <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at center, transparent 0%, rgba(5,8,13,.85) 75%)',zIndex:2}}/>
      <div style={{position:'absolute',bottom:0,left:0,right:0,height:200,background:'linear-gradient(to bottom, transparent, #05080d)',zIndex:3}}/>
      <LandingNav />
      <HeroCopy />
      <Grain />
    </section>
  );
}

function ScrollSequence() {
  const steps = [
    { n:'01', k:'Timing', title:'Know when you\'re ready to learn.', copy:'Kairos senses the right moment — a concept mastered, a deadline approaching, a gap reopening — and acts on it.' },
    { n:'02', k:'Voice',  title:'Practice in your own words.',      copy:'A native-level voice coach that speaks back in 40+ languages. Real-time pronunciation, real conversations.' },
    { n:'03', k:'Path',   title:'Courses that evolve with you.',    copy:'149 interactive diagrams and lesson paths that reshape themselves to what you\'ve learned and where you\'re stuck.' },
  ];
  return (
    <section style={{background:'#05080d',padding:'120px 80px 110px',position:'relative'}}>
      <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:48}}>
        <span style={{width:30,height:1,background:'#d4a84b'}}/>
        <span style={{color:'#d4a84b',letterSpacing:'.32em',fontSize:10.5,textTransform:'uppercase'}}>The Kairos method</span>
      </div>
      <h2 style={{fontFamily:'Cormorant Garamond',fontWeight:300,fontSize:56,lineHeight:1.1,color:'#f2ede3',margin:0,maxWidth:820}}>
        Three motions, one <em style={{color:'#d4a84b',fontStyle:'italic'}}>counselor.</em>
      </h2>
      <div style={{marginTop:76,display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:2}}>
        {steps.map(s => (
          <div key={s.n} style={{padding:'44px 36px',border:'1px solid rgba(242,237,227,.09)',background:'rgba(212,168,75,.04)',minHeight:320,display:'flex',flexDirection:'column'}}>
            <div style={{display:'flex',alignItems:'center',gap:18,marginBottom:34}}>
              <span style={{fontFamily:'JetBrains Mono',fontSize:11,color:'rgba(242,237,227,.40)',letterSpacing:'.10em'}}>{s.n}</span>
              <span style={{flex:1,height:1,background:'rgba(242,237,227,.18)'}}/>
              <span style={{color:'#d4a84b',fontSize:10.5,letterSpacing:'.32em',textTransform:'uppercase',fontWeight:400}}>{s.k}</span>
            </div>
            <h3 style={{fontFamily:'Cormorant Garamond',fontWeight:300,fontSize:30,lineHeight:1.15,color:'#f2ede3',margin:0,marginBottom:18}}>
              {s.title.split(' ').map((w, i, a) => {
                const em = (s.n === '01' && w === 'ready') || (s.n === '02' && w === 'words.') || (s.n === '03' && w === 'evolve');
                return em ? <em key={i} style={{color:'#d4a84b',fontStyle:'italic'}}>{w} </em> : <span key={i}>{w} </span>;
              })}
            </h3>
            <p style={{fontSize:13,lineHeight:1.85,color:'rgba(242,237,227,.60)',fontWeight:300,margin:0}}>{s.copy}</p>
          </div>
        ))}
      </div>
      <Grain />
    </section>
  );
}

function Features() {
  const rows = [
    ['◎','College counselor',   'A single coach who follows you from Common App intake through interview day — no switching tools.'],
    ['⟡','Essay studio',        'Brainstorm → outline → draft → revise. The coach reads as you type and offers specific, paragraph-level feedback.'],
    ['◈','Voice coaching',      'Practice interviews with Ivy+ alumni personas. 40+ languages. Real-time pronunciation.'],
    ['◐','School list',         'Chancing in seconds with Reach, Match, Safety bands. Your list, balanced by the numbers.'],
    ['⬡','Activities optimizer','Tighten bullets to the Common App limit. Grounded in what you\'ve actually done.'],
    ['◆','Recommender manager', 'Send the right packet, in the right order. Quiet reminders so nothing drops.'],
  ];
  return (
    <section style={{background:'#05080d',padding:'40px 80px 120px',position:'relative'}}>
      <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:48}}>
        <div>
          <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:20}}>
            <span style={{width:30,height:1,background:'#d4a84b'}}/>
            <span style={{color:'#d4a84b',letterSpacing:'.32em',fontSize:10.5,textTransform:'uppercase'}}>Platform features</span>
          </div>
          <h2 style={{fontFamily:'Cormorant Garamond',fontWeight:300,fontSize:56,lineHeight:1.1,color:'#f2ede3',margin:0,maxWidth:640}}>
            Everything you need to <em style={{color:'#d4a84b',fontStyle:'italic'}}>apply</em> — with dignity.
          </h2>
        </div>
        <span style={{fontFamily:'JetBrains Mono',fontSize:11,color:'rgba(242,237,227,.35)',letterSpacing:'.10em'}}>06 · features</span>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:1.5}}>
        {rows.map(([g,t,c],i)=>(
          <div key={i} style={{padding:'36px 32px',border:'1px solid rgba(242,237,227,.09)',background:i===0?'rgba(212,168,75,.07)':'transparent',minHeight:250,display:'flex',flexDirection:'column'}}>
            <div style={{width:42,height:42,border:'1px solid rgba(212,168,75,.40)',display:'flex',alignItems:'center',justifyContent:'center',color:'#d4a84b',fontSize:18,marginBottom:26}}>{g}</div>
            <h3 style={{fontFamily:'Cormorant Garamond',fontWeight:300,fontSize:26,lineHeight:1.15,color:'#f2ede3',margin:0,marginBottom:14}}>{t}</h3>
            <p style={{fontSize:13,lineHeight:1.85,color:'rgba(242,237,227,.60)',fontWeight:300,margin:0}}>{c}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Stats() {
  const nums = [['40+','languages supported'],['10','Ivy+ alumni personas'],['149','interactive diagrams'],['96%','completion rate']];
  return (
    <section style={{background:'#0c1120',padding:'90px 80px',borderTop:'1px solid rgba(242,237,227,.09)',borderBottom:'1px solid rgba(242,237,227,.09)'}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4, 1fr)',gap:40}}>
        {nums.map(([n,l])=>(
          <div key={n}>
            <div style={{fontFamily:'Cormorant Garamond',fontWeight:300,fontSize:72,lineHeight:1,color:'#d4a84b',letterSpacing:'-.02em'}}>{n}</div>
            <div style={{fontSize:10.5,letterSpacing:'.26em',textTransform:'uppercase',color:'rgba(242,237,227,.55)',marginTop:10}}>{l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section style={{background:'#05080d',padding:'120px 80px',textAlign:'center',position:'relative'}}>
      <span style={{color:'#d4a84b',letterSpacing:'.32em',fontSize:10.5,textTransform:'uppercase'}}>Your moment</span>
      <h2 style={{fontFamily:'Cormorant Garamond',fontWeight:300,fontSize:92,lineHeight:1,color:'#f2ede3',margin:'28px 0 28px',letterSpacing:'-.02em'}}>
        Your most important<br/><em style={{color:'#d4a84b',fontStyle:'italic'}}>lesson</em> is waiting.
      </h2>
      <p style={{fontSize:15,lineHeight:1.75,color:'rgba(242,237,227,.55)',fontWeight:300,maxWidth:520,margin:'0 auto 40px'}}>
        Free for first-gen. No credit card. In the language you think in.
      </p>
      <div style={{display:'flex',justifyContent:'center',gap:16}}>
        <button style={{background:'#d4a84b',color:'#05080d',border:0,padding:'17px 44px',fontSize:11,letterSpacing:'.16em',textTransform:'uppercase',fontWeight:500,cursor:'pointer'}}>Start with Coach Kairos</button>
        <button style={{background:'transparent',color:'#f2ede3',border:'1px solid rgba(242,237,227,.28)',padding:'16px 32px',fontSize:11,letterSpacing:'.16em',textTransform:'uppercase',cursor:'pointer'}}>Talk to the founder</button>
      </div>
      <Grain />
    </section>
  );
}

function LandingFooter() {
  return (
    <footer style={{background:'#05080d',padding:'50px 80px 40px',borderTop:'1px solid rgba(242,237,227,.09)',display:'flex',justifyContent:'space-between',alignItems:'center',color:'rgba(242,237,227,.40)',fontSize:11}}>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <div style={{width:24,height:24,background:'#d4a84b',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Cormorant Garamond',fontStyle:'italic',color:'#05080d',fontSize:13}}>K</div>
        <span style={{fontFamily:'Cormorant Garamond',fontSize:15,color:'rgba(242,237,227,.70)'}}><em style={{color:'#d4a84b',fontStyle:'italic'}}>Kairos</em>Learn</span>
      </div>
      <div style={{display:'flex',gap:30,letterSpacing:'.22em',textTransform:'uppercase',fontSize:10}}>
        <span>About</span><span>Counselor</span><span>Pricing</span><span>Careers</span><span>Contact</span>
      </div>
      <span style={{fontFamily:'JetBrains Mono',fontSize:10,letterSpacing:'.10em'}}>© 2026 · kairoslearn.com</span>
    </footer>
  );
}

function Landing() {
  return (
    <div className="kl-surface-landing" style={{width:1280,background:'#05080d'}}>
      <Hero />
      <ScrollSequence />
      <Features />
      <Stats />
      <CTA />
      <LandingFooter />
    </div>
  );
}

window.Landing = Landing;
