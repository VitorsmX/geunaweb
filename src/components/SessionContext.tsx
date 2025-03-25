"use client";

import React, { createContext, useContext, useEffect, useState, Suspense } from "react";
import Cookies from "js-cookie";
import Loading from "./loading";
import { useSearchParams } from "next/navigation";
import validateEventId from "@/actions/validateEvent";

// Função para gerar um UUID
function generateUUID() {
  return crypto.randomUUID();
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
  isEventGuest: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

// Provider que gerencia a sessão e o cookie
const SessionProviderInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const searchParams = useSearchParams();
  const [uuid, setUuid] = useState<string | null>(null);
  const [isEventGuest, setIsEventGuest] = useState<boolean>(false);
  const [paramEventId, setParamEventId] = useState<string | null>(null);

  useEffect(() => {
    // Obtém o parâmetro da URL dentro do useEffect
    setParamEventId(searchParams.get("eventid") || null);
  }, [searchParams]);

  useEffect(() => {
    let storedUUID = getUUIDFromCookie();
    if (!storedUUID) {
      storedUUID = generateUUID();
      setUUIDToCookie(storedUUID);
    }
    setUuid(storedUUID);
  }, []);

  useEffect(() => {
    const checkEventGuest = async () => {
      if (paramEventId) {
        const isValid = await validateEventId(paramEventId);
        setIsEventGuest(isValid);
      }
    };
    checkEventGuest();
  }, [paramEventId]);

  if (!uuid) {
    return <Loading />;
  }

  return (
    <SessionContext.Provider value={{ uuid, isEventGuest }}>
      {children}
    </SessionContext.Provider>
  );
};

// Wrapper para incluir o Suspense necessário
export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Suspense fallback={<Loading />}>
      <SessionProviderInner>{children}</SessionProviderInner>
    </Suspense>
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
