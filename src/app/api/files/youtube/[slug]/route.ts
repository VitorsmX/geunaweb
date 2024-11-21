import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabaseClient";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  console.log(slug);

  try {
    // Buscar todas as URLs de vídeos do YouTube para o slug específico
    const { data, error } = await supabase
      .from("youtube_videos")
      .select("url")
      .eq("slug", slug);

    if (error) {
      console.error("Erro na consulta:", error);
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      console.log("Nenhum dado retornado para o slug:", slug);
    } else {
      console.log("Dados retornados:", data);
    }

    return NextResponse.json({ videos: data }, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar vídeos:", error);
    return NextResponse.json(
      { error: "Falha ao buscar vídeos" },
      { status: 500 }
    );
  }
}
