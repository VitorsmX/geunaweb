"use client";

import { useEffect, useState } from "react";

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
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>("");

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        if (!selectedSlug) return;
        const response = await fetch(`/api/files/${selectedSlug}`);
        if (!response.ok) throw new Error("Failed to fetch files");
        const data: FileItem[] = await response.json();
        setFiles(data);
      } catch (error) {
        console.error("Error fetching files:", error);
        setMessage("Failed to load files.");
      }
    };

    fetchFiles();
  }, [selectedSlug]);

  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        const response = await fetch("/api/galleryItems");
        if (!response.ok) throw new Error("Failed to fetch gallery items");

        const items: GalleryItem[] = await response.json();
        setGalleryItems(items);
      } catch (error) {
        console.error("Error fetching gallery items:", error);
        setMessage("Falha ao carregar itens da galeria.");
      }
    };

    fetchGalleryItems();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] || null);
  };

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file || !selectedSlug) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const existingFile = files.find((item) => item.public_id === file.name);

      if (existingFile) {
        setMessage("Arquivo já existe. Por favor, faça o upload de um arquivo diferente.");
        return;
      }

      const response = await fetch(`/api/upload?slug=${selectedSlug}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      setFiles((prevFiles) => [
        ...prevFiles,
        { url: data.secure_url, public_id: data.public_id, type: file.type, name: file.name },
      ]);
      setMessage("Upload bem-sucedido!");
      setFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Falha no upload.");
    }
  };

  const handleDelete = async (public_id: string) => {
    try {
      const response = await fetch(`/api/delete/${public_id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Deletion failed");
      }

      setFiles((prevFiles) => prevFiles.filter((file) => file.public_id !== public_id));
      setMessage("Arquivo excluído com sucesso.");
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
        {galleryItems.map(item => (
          <option key={item.slug} value={item.slug}>{item.title}</option>
        ))}
      </select>

      <form onSubmit={handleUpload} className="flex flex-col space-y-4">
        <input
          type="file"
          onChange={handleFileChange}
          required
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200 transform hover:scale-105"
        >
          Upload
        </button>
      </form>
      
      {message && (
        <p className="mt-4 text-center text-gray-700">{message}</p>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {files.map((item) => (
          <div key={item.public_id} className="relative overflow-hidden border rounded-md shadow-md">
            {item.type.startsWith("image/") ? (
              <img src={item.url} alt="Uploaded" className="w-full h-32 object-cover" />
            ) : item.type.startsWith("video/") ? (
              <video controls className="w-full h-32 object-cover">
                <source src={item.url} type={item.type} />
                Seu navegador não suporta vídeos.
              </video>
            ) : null}
            <button
              onClick={() => handleDelete(item.name)}
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
