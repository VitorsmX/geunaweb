import Image from 'next/image';

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="animate-pulse">
          <Image
            src="https://geunaweb.vercel.app/images/logo-geu-transp.png"
            alt="Logo Geu"
            width={100}
            height={100}
            quality={50}
            className="max-w-[100px] max-h-[100px]"
          />
        </div>
        <p className="text-white text-lg">Carregando...</p>
      </div>
    </div>
  );
}
