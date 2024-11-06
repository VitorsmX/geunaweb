"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

// Função para gerar um UUID
function generateUUID() {
  return crypto.randomUUID(); // Gera um UUID único usando a API nativa do browser
}

// Função para ler o UUID armazenado no cookie
function getUUIDFromCookie() {
  return Cookies.get("session-public");
}

// Função para armazenar o UUID no cookie
function setUUIDToCookie(uuid: string) {
  Cookies.set("session-public", uuid, { expires: 0.5 });
}

// Defina o contexto e o hook para acessar o UUID
interface SessionContextType {
  uuid: string;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

// Provider que gerencia a sessão e o cookie
export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [uuid, setUuid] = useState<string>("");

  useEffect(() => {
    let storedUUID = getUUIDFromCookie(); // Tenta ler o UUID do cookie
    if (!storedUUID) {
      storedUUID = generateUUID(); // Gera um UUID se não encontrado
      setUUIDToCookie(storedUUID); // Armazena o UUID no cookie
    }
    setUuid(storedUUID); // Armazena no estado para disponibilizar no contexto
  }, []);

  if (!uuid) {
    return <div>Loading...</div>; // Pode retornar um loading até a verificação estar completa
  }

  return (
    <SessionContext.Provider value={{ uuid }}>
      {children}
    </SessionContext.Provider>
  );
};

// Hook para acessar o contexto
export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
