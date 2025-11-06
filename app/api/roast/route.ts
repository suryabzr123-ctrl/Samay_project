import { kv } from '../../../lib/kv'
export const runtime = 'edge'
const KEY = 'roasts:v1'

export async function GET(){
  const list = await kv.lrange<{name?:string,text:string,ts:number}>(KEY, 0, -1)
  return new Response(JSON.stringify(list||[]),{ headers:{'content-type':'application/json'} })
}

export async function POST(req:Request){
  const { name, text } = await req.json()
  const clean = String(text||'').slice(0,140)
  if(!clean) return new Response('Bad request',{status:400})
  if(/(abuse|slur|hate)/i.test(clean)) return new Response('Nope',{status:400})
  const item = { name: String(name||'').slice(0,32), text: clean, ts: Date.now() }
  await kv.rpush(KEY, item)
  const list = await kv.lrange(KEY, 0, -1)
  return new Response(JSON.stringify(list||[]),{ headers:{'content-type':'application/json'} })
}

