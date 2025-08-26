'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Msg = {
  id:number; conversation_id:string; clinic_id:string;
  direction:'in'|'out'; sender:'user'|'bot'|'human';
  text:string|null; intent:string|null; created_at:string
}

export default function Inbox(){
  const [messages,setMessages]=useState<Msg[]>([])

  useEffect(()=>{
    // carga inicial
    supabase.from('messages')
      .select('id,conversation_id,clinic_id,direction,sender,text,intent,created_at')
      .order('created_at',{ascending:false}).limit(100)
      .then(({ data, error })=>{
        if(!error && data) setMessages(data as Msg[])
      })

    // realtime
    const ch = supabase.channel('msgs')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload:any)=>{
          setMessages(prev=> [payload.new as Msg, ...prev])
        }
      ).subscribe()

    return ()=> { supabase.removeChannel(ch) }
  },[])

  return (
    <main style={{ padding: 24 }}>
      <h1>Inbox</h1>
      <div style={{ display:'grid', gap:12 }}>
        {messages.map(m=>(
          <div key={m.id} style={{ border:'1px solid #ddd', borderRadius:8, padding:12 }}>
            <div style={{ fontSize:12, color:'#666' }}>
              {new Date(m.created_at).toLocaleString()} · conv {m.conversation_id} · {m.direction}/{m.sender} · {m.intent||'-'}
            </div>
            <div style={{ marginTop:6 }}>{m.text}</div>
          </div>
        ))}
      </div>
    </main>
  )
}

