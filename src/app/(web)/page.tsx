import ContentGrid from "@/components/content-grid";
import markdownToHtml from "@/lib/markdownToHtml";
import Image from "next/image";
import { load } from "outstatic/server";

export default async function Index() {
  const { content, allPosts, otherCollections, otherPageElements } =
    await getData();

  const { bannerImagem }: any = otherPageElements.find(
    ({ slug }) => slug === "home"
  );

  return (
    <>
      <div className="flex flex-col w-full h-full overflow-hidden mb-16 md:mb-28">
        <div className="w-full h-auto mx-0 z-0 absolute top-0 right-0 left-0 max-sm:bottom-[60%] max-md:bottom-[67%] max-lg:bottom-[54%] max-xl:bottom-[58%] bottom-[56%] pb-96 sm:pb-56">
          <Image
            src={bannerImagem}
            alt="Logo Geu"
            width={2000}
            height={1000}
            className="h-full object-cover"
          />
        </div>
        <section className="mb-16 md:min-h-[calc(100vh-256px)] items-center flex z-10 backdrop-blur-sm bg-[#00000040] p-4 rounded-sm">
          <div
            className="prose lg:prose-2xl home-intro prose-outstatic home-hero-fade"
            dangerouslySetInnerHTML={{ __html: content }}
          />
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
        {Object.keys(otherCollections).map((collection) => {
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
    .find({ collection: "pages" }, ["bannerImagem", "slug", "collection"])
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
