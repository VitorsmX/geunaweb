// src/app/api/delete/[public_id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import cloudinary from "cloudinary";

// Configurar o Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Função para lidar com a exclusão
export async function DELETE(req: NextRequest, { params }: { params: { public_id: string } }) {
  const { public_id } = params;

  if (!public_id) {
    return NextResponse.json({ error: "No public_id provided" }, { status: 400 });
  }

  try {
    // Excluindo o arquivo no Cloudinary
    const result = await cloudinary.v2.uploader.destroy(public_id, {
      resource_type: "auto",
    });

    if (result.result === "ok") {
      return NextResponse.json({ message: "File deleted successfully." });
    } else {
      return NextResponse.json({ error: "File deletion failed." }, { status: 500 });
    }
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
    return NextResponse.json({ error: "Deletion from Cloudinary failed" }, { status: 500 });
  }
}
