import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'geunaweb/', // Prefixo da sua pasta
      max_results: 65, // Limitar resultados, ajuste conforme necessário
    });

    const files = result.resources.map((resource: any) => ({
      url: resource.secure_url,
      public_id: resource.public_id,
      type: resource.resource_type === 'image' ? 'image/' + resource.format : 'video/' + resource.format,
    }));

    return NextResponse.json(files);
  } catch (error) {
    return NextResponse.error();
  }
}
