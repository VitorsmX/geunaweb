import { NextRequest, NextResponse } from "next/server";
import cloudinary from "cloudinary";

// Configurar o Cloudinary (utilizando variáveis de ambiente)
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Função para gerar a assinatura de upload
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "No slug provided" }, { status: 400 });
  }

  try {
    const timestamp = Math.floor(Date.now() / 1000); // Timestamp para garantir a validade da assinatura

    // Definir o diretório de upload
    const uploadFolder = `geunaweb/${slug}`;

    // Gerar a assinatura de upload do Cloudinary
    const signatureParams = {
      folder: uploadFolder,
      timestamp: timestamp,
    };

    const apiSecret = process.env.CLOUDINARY_API_SECRET || ''

    const signature = cloudinary.v2.utils.api_sign_request(signatureParams, apiSecret);

    // Retornar os dados necessários para o frontend (signature, timestamp, etc.)
    return NextResponse.json({
      signature,
      timestamp,
      upload_preset: "ml_default", // Se você estiver usando um "upload preset"
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      folder: uploadFolder,
    });
  } catch (error) {
    console.error("Error generating upload signature:", error);
    return NextResponse.json({ error: "Erro ao gerar a assinatura do upload" }, { status: 500 });
  }
}
