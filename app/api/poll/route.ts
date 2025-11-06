import { kv } from '../../../lib/kv'
export const runtime = 'edge'
const KEY = 'poll:v1'

export async function GET(){
  const data = await kv.get<Record<string,number>>(KEY)
  return new Response(JSON.stringify(data || { a:0, b:0, c:0 }),{ headers:{'content-type':'application/json'} })
}

export async function POST(req:Request){
  const { id } = await req.json()
  if(!['a','b','c'].includes(id)) return new Response('Bad request',{status:400})
  // atomic increment via script
  await kv.hincrby(KEY, id, 1)
  const data = await kv.get<Record<string,number>>(KEY)
  return new Response(JSON.stringify(data || { a:0, b:0, c:0 }),{ headers:{'content-type':'application/json'} })
}
