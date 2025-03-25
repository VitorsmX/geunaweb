"use client";

import { useEffect, useState, useRef } from "react";
import { Heart, X } from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from "./SessionContext";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";

const EventConfirmationBanner = ({ uuid }: { uuid: string }) => {
  const paramEventId = useSession();
  const { isEventGuest } = paramEventId;
  const id = isEventGuest ? uuid : false;
  const [setItem, item] = useCopyToClipboard()

  // Inicializa o estado do modal como ABERTO se houver um ID válido
  const [isOpen, setIsOpen] = useState(true);
  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [finalCode, setFinalCode] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  // Fecha o modal ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Atualiza o código final quando ambos os campos forem preenchidos
  useEffect(() => {
    if (fullName && whatsapp.length > 10) {
      setFinalCode(`${id}-${fullName.replace(/\s+/g, "")}-${whatsapp}`);
    } else {
      setFinalCode(null);
    }
  }, [fullName, whatsapp, id]);

  return id ? (
    <div>
      {/* O botão só aparece se o modal estiver fechado */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-16 right-4 bg-teal-600 text-white py-2 px-4 rounded-full shadow-lg flex items-center space-x-2 border border-green-900 hover:bg-teal-500 transition-all duration-300 ease-in-out z-40"
        >
          <span className="text-sm w-fit">GERAR COMPROVANTE (CLIQUE AQUI)</span>
          <Heart />
        </button>
      )}

      {/* Modal (já aberto se o ID for válido) */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-xl p-6 max-w-lg mx-4 w-full relative"
          >
            {/* Botão para fechar o modal */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              <X size={24} />
            </button>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold uppercase tracking-wide mb-4 text-teal-600">
                PARABÉNS!
              </h2>
              <p className="text-lg leading-relaxed opacity-90 mb-6 text-gray-700">
                Por participar do NOSSO EVENTO{"\n"}
                Preencha para gerar seu comprovante de participação
              </p>

              {/* Campos de entrada */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Seu Nome Completo"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <input
                  type="tel"
                  placeholder="Seu WhatsApp (DDD + Número)"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                />
              </div>

              {/* Código de participação (só aparece quando os campos são preenchidos) */}
              {finalCode && (
                <div className="flex flex-col gap-y-2">
                  <div className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-base break-all">
                    <strong>Comprovante:</strong> {finalCode}
                  </div>
                    {item && <p className="absolute inset-0 bg-black/30 rounded-2xl w-fit h-fit text-3xl top-[45%] right-[45%] py-2 px-4 m-2">Código copiado: {item}</p>}
                  <button className="p-3 bg-orange-400 rounded-lg" onClick={() => setItem(`${finalCode}`)}>Copiar</button>
                  <p className="hover:scale-110 text-sm font-mono p-2">*Válido somente mediante apresentação do ticket impresso e carimbado</p>
                </div>
              )}

              {/* Botão de ação adicional */}
              <a
                href="https://amzn.to/3CvLBrj"
                target="_blank"
                className="inline-block text-lg font-bold py-3 px-8 bg-yellow-500 text-white rounded-lg transition-all duration-300 ease-in-out transform hover:bg-orange-500 hover:scale-105 mt-4"
              >
                Compre na Amazon e Ajude Nossa Comunidade
              </a>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  ) : null;
};

export default EventConfirmationBanner;
