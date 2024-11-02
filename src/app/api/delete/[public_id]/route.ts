import { NextRequest, NextResponse } from "next/server";
import cloudinary from "cloudinary"
export async function DELETE(req: NextRequest) {
  const { public_id } = await req.json(); // Capturando a public_id do body

  if (!public_id) {
    return NextResponse.json({ error: "No public_id provided" }, { status: 400 });
  }

  try {
    await cloudinary.v2.uploader.destroy(public_id); // Excluindo o arquivo do Cloudinary
    return NextResponse.json({ message: "Arquivo excluído com sucesso." });
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
    return NextResponse.json({ error: "Deletion failed" }, { status: 500 });
  }
}
