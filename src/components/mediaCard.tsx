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

  return (
    <div className="container mx-auto my-8">
      {message && <p className="text-red-500 text-center">{message}</p>}
      <div className="grid grid-cols-2 grid-rows-4 sm:grid-rows-6 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {mediaItems.map((item) => (
          <div
            key={item.public_id}
            className="max-w-lg mx-auto rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.01] bg-[#d6e9ff21]"
          >
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
        ))}
      </div>
    </div>
  );
};

export default MediaCard;
