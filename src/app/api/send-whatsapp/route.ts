// app/api/send-whatsapp/route.ts

import { NextRequest, NextResponse } from 'next/server';

// Esta função recebe os detalhes do livro do frontend
export async function POST(request: NextRequest) {
  try {
    // Obtenha os detalhes do livro da requisição
    const { bookDetails } = await request.json();

    // Aqui você pode realizar a lógica para enviar a mensagem de WhatsApp
    const whatsappMessage = `Solicitação de livro: ${bookDetails.title} \nAutor: ${bookDetails.autorEncarnado} \nPreço: ${bookDetails.precoNaInternet}`;

    // Substitua a URL do WhatsApp pela lógica para gerar o link
    const whatsappUrl = `https://api.whatsapp.com/send?phone=+5591996360055&text=${encodeURIComponent(whatsappMessage)}`;

    // Responda com a URL do WhatsApp
    return NextResponse.json({ url: whatsappUrl });

  } catch (error) {
    console.error('Erro ao enviar a solicitação:', error);
    return NextResponse.json({ message: 'Erro ao processar a solicitação.' }, { status: 500 });
  }
}
