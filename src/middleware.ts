import { NextRequest, NextResponse } from 'next/server';
import { Outstatic, Session } from "outstatic";

// Classe para gerenciar a sessão
class SessionManager {
  private session: Session | null = null;

  // Método para carregar e definir a sessão
  async loadSession() {
    if (this.session === null) {
      // Carrega a sessão de forma assíncrona
      const ostData = await Outstatic();
      this.session = ostData.session;
    }
  }

  // Método para obter a sessão
  getSession() {
    return this.session;
  }

  // Método para definir explicitamente a sessão
  setSession(session: Session | null) {
    this.session = session;
  }

  // Método para verificar se a sessão existe
  hasSession() {
    return this.session !== null;
  }
}

// Instancia o gerenciador de sessão
const sessionManager = new SessionManager();

// Middleware
export async function middleware(request: NextRequest) {
  // Carrega a sessão (assíncrono)
  await sessionManager.loadSession();

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

  // Se a origem não for permitida, retorna 403
  if (origin && origin !== allowedOrigin) {
    return NextResponse.json({ message: 'Acesso proibido. Origem não permitida.' }, { status: 403 });
  }

  // Condicional para rotas específicas que requerem verificação de sessão
  const isSessionRequiredRoute = request.url.includes('/api/delete/remove') || request.url.includes('/api/upload');

  if (isSessionRequiredRoute) {
    // Verifica se a sessão existe
    if (!sessionManager.hasSession()) {
      return NextResponse.json({ message: 'Sessão expirada ou não encontrada.' }, { status: 401 });
    }
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
