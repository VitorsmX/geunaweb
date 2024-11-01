import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

// Configurar o Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Função para lidar com o upload
export async function POST(req) {
  const url = new URL(req.url);
  
  // Obter o parâmetro "slug"
  const slug = url.searchParams.get("slug");
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!slug) {
    return NextResponse.json({ error: "No slug provided" }, { status: 400 });
  }

  // Criar um buffer para o arquivo
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const result = await cloudinary.v2.uploader.upload_stream({
      folder: `geunaweb/${slug}`,
      resource_type: "auto",
    }, (error, result) => {
      if (error) {
        console.error("Cloudinary upload error:", error);
        return NextResponse.json({ error: "Upload to Cloudinary failed" }, { status: 500 });
      }
      // Retornar a resposta com a URL e o public_id
      return NextResponse.json({
        secure_url: result.secure_url,
        public_id: result.public_id,
      });
    });

    // Enviar o buffer diretamente para o Cloudinary
    const stream = cloudinary.v2.uploader.upload_stream(result);
    stream.end(buffer);

  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json({ error: "Upload to Cloudinary failed" }, { status: 500 });
  }
}
