import { supabase } from '@/libs/supabase/client'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data, error } = await supabase.from('assembly_data').select('data').eq('id', id).single()

  if (error || !data) {
    return new Response('Not found', { status: 404 })
  }

  return new Response(JSON.stringify(data.data), {
    headers: { 'Content-Type': 'application/json' }
  })
}
