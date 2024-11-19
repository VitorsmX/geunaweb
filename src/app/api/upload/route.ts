import { NextRequest, NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { Outstatic } from 'outstatic';
import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import os from 'os';

// Configurar o Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Função para comprimir vídeo
const compressVideo = (inputPath: string, outputPath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .output(outputPath)
      .outputOptions('-vcodec libx264') // Usar o codec H.264 para compressão
      .outputOptions('-crf 28')         // Controlar a qualidade (quanto maior, menor a qualidade)
      .outputOptions('-preset fast')    // Ajustar a velocidade de compressão
      .on('end', resolve as any)
      .on('error', reject)
      .run();
  });
};

// Função para salvar arquivos temporários
const saveTempFile = (buffer: Buffer, extension: string): string => {
  const tempFilePath = path.join(os.tmpdir(), `${Date.now()}${extension}`);
  fs.writeFileSync(tempFilePath, buffer);
  return tempFilePath;
};

// Função para lidar com o upload
export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");
  const formData = await req.formData();
  const fileEntry = formData.get("file");
  const ostData = Outstatic();
  const session = await ostData.then((data) => data.session);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  if (!fileEntry || !(fileEntry instanceof File)) {
    return NextResponse.json({ error: "No valid file provided" }, { status: 400 });
  }

  if (!slug) {
    return NextResponse.json({ error: "No slug provided" }, { status: 400 });
  }

  const buffer = Buffer.from(await fileEntry.arrayBuffer());

  try {
    // Detectar o tipo de arquivo
    const mimeType = fileEntry.type;
    let tempFilePath = saveTempFile(buffer, mimeType.startsWith('video/') ? '.mp4' : '.jpg');
    let finalBuffer: Buffer | null = null;

    // Se for vídeo, comprime antes de fazer upload
    if (mimeType.startsWith('video/')) {
      const compressedFilePath = path.join(os.tmpdir(), `${Date.now()}-compressed.mp4`);
      await compressVideo(tempFilePath, compressedFilePath);
      finalBuffer = fs.readFileSync(compressedFilePath);
      fs.unlinkSync(compressedFilePath); // Limpar arquivo temporário
    } else {
      finalBuffer = fs.readFileSync(tempFilePath); // Para imagens, usaremos o arquivo sem compressão
    }

    fs.unlinkSync(tempFilePath); // Limpar arquivo temporário

    // Realizar o upload para o Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream({
        folder: `geunaweb/${slug}`,
        resource_type: mimeType.startsWith('video/') ? 'video' : 'image',
      }, (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(error);
        }
        resolve(result);
      });

      stream.end(finalBuffer);
    });

    return NextResponse.json({
      secure_url: (result as any).secure_url,
      public_id: (result as any).public_id,
    });

  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json({ error: "Upload to Cloudinary failed" }, { status: 500 });
  }
}
