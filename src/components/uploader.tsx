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

  // Definir limite de tamanho de arquivo
  const FILE_SIZE_LIMIT = 90 * 1024 * 1024; // 90MB

  // Buscar arquivos da galeria ao mudar o 'slug'
  useEffect(() => {
    const fetchFiles = async () => {
      if (!selectedSlug) return;

      try {
        // Buscar arquivos da API para o slug
        const response = await axios.get(`/api/files/${selectedSlug}`);
        if (response.data?.length) {
          setFiles(response.data);
        } else {
          console.log("Nenhum arquivo encontrado para o slug.");
        }

        // Buscar vídeos do YouTube
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

    // Verificar se o arquivo é muito grande (maior que 90MB)
    if (file && file.size > FILE_SIZE_LIMIT) {
      // Redirecionar para o YouTube em vez de fazer upload para o Cloudinary
      if (youtubeUrl) {
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
        setMessage("Por favor, insira uma URL do YouTube.");
      }
    } else if (file) {
      // Se o arquivo for válido para upload no Cloudinary
      try {
        // Obter a URL de upload e assinatura do Cloudinary do backend
        const response = await axios.get(`/api/upload?slug=${selectedSlug}`);
        const { upload_url, signature, timestamp, cloud_name } = response.data;

        // Criar o FormData para enviar o arquivo
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!); // Coloque a chave pública
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);
        formData.append("folder", `geunaweb/${selectedSlug}`); // Direcionar para o diretório correto

        // Verifique se a URL de upload é válida antes de tentar o upload
        if (!upload_url || !upload_url.startsWith("https://")) {
          throw new Error("A URL de upload do Cloudinary é inválida.");
        }

        // Realizar o upload para o Cloudinary
        const cloudinaryResponse = await axios.post(upload_url, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setFiles((prevFiles) => [
          ...prevFiles,
          { url: cloudinaryResponse.data.secure_url, public_id: cloudinaryResponse.data.public_id, type: file.type, name: file.name },
        ]);
        setMessage("Upload bem-sucedido!");
        setFile(null);
      } catch (error) {
        console.error("Upload error:", error);
        setMessage("Falha no upload.");
      }
    } else {
      setMessage("Selecione um arquivo ou insira uma URL do YouTube.");
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
        {/* Arquivos carregados */}
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadComponent;
