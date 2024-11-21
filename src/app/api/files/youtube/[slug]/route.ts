import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabaseClient';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;

  console.log(slug)

  try {
    // Buscar todas as URLs de vídeos do YouTube para o slug específico
    const { data, error } = await supabase
      .from('youtube_videos')
      .select('url')
      .eq('slug', slug);

      console.log(data)
      console.log(error)

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ videos: data }, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar vídeos:', error);
    return NextResponse.json({ error: 'Falha ao buscar vídeos' }, { status: 500 });
  }
}
