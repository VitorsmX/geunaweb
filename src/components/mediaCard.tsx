'use client';

import { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSession } from './SessionContext';
import axios from 'axios';  // Importando o axios

type MediaItem = {
  url: string;
  public_id: string;
  type: string;
};

const MediaCard = ({ slug }: { slug: string }) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [youtubeVideos, setYoutubeVideos] = useState<any[]>([]); // Para armazenar URLs dos vídeos do YouTube
  const [message, setMessage] = useState<string>('');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, skipSnaps: false });

  const { uuid } = useSession();

  if (!uuid) {
    return (
      <div className="absolute inset-0 w-full h-full flex items-center justify-center">
        <h1>Sessão Expirada (Recarregue o navegador)</h1>
      </div>
    );
  }

  const fetchYoutubeVideosUrl = async () => {
    const youtubeResponse = await axios.get(`/api/files/youtube/${slug}`);
        if (youtubeResponse.data.videos.length > 0) {
          setYoutubeVideos(youtubeResponse.data.videos || []);
        } else {
          console.log('Erro ao buscar vídeos do YouTube.');
        }
  }

  useEffect(() => {
    const fetchMediaItems = async () => {
      try {
        // Carregar os arquivos do servidor de acordo com o slug
        const response = await fetch(`/api/files/${slug}`);
        if (!response.ok) {
          console.log("Nenhum arquivo encontrado ou erro ao buscar arquivos.");
        } else {
          const data: MediaItem[] = await response.json();
          setMediaItems(data);
        }
      } catch (error) {
        console.error('Error fetching media items:', error);
        setMessage('Falha ao carregar mídias.');
      }
    };

    fetchYoutubeVideosUrl();
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

      {/* Carrossel de mídia (imagens e vídeos) */}
      <div className="embla" ref={emblaRef}>
        <div className="embla__container gap-x-3">
          {mediaItems.map((item) => (
            <div
              key={item.public_id}
              className="embla__slide flex flex-col gap-y-0 justify-evenly max-w-lg mx-auto rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.01] bg-[#d6e9ff36] py-2 px-1 h-[60vh] my-0 w-full min-w-[230px] sm:min-w-[250px]"
            >
              <div className="my-0 w-fit self-center h-72 max-w-[95%] max-h-[95%]">
                {item.type.startsWith('image/') ? (
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
                  <video src={item.url} controls className="my-0 w-fit h-72 object-cover max-w-[80%] max-h-[80%]" />
                )}
              </div>
              <button
                onClick={() => openModal(item)}
                className="w-full h-fit mt-1 py-2 scale-75 bg-blue-600 font-buttons text-white rounded-lg"
              >
                Ver Mídia
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Setas de navegação */}
      <div className="embla__arrows">
        <button className="embla__prev" onClick={scrollPrev}>
          <ChevronLeft />
        </button>
        <button className="embla__next" onClick={scrollNext}>
          <ChevronRight />
        </button>
      </div>

      {/* Pontos de navegação */}
      <div className="embla__dots">
        {mediaItems.map((_, index) => (
          <button
            key={index}
            className="embla__dot"
            onClick={() => embla && embla.scrollTo(index)}
          />
        ))}
      </div>

      {/* Exibição de vídeos do YouTube */}
      <div className="youtube-videos mt-10">
  <h3 className="text-2xl font-semibold mb-4">Vídeos do YouTube</h3>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {youtubeVideos ? youtubeVideos.map((videoUrlObj, index) => (
      <div key={index} className="video-container w-full">
        <iframe
          width="100%"
          height="315"
          // Aqui, você precisa acessar o videoUrlObj.url, pois videoUrlObj é um objeto
          src={videoUrlObj.url} 
          title={`YouTube Video ${index}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full object-cover"
        />
      </div>
    )) : (
      <p>Nenhum vídeo do YouTube encontrado para o evento.</p>
    )}
  </div>
</div>


      {/* Modal de visualização */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative bg-white p-4 rounded-lg shadow-lg max-w-4xl w-full mx-4 md:mx-auto overflow-y-auto h-fit md:h-auto py-7 px-3">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 bg-red-600 text-white rounded-full px-4 py-2"
            >
              X
            </button>
            {selectedMedia.type.startsWith('image/') ? (
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
