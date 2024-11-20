import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabaseClient';

// Função para validar URL do YouTube
const isValidYoutubeUrl = (url: string) => {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)\/(watch\?v=|shorts\/)([a-zA-Z0-9_-]{11})/;
  return youtubeRegex.test(url);
};

export async function POST(req: NextRequest) {
  const { url, slug } = await req.json();

  // Verificar se a URL do YouTube é válida
  if (!isValidYoutubeUrl(url)) {
    return NextResponse.json({ error: 'URL do YouTube inválida' }, { status: 400 });
  }

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

    return NextResponse.json({ message: 'Vídeo adicionado com sucesso!', video: data[0] }, { status: 200 });
  } catch (error) {
    console.error('Erro ao adicionar vídeo:', error);
    return NextResponse.json({ error: 'Falha ao adicionar o vídeo' }, { status: 500 });
  }
}
