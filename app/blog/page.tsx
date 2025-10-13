/**
 * Blog Index Page
 * 
 * This page displays a list of all published blog posts.
 * Posts are fetched from the Outstatic content directory.
 */

import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getDocuments } from 'outstatic/server';

export const metadata: Metadata = {
  title: 'Blog | Patriot Heavy Ops',
  description: 'Connect contractors with vetted heavy equipment operators (military-trained) for construction and industrial projects. Read our latest articles and updates.',
  openGraph: {
    title: 'Blog | Patriot Heavy Ops',
    description: 'Connect contractors with vetted heavy equipment operators (military-trained) for construction and industrial projects. Read our latest articles and updates.',
    type: 'website',
  },
};

interface Post {
  slug: string;
  title: string;
  publishedAt: string;
  description: string;
  coverImage?: string;
  author?: {
    name: string;
    picture?: string;
  };
  tags?: string[];
  status: string;
}

export default async function BlogPage() {
  const posts = getDocuments('posts', [
    'title',
    'publishedAt',
    'description',
    'slug',
    'coverImage',
    'author',
    'tags',
    'status',
  ]) as Post[];

  // Filter only published posts and sort by date
  const publishedPosts = posts
    .filter((post) => post.status === 'published')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-gray-600 text-lg">
          Articles, tutorials, and updates from the Patriot Heavy Ops team.
        </p>
      </div>

      {publishedPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No posts yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {publishedPosts.map((post) => (
            <article
              key={post.slug}
              className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <Link href={`/blog/${post.slug}`}>
                {post.coverImage && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2 hover:text-blue-600">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-gray-700 mb-4">{post.description}</p>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

