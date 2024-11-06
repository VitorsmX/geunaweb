// app/components/MediaCard.js
'use client';

import { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSession } from './SessionContext';

type MediaItem = {
  url: string;
  public_id: string;
  type: string;
};

const MediaCard = ({ slug }: { slug: string }) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [message, setMessage] = useState<string>('');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, skipSnaps: false });

  const { uuid } = useSession();

  if(!uuid) {
    return <>
      <div className='absolute inset-0 w-full h-full flex items-center justify-center'>
        <h1>Sessão Expirada (Recarregue o navegador)</h1>
      </div>
    </>
  }

  useEffect(() => {
    const fetchMediaItems = async () => {
      try {
        const response = await fetch(`/api/files/${slug}`);
        if (!response.ok) throw new Error('Failed to fetch media items');
        const data: MediaItem[] = await response.json();
        setMediaItems(data);
      } catch (error) {
        console.error("Error fetching media items:", error);
        setMessage("Falha ao carregar mídias.");
      }
    };

    fetchMediaItems();
  }, [slug]);

  const openModal = useCallback((media: MediaItem) => {
    setSelectedMedia(media);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedMedia(null);
  }, []);

  const scrollPrev = useCallback(() => {
    if (embla) embla.scrollPrev();
  }, [embla]);

  const scrollNext = useCallback(() => {
    if (embla) embla.scrollNext();
  }, [embla]);

  const onSelect = useCallback(() => {
    if (!embla) return;
    embla.slideNodes().forEach((slideNode, index) => {
      if (embla.selectedScrollSnap() === index) {
        slideNode.classList.add('is-selected');
      } else {
        slideNode.classList.remove('is-selected');
      }
    });
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    embla.on('select', onSelect);
    onSelect();
  }, [embla, onSelect]);

  return (
    <div className="container min-w-[75vw] sm:min-w-[60vw] md:-ml-10 my-5">
      {message && <p className="text-red-500 text-center">{message}</p>}
      <div className="embla" ref={emblaRef}>
        <div className="embla__container gap-x-3">
          {mediaItems.map((item) => (
            <div
              key={item.public_id}
              className="embla__slide flex flex-col gap-y-0 justify-evenly max-w-lg mx-auto rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.01] bg-[#d6e9ff36] py-2 px-1 h-fit my-0 w-full min-w-[270px] sm:min-w-[250px]"
            >
              <div className='my-0 w-fit h-fit max-w-full max-h-full'>
                {item.type.startsWith("image/") ? (
                  <Image
                    src={item.url}
                    alt="Media"
                    className="w-full h-fit object-cover"
                    width={500}
                    height={300}
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,..."
                    loading="lazy"
                  />
                ) : (
                  <video src={item.url} controls className="w-full h-fit object-cover" />
                )}
              </div>
              <button
                onClick={() => openModal(item)}
                className="w-full h-fit mt-1 py-2 scale-75 bg-blue-500 text-white rounded-lg"
              >
                Ver Mídia
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="embla__arrows">
        <button className="embla__prev" onClick={scrollPrev}>
          <ChevronLeft />
        </button>
        <button className="embla__next" onClick={scrollNext}>
          <ChevronRight />
        </button>
      </div>

      <div className="embla__dots">
        {mediaItems.map((_, index) => (
          <button
            key={index}
            className="embla__dot"
            onClick={() => embla && embla.scrollTo(index)}
          />
        ))}
      </div>

      {selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative bg-white p-4 rounded-lg shadow-lg max-w-4xl w-full mx-4 md:mx-auto overflow-y-auto h-fit md:h-auto py-7 px-3">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 bg-red-600 text-white rounded-full px-4 py-2"
            >
              X
            </button>
            {selectedMedia.type.startsWith("image/") ? (
              <Image
                src={selectedMedia.url}
                alt="Media"
                className="w-full h-auto object-contain max-h-[87vh]"
                width={1200}
                height={800}
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,..."
                loading="lazy"
              />
            ) : (
              <video src={selectedMedia.url} controls className="w-full h-auto max-h-[85vh] object-contain" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(MediaCard);
