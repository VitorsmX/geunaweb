'use client'

import { useState } from 'react';
import { LucideHelpingHand, X } from 'lucide-react';
import { motion } from 'framer-motion';

const AffiliateBanner = () => {
  // Estado para controlar a visibilidade do modal
  const [isOpen, setIsOpen] = useState(false);

  // Função para abrir o modal
  const openModal = () => setIsOpen(true);

  // Função para fechar o modal
  const closeModal = () => setIsOpen(false);

  return (
    <div>
      {/* Botão fixo que abre o modal */}
      <button
        onClick={openModal}
        className="fixed bottom-4 right-4 bg-teal-600 text-white py-2 px-4 rounded-full shadow-lg flex items-center space-x-2 hover:bg-teal-500 transition-all duration-300 ease-in-out z-10"
      >
        <span className="text-sm">Compre na Amazon e Ajude a Comunidade</span>
        <LucideHelpingHand />
      </button>

      {/* Modal com conteúdo do banner */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg mx-4 w-full">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold uppercase tracking-wide mb-4 text-teal-600">
                Colabore com o Grupo Espírita União!
              </h2>
              <p className="text-lg leading-relaxed opacity-90 mb-6 text-gray-700">
                Ao comprar qualquer produto na Amazon através do nosso link de afiliado, você está ajudando a financiar as ações sociais, projetos e a manutenção do Grupo Espírita União. Sua contribuição é fundamental para continuarmos com nosso trabalho.
              </p>
              <a
                href="https://amzn.to/3CvLBrj"
                target="_blank"
                className="inline-block text-lg font-bold py-3 px-8 bg-yellow-500 text-white rounded-lg transition-all duration-300 ease-in-out transform hover:bg-orange-500 hover:scale-110"
              >
                Compre na Amazon e Ajude Nossa Comunidade
              </a>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AffiliateBanner;
