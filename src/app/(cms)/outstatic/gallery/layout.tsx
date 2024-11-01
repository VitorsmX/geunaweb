import "@/styles/index.css";
import { notFound } from "next/navigation";
import { Outstatic } from 'outstatic'

export default async function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {

    const ostData = Outstatic()
    const session = await ostData.then((data) => data.session)
    if(!session) {
      notFound()
    }

  return (
    <>
    <section className="grid grid-cols-7 grid-rows-1 max-md:grid-rows-7 w-full h-full overflow-hidden font-sans">
      <nav className="flex flex-col h-screen col-span-1 bg-slate-200 transition-all max-md:flex-row max-md:col-span-7 max-md:row-span-1 max-md:h-fit">
        <div className="flex justify-center bg-zinc-600 text-zinc-50 font-semibold text-xl w-full px-4 py-2 max-md:w-fit">
          <a href="/outstatic/gallery" className="cursor-pointer">
            <h3>Gerenciar Galeria</h3>
          </a>
        </div>
        <ul className="flex flex-col gap-y-4 text-zinc-50 max-md:w-full">
          <li className="flex justify-center px-4 py-2 w-full h-fit max-w-full bg-blue-500 cursor-pointer ">
            <a href="/outstatic/gallery/media-uploader">Inserir Mídia</a>
          </li>
        </ul>
      </nav>
      {children}
    </section>
    </>
  );
}
