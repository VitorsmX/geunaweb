// app/components/BookCard.js
'use client';

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
  } & OstDocument;

const BookCard = ({ book }: { book: any }) => {
    if(!book) {
        return null;
    }

    console.log(book)

  return (
    <div className="max-w-lg mx-auto my-4 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.01]">
      <img
        src={book.coverImage}
        alt={book.title}
        className="w-full h-fit object-cover"
      />
      <div className="p-6 bg-white">
        <h2 className="text-2xl font-bold text-gray-800">{book.title}</h2>
        <p className="text-gray-600 mt-1">Autor Encarnado: {book.autorEncarnado}</p>
        <p className="text-gray-600 mt-1">Autor Desencarnado: {book.autorDesencarnado}</p>
        <p className="text-gray-500 mt-2">Publicado em: {book.dataDaPublicacao}</p>
        <p className="text-gray-700 mt-4">{book.description}</p>
        <p className="text-xl font-semibold mt-4">Preço: R$ {book.precoNaInternet}</p>
        <p className="text-sm text-gray-500 mt-2">Páginas: {book.quantidadeDePaginas}</p>
        <div className="flex gap-x-2 mt-6">
          {book.linkParaComprar && <a
            href={book.linkParaComprar}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Comprar
          </a>}
          {book.linkDoLivroEmPdf && <a
            href={book.linkDoLivroEmPdf}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Baixar
          </a>}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
