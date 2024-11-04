import BookCard from '@/components/BookCard'
import BooksSection from '@/components/booksSection'
import ContentGrid from '@/components/content-grid'
import DocHero from '@/components/doc-hero'
import Galery from '@/components/galery'
import MDXComponent from '@/components/mdx/mdx-component'
import MediaCard from '@/components/mediaCard'
import MDXServer from '@/lib/mdx-server'
import { absoluteUrl, ogUrl } from '@/lib/utils'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { OstDocument } from 'outstatic'
import { getCollections, load } from 'outstatic/server'

type Book = {
  tags?: { value: string; label: string }[];
  autorEncarnado: string;
  autorDesencarnado: string;
  dataDaPublicacao: string;
  sinopse: string;
  linkParaComprar: string;
  imagemDoLivro: string;
  quantidadeDePaginas: string;
  precoNaInternet: string;
  linkParaSolicitar: string;
} & OstDocument;
type Document = {
  tags: { value: string; label: string }[],
} & OstDocument

interface Params {
  params: {
    slug: string
  }
}

export async function generateMetadata(params: Params): Promise<Metadata> {
  const { doc, moreDocs } = await getData(params)

  if (!doc) {
    return {
      title: `${moreDocs.collection} - Grupo Espírita União`,
      description: `Exibição da página: ${moreDocs.collection}`,
      openGraph: {
        title: `${moreDocs.collection} - Grupo Espírita União`,
        description: `Exibição da página: ${moreDocs.collection}`,
        type: 'article',
        locale: "pt_BR",
        images: [
            {
              url: `${moreDocs?.docs[0].coverImage ? `${moreDocs?.docs[0].coverImage}` : moreDocs?.books[0]?.coverImage}`,
              width: 1640,
              height: 856,
              alt: `${moreDocs.docs[0].title ? `${moreDocs.docs[0].title}` : moreDocs.books[0]?.title}`
            },
            {
              url: `${moreDocs?.docs[0].coverImage ? `${moreDocs?.docs[0].coverImage}` : moreDocs?.books[0]?.coverImage}`,
              width: 1600,
              height: 800,
              alt: `${moreDocs.docs[0].title ? `${moreDocs.docs[0].title}` : moreDocs.books[0]?.title}`
            },
            {
              url: `${moreDocs?.docs[0].coverImage ? `${moreDocs?.docs[0].coverImage}` : moreDocs?.books[0]?.coverImage}`,
              width: 800,
              height: 800,
              alt: `${moreDocs.docs[0].title ? `${moreDocs.docs[0].title}` : moreDocs.books[0]?.title}`
            }
        ]
      }
    }
  }

  //@ts-ignore
  const imageCoverSource = doc && doc.coverImage ? `${doc.coverImage}` : `${doc.itensGalery[0].coverImage}` ? `${doc.itensGalery[0].coverImage}` : `${doc.books[0].coverImage}`

  return {
    title: doc.title,
    description: doc.description,
    openGraph: {
      title: doc.title,
      description: doc.description,
      type: 'article',
      url: absoluteUrl(`/${doc.collection}/${doc.slug}`),
      images: [
        {
          url: imageCoverSource,
          width: 1200,
          height: 630,
          alt: doc.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: doc.title,
      description: doc.description,
      images: imageCoverSource
    }
  }
}

export default async function Document(params: Params) {
  const { doc, moreDocs } = await getData(params)

  if (!doc) {
    const { docs, collection, books } = moreDocs
    return (
      <div className="pt-24 mb-16 animate-fade-up opacity-0">
        {docs.length > 0 && params.params.slug[0] !== 'biblioteca' ? (
          <ContentGrid
            title={`Você está em: ${collection}`}
            items={docs}
            collection={collection}
          />
        ) : (
          <BooksSection
            title={`Bem vindo a ${collection} Virtual GEU`}
            books={books as unknown as Book[]}
            collection={collection}
          />
        )}
      </div>
    )
  }

  if (doc.collection === 'pages') {
    const titleGalery = `${doc.itensGalery.length > 1 ? 'Temos mais de ' : 'Temos '} ${doc.itensGalery.length > 1 ? doc.itensGalery.length - 1 : "um"} registro de ${doc.itensGalery.length > 1 ? 'Eventos' : 'Evento'} para compartilhar com você`
    return (
      <article className="mb-32 py-8">
        <DocHero {...doc} />
        <div className="prose md:prose-xl prose-outstatic animate-fade-up opacity-0 my-10">
          <MDXComponent content={doc.content} />
        </div>
        {doc.itensGalery.length > 0 && (
          <Galery
            title={titleGalery}
            items={doc.itensGalery}
            collection={"galeriaitens"}
          />
        )}
      </article>
    )
  }

  return (
    <>
      <article className="mb-32">
        <DocHero {...doc} />
        <div className="max-w-2xl mx-auto">
          <div className="prose prose-outstatic">
            {doc.collection === 'biblioteca' && (
              /*@ts-ignore*/
              <BookCard book={doc.books} />
            )}
            <MDXComponent content={doc.content} />
            {
              doc.collection === 'galeriaitens' && (
                <MediaCard slug={doc.slug} />
              )
            }
          </div>
        </div>
      </article>
      <div className="mb-16">
        {moreDocs.length > 0 && (
          <ContentGrid
            title={`Mais ${doc.collection}`}
            items={moreDocs}
            collection={doc.collection}
          />
        )}
      </div>
    </>
  )
}

async function getData({ params }: Params) {
  const db = await load()
  let slug = params.slug[1]
  let collection = params.slug[0]

  // check if we have two slugs, if not, we are on a collection archive or a page
  if (!params.slug || params.slug.length !== 2) {
    if (collection !== 'pages') {
      const docs = await db
        .find({ collection, status: 'published' }, [
          'title',
          'slug',
          'coverImage',
          'description',
          'tags'
        ])
        .sort({ publishedAt: -1 })
        .toArray()

        const books = await db.find({ collection: 'biblioteca' }, ['title', 'slug', 'coverImage', 'description','autorEncarnado', 'autorDesencarnado', 'dataDaPublicacao', 'sinopse', 'linkParaComprar', 'linkDoLivroEmPdf', 'imagemDoLivro', 'quantidadeDePaginas', 'precoNaInternet', 'linkParaSolicitar']).sort({ publishedAt: -1 }).toArray()

      // if we have docs, we are on a collection archive
      if (docs.length) {
        return {
          doc: undefined,
          moreDocs: {
            docs,
            collection,
            books
          }
        }
      }
    }

    // if we don't have docs, we are on a page
    slug = params.slug[0]
    collection = 'pages'
  }

  // get the document
  const doc = await db
    .find<Document>({ collection, slug }, [
      'collection',
      'title',
      'publishedAt',
      'description',
      'slug',
      'author',
      'content',
      'coverImage',
      'tags'
    ])
    .first()

  if (!doc) {
    notFound()
  }

  const content = await MDXServer(doc.content)

  const books = collection === 'biblioteca' ? await db.find({collection: 'biblioteca', slug: params.slug[1], status: 'published'},['title', 'slug', 'coverImage', 'description','autorEncarnado', 'autorDesencarnado', 'dataDaPublicacao', 'sinopse', 'linkParaComprar', 'linkDoLivroEmPdf', 'imagemDoLivro', 'quantidadeDePaginas', 'precoNaInternet', 'linkParaSolicitar']).first() : []
  
  const itensGalery = slug === 'galeria-geu' ? await db.find({collection: 'galeriaitens', status: 'published'}, ['title', 'slug', 'coverImage', 'description', 'date']).toArray() : []

  console.log("Itens server: ", itensGalery)


  const moreDocs =
    collection === 'pages'
      ? []
      : await db
          .find(
            {
              collection: params.slug[0],
              slug: { $ne: params.slug[1] },
              status: 'published'
            },
            ['title', 'slug', 'coverImage', 'description']
          )
          .sort({ publishedAt: -1 })
          .toArray()

  return {
    doc: {
      ...doc,
      content,
      books,
      itensGalery
    },
    moreDocs,
  }
}

export async function generateStaticParams() {
  const db = await load()
  const collections = getCollections().filter(
    (collection) => collection !== 'pages'
  )

  // get all documents, except those in the posts collection and the home page
  // as we have a specific route for them (/posts)
  const items = await db
    .find(
      {
        $nor: [{ collection: 'postagens' }, { collection: 'pages', slug: 'home' }],
        status: 'published'
      },
      ['collection', 'slug']
    )
    .toArray()

  // pages should be at the root level
  const slugs = items.map(({ collection, slug }) => ({
    slug: collection === 'pages' ? [slug] : [collection, slug]
  }))

  collections.forEach((collection) => {
    slugs.push({
      slug: [collection]
    })
  })

  return slugs
}
