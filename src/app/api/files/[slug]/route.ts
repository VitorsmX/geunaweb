import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configurar o Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;

  try {
    // Obter arquivos da pasta específica
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: `geunaweb/${slug}/`, // Prefixo da pasta específica
      max_results: 600, // Limitar resultados, ajuste conforme necessário
      resource_type: "auto",
    });

    const files = result.resources.map((resource: any) => ({
      url: resource.secure_url,
      public_id: resource.public_id,
      type: resource.resource_type === 'image' ? 'image/' + resource.format : 'video/' + resource.format,
    }));

    // Verificar se a pasta está vazia e excluir se necessário
    if (files.length === 0) {
      await cloudinary.api.delete_resources_by_prefix(`geunaweb/${slug}/`); // Excluir arquivos
      await cloudinary.api.delete_folder(`geunaweb/${slug}`); // Excluir a pasta
    }

    return NextResponse.json(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    return NextResponse.error();
  }
}
