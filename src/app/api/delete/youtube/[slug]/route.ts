// api/delete/youtube/[slug]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;

  // Obter o identificador (URL ou public_id) do vídeo a partir do corpo da requisição
  const { url } = await req.json();

  // Verificar se o identificador (URL) foi fornecido
  if (!url) {
    return NextResponse.json({ error: 'URL do vídeo não fornecida' }, { status: 400 });
  }

  try {
    // Definir o caminho do arquivo JSON do slug
    const filePath = path.join(process.cwd(), 'uploads', slug, 'videos.json');
    
    // Verificar se o arquivo JSON do slug existe
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Arquivo de vídeos não encontrado' }, { status: 404 });
    }

    // Ler o conteúdo do arquivo JSON
    const fileData = fs.readFileSync(filePath, 'utf-8');
    const videos = JSON.parse(fileData);

    // Procurar o índice do vídeo que será deletado
    const videoIndex = videos.findIndex((video: { url: string }) => video.url === url);

    // Se o vídeo não for encontrado, retornar erro
    if (videoIndex === -1) {
      return NextResponse.json({ error: 'Vídeo não encontrado' }, { status: 404 });
    }

    // Remover o vídeo do array
    videos.splice(videoIndex, 1);

    // Sobrescrever o arquivo JSON com a lista de vídeos atualizada
    fs.writeFileSync(filePath, JSON.stringify(videos, null, 2));

    return NextResponse.json({ message: 'Vídeo deletado com sucesso' }, { status: 200 });
  } catch (error) {
    console.error('Erro ao deletar vídeo:', error);
    return NextResponse.json({ error: 'Erro ao deletar o vídeo' }, { status: 500 });
  }
}
