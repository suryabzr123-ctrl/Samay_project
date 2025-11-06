const url = process.env.UPSTASH_REDIS_REST_URL!
const token = process.env.UPSTASH_REDIS_REST_TOKEN!

async function call<T=any>(cmd: string, args: any[]): Promise<T>{
  const res = await fetch(`${url}/${cmd}/${args.map(encodeURIComponent).join('/')}`,{
    headers:{ Authorization: `Bearer ${token}` }
  })
  if(!res.ok) throw new Error(`Upstash error: ${res.status}`)
  return res.json() as Promise<T>
}

export const kv = {
  async get<T=any>(key:string){
    const r = await call<{ result: string | null }>('get',[key])
    return r.result ? JSON.parse(r.result) as T : null
  },
  async set(key:string, val:any){
    return call('set',[key, JSON.stringify(val)])
  },
  async hincrby(key:string, field:string, inc:number){
    // read‑modify‑write (simple) — acceptable for demo traffic
    const curr = (await kv.get<Record<string,number>>(key)) || { a:0,b:0,c:0 }
    curr[field] = (curr[field]||0) + inc
    await kv.set(key, curr)
  },
  async rpush(key:string, val:any){
    const curr = (await kv.get<any[]>(key)) || []
    curr.push(val)
    await kv.set(key, curr)
  },
  async lrange<T=any>(key:string, start:number, stop:number){
    const curr = (await kv.get<T[]>(key)) || []
    return curr
  }
}
