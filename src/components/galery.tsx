"use client";
import React, { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from 'embla-carousel-react';
import { OstDocument } from "outstatic";
import Fuse from "fuse.js";

type Item = {
  tags?: { value: string; label: string }[];
  date?: string;
} & OstDocument;

type Props = {
  collection: string;
  title?: string;
  items: Item[];
  priority?: boolean;
  viewAll?: boolean;
};

const Galery = ({
  title = "More",
  items,
  collection,
  priority = false,
  viewAll = false,
}: Props) => {
  const [emblaRef] = useEmblaCarousel({ loop: true });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState<Item[]>(items);

  // Configuração do Fuse.js para busca
  const fuse = useMemo(() => new Fuse(items, {
    keys: ['title', 'description'],
    includeScore: true,
    threshold: 0.2,
  }), [items]);

  // Função de busca
  const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term) {
      const results = fuse.search(term);
      setFilteredItems(results.map(result => result.item));
    } else {
      setFilteredItems(items);
    }
  }, [fuse, items]);

  return (
    <section id={collection} className="mb-24">
      <div className="flex gap-4 md:gap-6 items-end">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight capitalize mb-3">
          {title}
        </h2>
        {viewAll && (
          <Button asChild variant="outline" className="hidden md:flex">
            <Link href={`/${collection}`} className="gap-2">
              Ver Todos <ArrowRight size={16} />
            </Link>
          </Button>
        )}
      </div>

      {/* Campo de busca */}
      <input
        type="text"
        placeholder="Pesquisar..."
        value={searchTerm}
        onChange={handleSearch}
        className="border rounded-md p-2 w-full mb-4"
      />

      <div className="embla mt-4" ref={emblaRef}>
        <div className="embla__container grid grid-cols-2 md:grid-cols-5 gap-x-5 gap-y-3">
          {filteredItems.map((item) => (
            <div className="embla__slide w-full max-w-md bg-[#b3e9ff40]" key={item.slug}>
              <Link href={`/${collection}/${item.slug}`}>
                <div className={`cursor-pointer border rounded-md scale-100 hover:scale-[1.02] active:scale-[0.97] transition duration-100 overflow-hidden h-full max-h-[550px]`}>
                  <Image
                    src={item.coverImage || `/api/og?title=${item.title}`}
                    alt=""
                    className="border-b md:h-[180px] object-center"
                    width={430}
                    height={180}
                    sizes="(min-width: 768px) 300px, 192px"
                    priority={priority && items.indexOf(item) <= 2}
                    style={{ objectFit: "contain"}}
                    loading="lazy"
                  />
                  <div className="p-4">
                    {Array.isArray(item?.tags) && item.tags.map(({ label }) => (
                      <span
                        key={label}
                        className="inline-block bg-gray-200 rounded-full px-2 py-0 text-sm font-semibold text-gray-700 mr-2 mb-4"
                      >
                        {label}
                      </span>
                    ))}
                    <h3 className="text-xl mb-1 leading-snug font-bold hover:underline">
                      {item.title}
                    </h3>
                    {item.date && <p className="text-xs mb-2 font-thin italic">Data do evento: {item.date}</p>}
                    <p className="text-sm leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {viewAll && (
        <Button asChild variant="secondary" className="md:hidden w-full mt-4">
          <Link href={`/${collection}`} className="gap-2">
            Ir Para: {title}
            <ArrowRight size={16} />
          </Link>
        </Button>
      )}
    </section>
  );
};

export default React.memo(Galery);
