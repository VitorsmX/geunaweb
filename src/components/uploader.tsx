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
  const [files, setFiles] = useState<FileItem[]>([]); // Arquivos comuns
  const [youtubeVideos, setYoutubeVideos] = useState<string[]>([]); // Vídeos do YouTube
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [youtubeUrl, setYoutubeUrl] = useState<string>("");

  const FILE_SIZE_LIMIT = 90 * 1024 * 1024; // 90MB

  // Buscar arquivos da galeria ao mudar o 'slug'
  useEffect(() => {
    const fetchFiles = async () => {
      if (!selectedSlug) return;

      try {
        const response = await axios.get(`/api/files/${selectedSlug}`);
        if (response.data?.length) {
          setFiles(response.data);
        } else {
          console.log("Nenhum arquivo encontrado para o slug.");
        }

        const youtubeResponse = await axios.get(`/api/files/youtube/${selectedSlug}`);
        if (youtubeResponse.data?.videos?.length) {
          setYoutubeVideos(youtubeResponse.data.videos);
        } else {
          console.log("Nenhum vídeo do YouTube encontrado para o slug.");
        }
      } catch (error) {
        console.error("Error fetching files:", error);
        setMessage("Falha ao carregar mídias.");
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
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile && selectedFile.size > FILE_SIZE_LIMIT) {
      setMessage("O arquivo é muito grande para o Cloudinary. Por favor, insira uma URL do YouTube.");
    } else {
      setMessage(""); // Limpar mensagem caso o arquivo seja válido
    }
  };

  // Lidar com o upload
  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedSlug) {
      setMessage("Por favor, selecione uma galeria.");
      return;
    }

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.get(`/api/upload-url?slug=${selectedSlug}`);
        const { signature, timestamp, upload_preset, cloud_name, folder } = response.data;

        const uploadUrl =
          file.type.startsWith("image/") ?
          `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload` :
          `https://api.cloudinary.com/v1_1/${cloud_name}/video/upload`;

        const params = {
          file,
          api_key: process.env.CLOUDINARY_API_KEY,
          signature,
          timestamp,
          upload_preset,
          folder,
          public_id: `geunaweb/${selectedSlug}/${file.name}`,
        };

        const cloudinaryResponse = await axios.post(uploadUrl, params, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setFiles((prevFiles) => [
          ...prevFiles,
          {
            url: cloudinaryResponse.data.secure_url,
            public_id: cloudinaryResponse.data.public_id,
            type: file.type,
            name: file.name,
          },
        ]);
        setMessage("Upload bem-sucedido!");
        setFile(null);
      } catch (error) {
        console.error("Upload error:", error);
        setMessage("Falha no upload.");
      }
    } else if (youtubeUrl) {
      try {
        const response = await axios.post(`/api/youtube-upload?slug=${selectedSlug}`, {
          url: youtubeUrl,
        });

        setYoutubeVideos((prevVideos) => [...prevVideos, youtubeUrl]);
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

  // Remover arquivo
  const handleRemoveFile = async (public_id: string) => {
    try {
      const response = await axios.delete(`/api/delete/remove`, {
        data: { public_id },
      });

      if (response.status === 200) {
        setFiles((prevFiles) => prevFiles.filter((file) => file.public_id !== public_id));
        setMessage("Arquivo removido com sucesso!");
      } else {
        setMessage("Falha ao remover o arquivo.");
      }
    } catch (error) {
      console.error("Error removing file:", error);
      setMessage("Falha ao remover o arquivo.");
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

        {message.includes("90MB") && (
          <div>
            <p className="text-red-500 text-sm">Arquivos maiores que 90MB só podem ser enviados via YouTube:</p>
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

      {/* Exibir arquivos carregados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6 max-h-[86%] overflow-y-scroll">
        {files.length === 0 && youtubeVideos.length === 0 && <p className="text-center">Nenhum arquivo ou vídeo carregado.</p>}
        {files.map((item) => (
          <div key={item.public_id} className="relative overflow-hidden border rounded-md shadow-md">
            {item.name}
            {item.type.startsWith("image/") ? (
              <img src={item.url} alt="Uploaded" className="w-full h-32 object-cover" />
            ) : item.type.startsWith("video/") ? (
              <video controls className="w-full h-32 object-cover">
                <source src={item.url} type={item.type} />
                Seu navegador não suporta vídeos.
              </video>
            ) : null}
            <button
              onClick={() => handleRemoveFile(item.public_id)}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
            >
              Remover
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadComponent;
