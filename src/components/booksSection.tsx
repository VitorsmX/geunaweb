"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { OstDocument } from "outstatic";
import Fuse from "fuse.js";

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
  linkParaSolicitar: string;
  isstock: boolean;
} & OstDocument;

type Props = {
  collection: string;
  title?: string;
  books: Book[];
  priority?: boolean;
  viewAll?: boolean;
};

const translateKeys = (key: string) => {
  switch (key) {
    case "title":
      return "Título";
    case "description":
      return "Descrição";
    case "autorEncarnado":
      return "Autor Encarnado";
    case "autorDesencarnado":
      return "Autor Desencarnado";
    case "dataDaPublicacao":
      return "Data da Publicação";
    case "precoNaInternet":
      return "Preço na Internet";
    case "quantidadeDePaginas":
      return "Quantidade de Páginas";
    default:
      return key;
  }
};

const BooksSection = ({
  title = "More",
  books,
  collection,
  priority = false,
  viewAll = false,
}: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState<Book[]>([]);
  const [searchKeys, setSearchKeys] = useState<string[]>([
    "title",
    "description",
    "autorEncarnado",
    "autorDesencarnado",
    "dataDaPublicacao",
    "precoNaInternet",
    "quantidadeDePaginas",
  ]);
  const [visibleBooks, setVisibleBooks] = useState(5);

  const fuse = useMemo(() => {
    return new Fuse(books, {
      keys: searchKeys,
      threshold: 0.4,
    });
  }, [books, searchKeys]);

  useEffect(() => {
    if (searchTerm) {
      const results = fuse.search(searchTerm);
      setFilteredResults(results.map((result) => result.item));
    } else {
      setFilteredResults(books);
    }
  }, [searchTerm, books, fuse]);

  const handleLoadMore = useCallback(() => {
    setVisibleBooks((prev) => prev + 5);
  }, []);

  const handleKeyChange = useCallback((key: string) => {
    setSearchKeys((prevKeys) =>
      prevKeys.includes(key)
        ? prevKeys.filter((k) => k !== key)
        : [...prevKeys, key]
    );
  }, []);

  return (
    <section id={collection} className="mb-24">
      <div className="flex gap-4 md:gap-6 items-end">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight capitalize">
          {title}
        </h2>
        {viewAll ? (
          <Button asChild variant="outline" className="hidden md:flex">
            <Link href={`/${collection}`} className="gap-2">
              Ver Todos <ArrowRight size={16} />
            </Link>
          </Button>
        ) : null}
      </div>

      <input
        type="text"
        placeholder="Pesquisar Livros..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full sm:w-1/2 md:w-1/2 border-gray-400 border rounded-md p-2 sm:mt-12 mt-6 text-zinc-800 placeholder:text-zinc-600"
      />

      <div className="my-4">
        <h3 className="text-lg font-semibold">Chaves de Pesquisa:</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "title",
            "description",
            "autorEncarnado",
            "autorDesencarnado",
            "dataDaPublicacao",
            "precoNaInternet",
            "quantidadeDePaginas",
          ].map((key) => (
            <label key={key} className="flex items-center">
              <input
                type="checkbox"
                checked={searchKeys.includes(key)}
                onChange={() => handleKeyChange(key)}
                className="mr-2"
              />
              {translateKeys(key)}
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-3 sm:gap-x-4 lg:gap-x-8 gap-y-5 sm:gap-y-6 lg:gap-y-8 mt-4 md:mt-8 gap-x-10">
        {filteredResults.slice(0, visibleBooks).map((item, id) => (
          <Link key={item.slug} href={`/${collection}/${item.slug}`}>
            <div className="cursor-pointer border rounded-md scale-100 hover:scale-[1.02] active:scale-[0.97] transition duration-100 overflow-hidden h-5/6 md:h-4/5 lg:h-5/6 w-fit m-5 bg-[#ffffff45]">
              <Image
                src={item.coverImage || `/api/og?title=${item.title}`}
                alt=""
                className="border-b md:h-[180px] object-contain object-center"
                width={430}
                height={180}
                sizes="(min-width: 768px) 347px, 192px"
                priority={priority && id <= 2}
              />
              <div className="p-4">
                {Array.isArray(item?.tags) &&
                  item.tags.map(({ label }) => (
                    <span
                      key={label}
                      className="inline-block bg-gray-200 rounded-full px-2 py-0 text-sm font-semibold text-gray-700 mr-2 mb-4"
                    >
                      {label}
                    </span>
                  ))}
                <h3 className="text-lg mb-2 leading-snug font-bold hover:underline">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed mb-4 h-1/2 max-h-3 hover:max-h-20 hover:overflow-y-scroll">
                  {item.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {visibleBooks < filteredResults.length && (
        <div className="flex justify-center mt-4">
          <Button onClick={handleLoadMore}>
            Carregar Mais
          </Button>
        </div>
      )}
    </section>
  );
};

export default BooksSection;
