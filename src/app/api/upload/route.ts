import { NextRequest, NextResponse } from "next/server";
import cloudinary from "cloudinary";

// Configuração do Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "No slug provided" }, { status: 400 });
  }

  try {
    // Gerar URL de upload direto para o Cloudinary
    const uploadUrl = cloudinary.v2.utils.api_sign_request(
      {
        upload_preset: 'ml_default',  // Preset de upload
        folder: `geunaweb/${slug}`,   // Definindo a pasta no Cloudinary para o slug
      },
      process.env.CLOUDINARY_API_SECRET || ''
    );

    return NextResponse.json(uploadUrl);

  } catch (error) {
    console.error("Error generating upload URL:", error);
    return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
  }
}
