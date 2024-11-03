// app/components/BookCard.js
'use client';

import React from 'react';
import Image from 'next/image';
import { OstDocument } from 'outstatic';

type Book = {
    tags?: { value: string; label: string }[];
    autorEncarnado: string;
    autorDesencarnado: string;
    dataDaPublicacao: string;
    sinopse: string;
    linkParaComprar: string;
    imagemDoLivro: string;
    quantidadeDePaginas: string;
    precoNaInternet: string;
    linkDoLivroEmPdf: string;
    linkParaSolicitar: string;
  } & OstDocument;

const BookCard = React.memo(({ book }: { book: Book }) => {
    if (!book) {
        return null;
    }

    return (
        <div className="max-w-lg mx-auto my-4 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.01] bg-[#d6e9ff21]">
            <Image
                src={book.imagemDoLivro && book.imagemDoLivro.length > 5 ? `${book.imagemDoLivro}` : `${book.coverImage}`}
                alt={book.title}
                className="w-full h-fit object-cover"
                width={500}
                height={300}
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,..."
            />
            <div className="p-4 bg-white">
                <h2 className="text-xl font-bold text-gray-800">{book.title}</h2>
                <p className="text-gray-800 mt-1">Autor Encarnado: {book.autorEncarnado}</p>
                <p className="text-gray-800 mt-1">Autor Desencarnado: {book.autorDesencarnado}</p>
                <p className="text-gray-800 mt-2">Publicado em: {book.dataDaPublicacao}</p>
                <p className="text-gray-800 mt-2">{book.sinopse}</p>
                <p className="text-xl font-semibold text-gray-800 mt-2">Preço: R$ {book.precoNaInternet}</p>
                <p className="text-sm text-gray-700 mt-2">Páginas: {book.quantidadeDePaginas}</p>
                <div className="flex gap-x-2 mt-4">
                    {book.linkParaComprar && (
                        <a
                            href={book.linkParaComprar}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
                        >
                            Comprar
                        </a>
                    )}
                    {book.linkDoLivroEmPdf && (
                        <a
                            href={book.linkDoLivroEmPdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
                        >
                            Baixar
                        </a>
                    )}
                    {book.linkParaSolicitar && (
                        <a
                            href={book.linkParaSolicitar}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
                        >
                            Solicitar
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
});

export default BookCard;
