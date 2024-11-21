import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.SUPABASE_URL || ''; // Usar variável de ambiente do Supabase
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; // Use a chave de serviço (não exposta no front-end)
const supabase = createClient(supabaseUrl, supabaseKey);

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
