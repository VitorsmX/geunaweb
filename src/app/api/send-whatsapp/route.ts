// app/api/send-whatsapp/route.ts

import { NextRequest, NextResponse } from 'next/server';

// Esta função recebe os detalhes do livro do frontend
export async function POST(request: NextRequest) {
  try {
    // Verifique se a chave de API foi fornecida corretamente
    const apiKey = request.headers.get('x-api-key');
    const expectedApiKey = process.env.SECRET_API_KEY;

    if (apiKey !== expectedApiKey) {
      return NextResponse.json({ message: 'Chave de API inválida!' }, { status: 403 });
    }

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
