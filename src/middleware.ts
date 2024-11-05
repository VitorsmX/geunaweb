import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Verifica o ambiente (produção ou desenvolvimento)
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Se estiver em ambiente de desenvolvimento, permite todas as requisições
  if (isDevelopment) {
    return NextResponse.next();
  }

  // Caso contrário, verifica o cookie "_vercel_jwt"
  const vercelJwt = request.cookies.get('_vercel_jwt');

  // Se o cookie não estiver presente ou estiver vazio, bloqueia a requisição
  if (!vercelJwt) {
    return NextResponse.json({ message: 'Requisição não autorizada. Cookie _vercel_jwt ausente.' }, { status: 403 });
  }

  // Se o cookie estiver presente, permite a requisição seguir
  return NextResponse.next();
}

// Configuração para aplicar o middleware apenas em rotas de API
export const config = {
  matcher: ['/api/:path*'],
};
