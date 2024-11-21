import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const appURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  console.log(slug);

  try {
    // Buscar todas as URLs de vídeos do YouTube para o slug específico
    const response = await axios.get(`${appURL}/api/getYoutubeVideos/${slug}`);
    const { data } = response;

    if (response.status !== 200) {
      console.error("Erro na consulta:", response.statusText);
      throw new Error( response.statusText);
    }

    if (!data || data.length === 0) {
      console.log("Nenhum dado retornado para o slug:", slug);
    } else {
      console.log("Dados retornados:", data);
    }

    return NextResponse.json({ videos: data.videos }, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar vídeos:", error);
    return NextResponse.json(
      { error: "Falha ao buscar vídeos" },
      { status: 500 }
    );
  }
}
