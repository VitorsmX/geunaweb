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
    // Obter imagens da pasta específica
    const imageResult = await cloudinary.api.resources({
      type: 'upload',
      prefix: `geunaweb/${slug}/`, // Prefixo da pasta específica
      max_results: 300, // Limitar resultados de imagens
      resource_type: 'image', // Buscar apenas imagens
    });

    // Obter vídeos da pasta específica
    const videoResult = await cloudinary.api.resources({
      type: 'upload',
      prefix: `geunaweb/${slug}/`, // Prefixo da pasta específica
      max_results: 300, // Limitar resultados de vídeos
      resource_type: 'video', // Buscar apenas vídeos
    });

    console.log(videoResult)

    const results = [...imageResult.resources, ...videoResult.resources];

    const files = results.map((resource: any) => {
      let type;
      switch (resource.resource_type) {
        case 'image':
          type = 'image/' + resource.format;
          break;
        case 'video':
          type = 'video/' + resource.format;
          break;
        default:
          type = 'application/octet-stream'; // Para outros tipos não tratados
      }

      return {
        url: resource.secure_url,
        public_id: resource.public_id,
        type,
      };
    });

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
