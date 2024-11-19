"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface GalleryItem {
  title: string;
  slug: string;
  coverImage: string;
  description: string;
  date: string;
}

interface FileItem {
  url: string;
  public_id: string;
  type: string;
  name: string;
}

const UploadComponent: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [youtubeUrl, setYoutubeUrl] = useState<string>("");

  // Buscar arquivos da galeria ao mudar o 'slug'
  useEffect(() => {
    const fetchFiles = async () => {
      if (!selectedSlug) return;

      try {
        // Buscar arquivos da API, incluindo vídeos do YouTube
        const response = await axios.get(`/api/files/youtube/${selectedSlug}`);
        setFiles(response.data.videos);  // Supondo que a resposta seja algo como { videos: [...] }
      } catch (error) {
        console.error("Error fetching files:", error);
        setMessage("Failed to load files.");
      }
    };

    fetchFiles();
  }, [selectedSlug]);

  // Buscar itens da galeria
  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        const response = await axios.get("/api/galleryItems");
        setGalleryItems(response.data);
      } catch (error) {
        console.error("Error fetching gallery items:", error);
        setMessage("Falha ao carregar itens da galeria.");
      }
    };

    fetchGalleryItems();
  }, []);

  // Lidar com mudanças no arquivo selecionado
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] || null);
  };

  // Lidar com o upload
  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedSlug) {
      setMessage("Por favor, selecione uma galeria.");
      return;
    }

    // Verificar se o arquivo é muito grande (maior que 100MB)
    if (file) {
      if (file.size > 100 * 1024) {  // 10MB
        setMessage("O vídeo é maior que 10MB. Por favor, insira a URL do YouTube ou faça o upload de outro arquivo.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      try {
        const existingFile = files.find((item) => item.public_id === file.name);

        if (existingFile) {
          setMessage("Arquivo já existe. Por favor, faça o upload de um arquivo diferente.");
          return;
        }

        const response = await axios.post(`/api/upload?slug=${selectedSlug}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setFiles((prevFiles) => [
          ...prevFiles,
          { url: response.data.secure_url, public_id: response.data.public_id, type: file.type, name: file.name },
        ]);
        setMessage("Upload bem-sucedido!");
        setFile(null);
      } catch (error) {
        console.error("Upload error:", error);
        setMessage("Falha no upload.");
      }
    } else if (youtubeUrl) {
      // Caso seja uma URL do YouTube
      try {
        const response = await axios.post(`/api/youtube-upload?slug=${selectedSlug}`, {
          url: youtubeUrl,
        });

        setFiles((prevFiles) => [
          ...prevFiles,
          { url: response.data.secure_url, public_id: youtubeUrl, type: "video", name: youtubeUrl },
        ]);
        setMessage("Vídeo do YouTube inserido com sucesso!");
        setYoutubeUrl("");
      } catch (error) {
        console.error("YouTube upload error:", error);
        setMessage("Falha ao inserir o vídeo do YouTube.");
      }
    } else {
      setMessage("Selecione um arquivo ou insira uma URL do YouTube.");
    }
  };

  // Lidar com a exclusão de vídeos
  const handleDelete = async (public_id: string) => {
    try {
      // Deletar vídeo usando a API
      const response = await axios.delete(`/api/delete/youtube/${selectedSlug}`, {
        data: { url: public_id }, // Usamos o `public_id` ou `url` para identificar o vídeo
      });

      if (response.status === 200) {
        setFiles((prevFiles) => prevFiles.filter((file) => file.public_id !== public_id));
        setMessage("Vídeo excluído com sucesso.");
      } else {
        setMessage("Falha ao excluir o vídeo.");
      }
    } catch (error) {
      console.error("Deletion error:", error);
      setMessage("Falha na exclusão.");
    }
  };

  return (
    <div className="max-w-full mx-auto bg-white rounded-lg shadow-md p-6 mt-10 transition-transform transform hover:scale-105">
      <h2 className="text-2xl font-semibold text-center mb-4">Upload de Imagem ou Vídeo</h2>

      <select onChange={(e) => setSelectedSlug(e.target.value)} value={selectedSlug} className="mb-4 p-2 border rounded">
        <option value="">Selecione uma galeria</option>
        {galleryItems.map((item) => (
          <option key={item.slug} value={item.slug}>{item.title}</option>
        ))}
      </select>

      <form onSubmit={handleUpload} className="flex flex-col space-y-4">
        <input
          type="file"
          onChange={handleFileChange}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        />

        {message.includes("10MB") && (
          <div>
            <p className="text-red-500 text-sm">Vídeos maiores que 100MB não podem ser enviados. Você pode inserir uma URL do YouTube:</p>
            <input
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="border border-gray-300 rounded-md p-2 mt-2"
              placeholder="Insira a URL do YouTube"
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200 transform hover:scale-105"
        >
          Upload
        </button>
      </form>

      {message && <p className="mt-4 text-center text-gray-700">{message}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6 max-h-[86%] overflow-y-scroll">
        {files.length === 0 && <p className="text-center">Nenhum arquivo carregado.</p>}
        {files.map((item) => (
          <div key={item.public_id} className="relative overflow-hidden border rounded-md shadow-md">
            {item.name}
            {item.type.startsWith("image/") ? (
              <img src={item.url} alt="Uploaded" className="w-full h-32 object-cover" />
            ) : item.type.startsWith("video/") ? (
              item.url.includes("youtube.com") || item.url.includes("youtu.be") ? (
                <iframe
                  className="w-full h-32 object-cover"
                  src={`https://www.youtube.com/embed/${new URL(item.url).searchParams.get('v')}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video controls className="w-full h-32 object-cover">
                  <source src={item.url} type={item.type} />
                  Seu navegador não suporta vídeos.
                </video>
              )
            ) : null}
            <button
              onClick={() => handleDelete(item.public_id)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition duration-200"
            >
              Excluir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadComponent;
