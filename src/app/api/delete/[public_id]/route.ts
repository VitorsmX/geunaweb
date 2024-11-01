import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  
  // Obter o parâmetro "slug"
  const public_id = url.searchParams.get("public_id") as string; // Obter o slug da query string

  try {
    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result !== "ok") {
      return NextResponse.json({ message: "Failed to delete file" }, { status: 400 });
    }

    return NextResponse.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.error();
  }
}
