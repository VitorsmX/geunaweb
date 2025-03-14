import Image from 'next/image';

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#00000010] bg-opacity-10 z-50">
      <div className="flex flex-col items-center justify-center space-y-4 bg-[#ffffff50] rounded-full p-[150px]">
        <div className="animate-pulse">
          <Image
            src="https://www.geuuniao.com.br/images/logo-geu-transp.png"
            alt="Logo Geu"
            width={100}
            height={100}
            quality={40}
            className="max-w-[100px] max-h-[100px]"
          />
        </div>
        <p className="text-sky-600 text-lg">Carregando...</p>
      </div>
    </div>
  );
}
