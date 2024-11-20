import { NextRequest, NextResponse } from "next/server";
import cloudinary from "cloudinary";

// Configurar o Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Endpoint para gerar a URL de upload do Cloudinary
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "No slug provided" }, { status: 400 });
  }

  try {
    // Gerar uma URL de upload usando o Cloudinary
    const uploadUrl = cloudinary.v2.uploader.upload_url({
      folder: `geunaweb/${slug}`, // A pasta onde os arquivos serão salvos
      resource_type: 'auto', // Detecta automaticamente o tipo de mídia
    });

    if (!uploadUrl) {
      throw new Error("Erro ao gerar URL de upload");
    }

    return NextResponse.json({ upload_url: uploadUrl });
  } catch (error) {
    console.error("Error generating upload URL:", error);
    return NextResponse.json({ error: "Erro ao gerar URL de upload" }, { status: 500 });
  }
}
