// src/app/api/upload/route.ts

import { NextRequest, NextResponse } from "next/server";
import cloudinary from "cloudinary";

// Configurar o Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Função para lidar com o upload
export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");
  const formData = await req.formData();
  const fileEntry = formData.get("file");

  if (!fileEntry || !(fileEntry instanceof File)) {
    return NextResponse.json({ error: "No valid file provided" }, { status: 400 });
  }

  if (!slug) {
    return NextResponse.json({ error: "No slug provided" }, { status: 400 });
  }

  const buffer = Buffer.from(await fileEntry.arrayBuffer());

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream({
        folder: `geunaweb/${slug}`,
        resource_type: "auto",
      }, (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(error);
        }
        resolve(result);
      });

      stream.end(buffer);
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
