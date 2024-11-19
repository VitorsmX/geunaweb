// app/api/youtube-upload/route.ts

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Função para validar URL do YouTube
const isValidYoutubeUrl = (url: string) => {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)\/(watch\?v=|shorts\/)([a-zA-Z0-9_-]{11})/;
  return youtubeRegex.test(url);
};

// Caminho base para os arquivos .json
const uploadsDir = path.join(process.cwd(), 'uploads');

export async function POST(req: NextRequest) {
  // Extrair o slug da URL
  const url = new URL(req.url);
  const slug = url.searchParams.get('slug');

  // Extrair a URL do vídeo do corpo da requisição
  const { url: videoUrl } = await req.json();

  // Verificar se a URL do YouTube é válida
  if (!isValidYoutubeUrl(videoUrl)) {
    return NextResponse.json({ error: 'URL do YouTube inválida' }, { status: 400 });
  }

  // Verificar se o slug foi fornecido
  if (!slug) {
    return NextResponse.json({ error: 'Slug não fornecido' }, { status: 400 });
  }

  // Criar o diretório para o slug, caso não exista
  const slugDir = path.join(uploadsDir, slug);
  if (!fs.existsSync(slugDir)) {
    fs.mkdirSync(slugDir, { recursive: true });
  }

  // Caminho para o arquivo .json que armazenará os vídeos
  const jsonFilePath = path.join(slugDir, 'videos.json');

  try {
    // Carregar os vídeos existentes no arquivo .json, se houver
    let videos: { url: string; slug: string }[] = [];
    if (fs.existsSync(jsonFilePath)) {
      const fileData = fs.readFileSync(jsonFilePath, 'utf-8');
      videos = JSON.parse(fileData);
    }

    // Verificar se o vídeo já foi adicionado
    const isVideoExist = videos.some((video) => video.url === videoUrl);
    if (isVideoExist) {
      return NextResponse.json({ error: 'Este vídeo já foi adicionado.' }, { status: 400 });
    }

    // Adicionar o novo vídeo ao array
    videos.push({ url: videoUrl, slug });

    // Salvar ou atualizar o arquivo .json com os novos dados
    fs.writeFileSync(jsonFilePath, JSON.stringify(videos, null, 2));

    return NextResponse.json({ message: 'Vídeo adicionado com sucesso', secure_url: videoUrl }, { status: 200 });
  } catch (error) {
    console.error('Erro ao salvar vídeo:', error);
    return NextResponse.json({ error: 'Falha ao salvar o vídeo' }, { status: 500 });
  }
}
