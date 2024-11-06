import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Verifica o ambiente (produção ou desenvolvimento)
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Recupera o domínio permitido a partir da variável de ambiente
  const allowedOrigin = process.env.NEXT_PUBLIC_APP_URL || '';

  // Se estiver em ambiente de desenvolvimento, permite todas as requisições
  if (isDevelopment) {
    return NextResponse.next();
  }

  // Verifica a origem da requisição
  const origin = request.headers.get('Origin');
  const sessionPublicCookie = request.headers.get('session-public');

  // Se a origem não for permitida, retorna 403
  if ((origin && origin !== allowedOrigin) && sessionPublicCookie) {
    return NextResponse.json({ message: 'Acesso proibido. Origem não permitida.' }, { status: 403 });
  }

  // Se a origem for permitida e a sessão (se necessário) estiver válida, permite a requisição seguir
  const response = NextResponse.next();
  
  // Adiciona os cabeçalhos CORS para a resposta
  response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return response;
}

// Configuração para aplicar o middleware apenas em rotas de API
export const config = {
  matcher: ['/api/:path*'],
};
