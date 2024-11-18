import Link from "next/link";
import { getCollections, load } from "outstatic/server";
import { MobileMenu } from "./mobile-menu";
import { ThemeToggle } from "./theme-toggle";
import { buttonVariants } from "./ui/button";
import Image from "next/image";

export type MenuProps = {
  pages: {
    title: string;
    slug: string;
  }[];
  collections: string[];
};

const Header = async () => {
  const data = await getData();
  const { pages, collections } = data;

  return (
    <header className="py-4 fixed border-t md:bottom-auto md:top-0 w-full z-20 border-b bg-gradient-to-r from-[#84d7f8f8] via-[#579bf5ef] to-[#0084ffda]">
      <nav className="max-w-6xl mx-auto w-full layout flex items-center justify-between">
        <Link
          href="/"
          className="hover:text-slate-900 hover:dark:text-blue-200 px-5 underline-offset-2 font-semibold transition-all hover:scale-105 flex items-center duration-500 ease-in"
        >
          <Image
            src={"/images/logo-geu-transp.png"}
            alt="Logo Geu"
            width={40}
            height={40}
          />
          <span className="ml-2 text-zinc-900 font-primary">Grupo Espírita União <i className="font-secondary">(Página Oficial)</i></span>
        </Link>
        <ul className="hidden md:flex items-center justify-between space-x-3 text-xs md:space-x-4 md:text-base">
          {pages.map(({ title, slug }) => (
            <li key={slug}>
              <Link
                href={`/${slug}`}
                className={
                  buttonVariants({ variant: "ghost", size: "sm" }) +
                  " capitalize text-zinc-900"
                }
              >
                {title}
              </Link>
            </li>
          ))}
          {collections.map((collection) => (
            <li key={collection}>
              <Link
                href={`/${collection}`}
                className={
                  buttonVariants({ variant: "ghost", size: "sm" }) +
                  " capitalize text-zinc-900"
                }
              >
                {collection}
              </Link>
            </li>
          ))}
          <ThemeToggle />
        </ul>
        <MobileMenu pages={pages} collections={collections} />
      </nav>
    </header>
  );
};

async function getData() {
  const db = await load();

  // get all pages
  const pages = await db
    .find(
      {
        collection: "pages",
        slug: { $nin: ["home"] },
        status: "published",
      },
      ["title", "slug"]
    )
    .toArray();

  const collections = getCollections().filter(
    (collection) => (collection !== "pages" && collection !== "galeriaitens")
  );

  return {
    pages,
    collections,
  } as MenuProps;
}

export default Header;
