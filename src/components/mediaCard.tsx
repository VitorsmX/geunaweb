// app/components/MediaCard.js
'use client';

import { useEffect, useState } from 'react';

type MediaItem = {
  url: string;
  public_id: string;
  type: string;
};

const MediaCard = ({ slug }: { slug: string }) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [message, setMessage] = useState<string>('');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

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

  const openModal = (media: MediaItem) => {
    setSelectedMedia(media);
  };

  const closeModal = () => {
    setSelectedMedia(null);
  };

  return (
    <div className="container mx-auto my-5">
      {message && <p className="text-red-500 text-center">{message}</p>}
      <div className="grid grid-cols-2 grid-rows-4 sm:grid-rows-2 sm:grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-3">
        {mediaItems.map((item) => (
          <div
            key={item.public_id}
            className="flex flex-col gap-y-0 justify-evenly max-w-lg mx-auto rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.01] bg-[#d6e9ff21] py-2 px-1 h-fit my-0 w-full"
          >
            <div className='my-0'>
            {item.type.startsWith("image/") ? (
              <img
                src={item.url}
                alt="Media"
                className="w-full h-fit object-cover"
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

      {selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative bg-white p-4 rounded-lg shadow-lg max-w-4xl w-full mx-4 md:mx-auto overflow-y-auto h-full md:h-auto">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2"
            >
              X
            </button>
            {selectedMedia.type.startsWith("image/") ? (
              <img
                src={selectedMedia.url}
                alt="Media"
                className="w-full h-auto object-contain max-h-[87vh]"
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

export default MediaCard;
