import AffiliateBanner from "@/components/AffiliateBanner";
import ContentGrid from "@/components/content-grid";
import markdownToHtml from "@/lib/markdownToHtml";
import { InstagramIcon } from "lucide-react";
import Image from "next/image";
import { load } from "outstatic/server";

export const revalidate = 60;

export default async function Index() {
  const { content, allPosts, otherCollections, otherPageElements } =
    await getData();

  const { bannerImagem, coverImage, instagram }: any = otherPageElements.find(
    ({ slug }) => slug === "home"
  );

  return (
    <>
      <div className="flex flex-col w-full h-full overflow-hidden mb-16 md:mb-28 bg-gradient-to-b from-[#cef1ff79] via-[#43c3ff60] to-[#0a91ff4d]">
        <div className="w-full h-auto mx-0 z-0 top-0 flex justify-center items-center hover:scale-[1.02] transition-all duration-700 ease-in animate-in fill-mode-backwards">
          <Image
            src={coverImage ? coverImage : bannerImagem}
            alt="Banner Geu"
            width={2000}
            height={1000}
            className="h-full object-cover"
          />
        </div>
        <section className="mb-16 md:min-h-[calc(100vh-256px)] items-center flex z-10 backdrop-blur-lg bg-[#294b7210] p-4 rounded-b-lg gap-x-8 animate-in fill-mode-backwards delay-100">
          <div
            className="prose lg:prose-2xl home-intro prose-outstatic home-hero-fade"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          {instagram && (
            <div className="flex flex-col justify-center items-center gap-y-2 self-start bg-[#9e7a4456] py-3 px-3 sm:px-6 rounded-lg">
              <p className="text-center text-xl font-semibold mb-2 sm:mb-8 underline underline-offset-2">Redes Sociais</p>
              <a
                className="flex items-center gap-2 mx-auto mt-8 mb-4 md:mb-0 md:mt-0"
                href={instagram}
                target="_blank"
                title="Instagram"
                rel="noopener noreferrer"
              >
                <InstagramIcon width={50} height={50} className="max-sm:w-8 max-sm:h-8" />
              </a>
            </div>
          )}
        </section>
      </div>
      <div className="animate-fade-in delay-1000 opacity-0 duration-500">
        {allPosts.length > 0 && (
          <ContentGrid
            title="Postagens Recentes"
            items={allPosts}
            collection="postagens"
            priority
            viewAll
          />
        )}
        {Object.keys(otherCollections).filter((c) => c !== "galeriaitens").map((collection) => {
          if (!collection.length) return null;
          return (
            <ContentGrid
              key={collection}
              title={collection}
              items={otherCollections[collection]}
              collection={collection}
              viewAll
            />
          );
        })}
      </div>
    </>
  );
}

async function getData() {
  const db = await load();

  // get content for the homepage
  const page = await db
    .find({ collection: "pages", slug: "home" }, ["content"])
    .first();

  const otherPageElements = await db
    .find({ collection: "pages" }, [
      "bannerImagem",
      "slug",
      "collection",
      "coverImage",
      "instagram",
    ])
    .toArray();

  // convert markdown to html
  const content = await markdownToHtml(page.content);

  // get all posts. Example of fetching a specific collection
  const allPosts = await db
    .find({ collection: "postagens", status: "published" }, [
      "title",
      "publishedAt",
      "slug",
      "coverImage",
      "description",
      "tags",
    ])
    .sort({ publishedAt: -1 })
    .limit(3)
    .toArray();

  // get remaining collections
  const collections = await db
    .find(
      {
        // $nor is an operator that means "not or"
        $nor: [{ collection: "postagens" }, { collection: "pages" }],
        status: "published",
      },
      [
        "collection",
        "title",
        "publishedAt",
        "slug",
        "coverImage",
        "description",
      ]
    )
    .sort({ publishedAt: -1 })
    .limit(3)
    .toArray();

  // group remaining collections by collection
  const otherCollections = collections.reduce<{
    [key: string]: (typeof collections)[0][];
  }>((acc, item) => {
    if (!acc[item.collection]) {
      acc[item.collection] = [];
    }

    acc[item.collection].push(item);

    return acc;
  }, {});

  return {
    content,
    allPosts,
    otherCollections,
    otherPageElements,
  };
}
