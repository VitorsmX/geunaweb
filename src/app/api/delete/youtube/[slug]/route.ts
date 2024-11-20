import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabaseClient';

export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;
  const { url } = await req.json();

  if (!url) {
    return NextResponse.json({ error: 'URL não fornecida' }, { status: 400 });
  }

  try {
    // Deletar o vídeo do banco de dados do Supabase
    const { data, error } = await supabase
      .from('youtube_videos')
      .delete()
      .eq('slug', slug)
      .eq('url', url);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ message: 'Vídeo deletado com sucesso', video: data }, { status: 200 });
  } catch (error) {
    console.error('Erro ao deletar vídeo:', error);
    return NextResponse.json({ error: 'Falha ao deletar o vídeo' }, { status: 500 });
  }
}
