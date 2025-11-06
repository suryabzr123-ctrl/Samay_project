'use client'
import './globals.css'
import { useEffect, useMemo, useState } from 'react'

export default function Page(){
  const [online,setOnline]=useState('--')
  const [hourPeak]=useState('50k')
  const [dayPeak]=useState('10L+')
  const [poll,setPoll]=useState<{ [k:string]: number }|null>(null)
  const [roasts,setRoasts]=useState<Array<{name?:string,text:string,ts:number}>>([])
  const [move,setMove]=useState('')
  const [toast,setToast]=useState<string|null>(null)

  const options = useMemo(()=>[
    { id:'a', text:'“Thoda chess, thoda mess.”' },
    { id:'b', text:'“Mic on, logic off.”' },
    { id:'c', text:'“Chat ke bina life kya?”' }
  ],[])

  useEffect(()=>{
    const i=setInterval(()=>{
      const base=250+Math.floor(Math.random()*200);
      const jitter=Math.floor(Math.random()*100)-50; setOnline((base+jitter).toLocaleString())
    },3500); return ()=>clearInterval(i)
  },[])

  useEffect(()=>{ fetch('/api/poll').then(r=>r.json()).then(setPoll).catch(()=>{}) },[])
  useEffect(()=>{ fetch('/api/roast').then(r=>r.json()).then(setRoasts).catch(()=>{}) },[])

  function vote(id:string){
    fetch('/api/poll',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})})
      .then(r=>r.json()).then(setPoll).catch(()=>{})
  }
  function postRoast(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault()
    const fd=new FormData(e.currentTarget)
    const name=(fd.get('name') as string||'').trim()
    const text=(fd.get('roast') as string||'').trim()
    if(!text) return setToast('Write something first!')
    if(/(abuse|slur|hate)/i.test(text)) return setToast('Keep it clean ✋')
    fetch('/api/roast',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,text})})
      .then(r=>r.json()).then(setRoasts).then(()=>setToast('Roast posted')).catch(()=>{})
    e.currentTarget.reset()
  }
  function checkMove(){
    const mv=move.trim().toLowerCase()
    const ok=['qxg7#','q x g7#','q x g7 #','q×g7#']
    setToast(ok.includes(mv)?'Correct! Mate in 1.':'Not quite. Try Qxg7#')
  }

  return (
    <div className="wrap">
      <header>
        <div className="logo">
          <div className="dot" aria-hidden></div>
          <strong>Samay Raina</strong>
          <span className="tag"><span className="live" aria-hidden></span> LIVE VIBES</span>
        </div>
        <div className="pill"><strong>{online}</strong>&nbsp;online now</div>
      </header>

      <section className="hero">
        <div className="card">
          <h1>Outclass Challenge 🚀<br/>Samay ke saath, <em>hatke</em>.</h1>
          <p>Vote on one‑liners, drop a clean roast, solve a mini‑puzzle. Built for spikes with Edge + serverless data.</p>
          <div className="cta">
            <button className="btn primary" onClick={()=>{navigator.clipboard.writeText(location.href); setToast('Link copied!')}}>Share the link</button>
            <button className="btn ghost" onClick={()=>{document.body.style.background='radial-gradient(1200px 600px at 20% -20%, #2a1f50aa 0%, #0b0b10 60%), #0b0b10'; setToast('♟️ Qxg7#')}}>Secret move</button>
          </div>
          <div className="kpis">
            <div className="kpi"><div className="v">{hourPeak}</div><div className="l">Peak / hour</div></div>
            <div className="kpi"><div className="v">{dayPeak}</div><div className="l">Peak / day</div></div>
            <div className="kpi"><div className="v">{roasts?.length||0}</div><div className="l">Roasts saved</div></div>
          </div>
        </div>

        <div className="card">
          <h2>Stack (low‑code)</h2>
          <p className="hint">Next.js on Vercel (Edge), Upstash Redis for data, optional Plausible for analytics.</p>
          <div className="stack">
            <div>
              <strong>Infra</strong>
              <div>
                <span className="chip">Vercel + CDN</span>
                <span className="chip">Edge functions</span>
                <span className="chip">Static + ISR</span>
              </div>
            </div>
            <div>
              <strong>Data</strong>
              <div>
                <span className="chip">Upstash Redis</span>
                <span className="chip">Rate limit (basic)</span>
                <span className="chip">JSON lists</span>
              </div>
            </div>
            <div>
              <strong>Add‑ons</strong>
              <div>
                <span className="chip">Plausible</span>
                <span className="chip">CF Turnstile</span>
                <span className="chip">Tally embed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid" aria-label="Interactive widgets">
        <div className="card poll">
          <h2>Vote: Best "Samay Says" line</h2>
          <ul>
            {options.map(o=>{
              const sum = poll ? Object.values(poll).reduce((a,b)=>a+b,0) : 1
              const count = poll?.[o.id] || 0
              const pct = Math.round(100*(count/sum))
              return (
                <li key={o.id}>
                  <span>{o.text}</span>
                  <div style={{flex:1, margin: '0 10px'}}><div className="bar" style={{ width: pct+'%' }}></div></div>
                  <button className="btn ghost" onClick={()=>vote(o.id)}>Vote</button>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="card">
          <h2>Roast (nicely) 🔥</h2>
          <form onSubmit={postRoast}>
            <input name="name" placeholder="Name (optional)" style={{width:'100%',padding:'12px',borderRadius:'12px',border:'1px solid #2a2a3d',background:'#0f0f1a',color:'#e6e6f0'}} />
            <textarea name="roast" placeholder="Your clean roast…" maxLength={140} style={{marginTop:8,width:'100%',height:76,padding:12,borderRadius:12,border:'1px solid #2a2a3d',background:'#0f0f1a',color:'#e6e6f0'}} />
            <div style={{display:'flex',gap:10,alignItems:'center',marginTop:8}}>
              <button className="btn primary" type="submit">Post</button>
              <span className="hint">Max 140 chars.</span>
            </div>
          </form>
          <div className="roast-list" aria-live="polite">
            {[...(roasts||[])].slice().reverse().map((r,i)=> (
              <div key={i} className="roast-item">
                <strong>{r.name||'Anon'}</strong><br/>
                <span className="muted">{new Date(r.ts).toLocaleString()}</span><br/>
                {r.text}
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2>Mini Chess Puzzle ♟️</h2>
          <p className="muted">Mate in 1 (White to move): What’s the move?</p>
          <div style={{display:'flex',gap:10,alignItems:'center',flexWrap:'wrap'}}>
            <input value={move} onChange={e=>setMove(e.target.value)} placeholder="ex: Qxg7#" style={{flex:1,minWidth:160,padding:12,borderRadius:12,border:'1px solid #2a2a3d',background:'#0f0f1a',color:'#e6e6f0'}}/>
            <button className="btn ghost" onClick={checkMove}>Check</button>
          </div>
        </div>
      </section>

      <section className="card" style={{marginTop:18}}>
        <h2>Schedule & Countdown ⏳</h2>
        <p className="muted">Fake demo countdown for the next bit drop.</p>
        <Countdown />
      </section>

      <footer>Made with ❤️ for the Outclass Challenge. Edge‑ready and spike‑proof.</footer>

      {toast && (<div className="toast" role="status" aria-live="polite" onAnimationEnd={()=>setToast(null)} style={{display:'block'}}>{toast}</div>)}
    </div>
  )
}

function Countdown(){
  const [t,setT]=useState({d:0,h:0,m:0,s:0})
  useEffect(()=>{
    function nextHour(){ const d=new Date(); d.setMinutes(60,0,0); return d }
    function tick(){ const now=new Date(); const end=nextHour(); const diff=end.getTime()-now.getTime(); const sec=Math.max(0,Math.floor(diff/1000)); setT({ d:Math.floor(sec/86400), h:Math.floor((sec%86400)/3600), m:Math.floor((sec%3600)/60), s:sec%60 }) }
    tick(); const i=setInterval(tick,1000); return ()=>clearInterval(i)
  },[])
  return (
    <div style={{display:'flex',gap:18,flexWrap:'wrap'}}>
      {['d','h','m','s'].map((k)=> (
        <div className="kpi" key={k}><div className="v">{(t as any)[k]}</div><div className="l">{{d:'Days',h:'Hours',m:'Minutes',s:'Seconds'}[k as 'd'|'h'|'m'|'s']}</div></div>
      ))}
    </div>
  )
}
