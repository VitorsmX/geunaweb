"use client";

import { useEffect, useState } from "react";

interface FileItem {
  url: string;
  public_id: string;
  type: string;
}

const UploadComponent: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  const [files, setFiles] = useState<FileItem[]>([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("/api/files");
        if (!response.ok) throw new Error("Failed to fetch files");
        const data: FileItem[] = await response.json();
        setFiles(data);
      } catch (error) {
        console.error("Error fetching files:", error);
        setMessage("Failed to load files.");
      }
    };

    fetchFiles();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] || null);
  };

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Checando se o arquivo já existe
      const existingFile = files.find((item) => item.public_id === file.name);

      if (existingFile) {
        setMessage("File already exists. Please upload a different file.");
        return;
      }

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setFiles((prevFiles) => [
        ...prevFiles,
        { url: data.secure_url, public_id: data.public_id, type: file.type },
      ]);
      setMessage("Upload successful!");
      setFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Upload failed.");
    }
  };

  const handleDelete = async (public_id: string) => {
    const existingFile = files.find((file) => file.public_id === public_id);
    if (!existingFile) {
      setMessage("File already deleted.");
      return;
    }

    try {
      const response = await fetch(`/api/delete/${public_id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Deletion failed");
      }

      setFiles((prevFiles) => prevFiles.filter((file) => file.public_id !== public_id));
      setMessage("File deleted successfully.");
    } catch (error) {
      console.error("Deletion error:", error);
      setMessage("Deletion failed.");
    }
  };

  return (
    <div className="max-w-full mx-auto bg-white rounded-lg shadow-md p-6 mt-10 transition-transform transform hover:scale-105">
      <h2 className="text-2xl font-semibold text-center mb-4">Upload de Imagem ou Vídeo</h2>
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
