import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabaseClient';

export async function POST(req: NextRequest) {
  const { url, slug } = await req.json();

  // Verificar se o slug foi fornecido
  if (!slug) {
    return NextResponse.json({ error: 'Slug não fornecido' }, { status: 400 });
  }

  try {
    // Inserir o vídeo no banco de dados Supabase
    const { data, error } = await supabase
      .from('youtube_videos')
      .insert([{ url, slug }]);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ message: 'Vídeo adicionado com sucesso!', video: data?.[0] }, { status: 200 });
  } catch (error) {
    console.error('Erro ao adicionar vídeo:', error);
    return NextResponse.json({ error: 'Falha ao adicionar o vídeo' }, { status: 500 });
  }
}
