import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import fs from "fs";
import path from "path";

// Configurar o Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Função para lidar com o upload
export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Caminho da pasta temporária
  const uploadsDir = path.join(process.cwd(), "uploads");

  // Verificar se a pasta existe, se não, criar
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }

  // Criar um caminho para o arquivo
  const tempPath = path.join(uploadsDir, file.name);

  // Criar um buffer para o arquivo
  const buffer = Buffer.from(await file.arrayBuffer());

  // Salvar o arquivo temporariamente
  fs.writeFileSync(tempPath, buffer);

  try {
    const result = await cloudinary.v2.uploader.upload(tempPath, {
      asset_folder: "geunaweb",
      resource_type: "auto"
    });
    // Remover o arquivo temporário
    fs.unlinkSync(tempPath);

    return NextResponse.json({
      secure_url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json({ error: "Upload to Cloudinary failed" }, { status: 500 });
  }
}
