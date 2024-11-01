// src/app/api/galleryItems/route.ts
import { NextResponse } from 'next/server';
import { load } from 'outstatic/server';

export async function GET() {
  try {
    const db = await load();
    const items = await db.find({ collection: 'galeriaitens', status: 'published' }, ['title', 'slug', 'coverImage', 'description', 'date']).toArray();

    // Mapeie os itens para o formato desejado
    const formattedItems = items.map((item: any) => ({
      title: item.title,
      slug: item.slug,
      coverImage: item.coverImage,
      description: item.description,
      date: item.date,
    }));

    return NextResponse.json(formattedItems);
  } catch (error) {
    console.error("Error fetching gallery items:", error);
    return NextResponse.error();
  }
}
