// app/api/files/youtube/[slug]/route.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || ''; // Usar variável de ambiente do Supabase
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; // Use a chave de serviço (não exposta no front-end)
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: any, { params }: { params: any }) {
  const { slug } = params;

  try {
    const { data, error } = await supabase
      .from('youtube_videos')
      .select('url')
      .eq('slug', slug);

    if (error) {
      return new Response(JSON.stringify({ error: 'Falha ao buscar vídeos' }), { status: 500 });
    }

    return new Response(JSON.stringify({ videos: data }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro no servidor' }), { status: 500 });
  }
}
