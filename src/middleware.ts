// app/middleware.ts

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto'

// Função para descriptografar a chave de API
const decryptApiKey = (encryptedKey: string) => {
  const iv = process.env.ENCRYPTION_IV || ''; 
  const secretKey = process.env.ENCRYPTION_SECRET_KEY || ''; 

  if (secretKey.length !== 32) {
    throw new Error('A chave de criptografia deve ter exatamente 32 bytes.');
  }

  if (iv.length !== 16) {
    throw new Error('O vetor de inicialização (IV) deve ter exatamente 16 bytes.');
  }

  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey, 'utf8'), Buffer.from(iv, 'utf8'));

  let decrypted = decipher.update(encryptedKey, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};

// Função para validar a chave de API
const validateApiKey = (request: NextRequest) => {
  // Captura a chave de API da requisição
  const requestApiKey = request.headers.get('x-api-key');

  // A chave criptografada armazenada no backend
  const encryptedStoredApiKey = process.env.ENCRYPTED_API_KEY;

  // Se a chave não for encontrada ou for inválida, retorna 403
  if (!requestApiKey || decryptApiKey(requestApiKey) !== encryptedStoredApiKey) {
    return false;
  }

  return true;
};

export function middleware(request: NextRequest) {
  // Rota de exclusão
  if (request.url.includes('/api/outstatic/')) {
    return NextResponse.next();
  }

  // Verifica a chave da API em todas as outras requisições
  if (!validateApiKey(request)) {
    return NextResponse.json({ message: 'Chave de API inválida!' }, { status: 403 });
  }

  // Caso a chave seja válida, prossiga com a requisição
  return NextResponse.next();
}

// Configuração para aplicar o middleware apenas em rotas de API, exceto /api/outstatic/
export const config = {
  matcher: ['/api/*'],
};
