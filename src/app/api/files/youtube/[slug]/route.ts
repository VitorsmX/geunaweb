// app/api/youtube-upload/[slug]/route.ts

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;

  try {
    // Definir o caminho para o arquivo JSON que contém os vídeos, de acordo com o slug
    const filePath = path.join(process.cwd(), 'uploads', slug, 'videos.json');
    
    // Verificar se o arquivo de vídeos existe
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Arquivo de vídeos não encontrado' }, { status: 404 });
    }

    // Ler o conteúdo do arquivo JSON
    const fileData = fs.readFileSync(filePath, 'utf-8');
    const videoData = JSON.parse(fileData);

    // Verificar se o arquivo contém dados de vídeos
    if (!Array.isArray(videoData) || videoData.length === 0) {
      return NextResponse.json({ error: 'Nenhum vídeo encontrado para este slug' }, { status: 404 });
    }

    // Retornar os vídeos encontrados no arquivo JSON
    return NextResponse.json({ videos: videoData });
  } catch (error) {
    console.error('Erro ao ler dados do vídeo:', error);
    return NextResponse.json({ error: 'Erro ao carregar vídeos' }, { status: 500 });
  }
}
