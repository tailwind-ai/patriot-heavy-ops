/**
 * Blog Post Page
 * 
 * This page displays individual blog posts with full content and SEO metadata.
 * Posts are fetched from the Outstatic content directory.
 */

import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDocumentBySlug, getDocuments } from 'outstatic/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Post {
  slug: string;
  title: string;
  publishedAt: string;
  description: string;
  content: string;
  coverImage?: string;
  author?: {
    name: string;
    picture?: string;
  };
  tags?: string[];
  status: string;
}

interface PageProps {
  params: {
    slug: string;
  };
}

// Generate static params for all posts
export async function generateStaticParams() {
  const posts = getDocuments('posts', ['slug']) as Post[];
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = getDocumentBySlug('posts', params.slug, [
    'title',
    'description',
    'coverImage',
    'publishedAt',
    'author',
  ]) as Post;

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | Patriot Heavy Ops`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: post.author?.name ? [post.author.name] : undefined,
      images: post.coverImage
        ? [
            {
              url: post.coverImage,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = getDocumentBySlug('posts', params.slug, [
    'title',
    'publishedAt',
    'description',
    'content',
    'coverImage',
    'author',
    'tags',
    'status',
  ]) as Post;

  if (!post || post.status !== 'published') {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Back to blog link */}
      <Link
        href="/blog"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Blog
      </Link>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Post Header */}
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
        
        <div className="flex items-center gap-4 text-gray-600 mb-4">
          {post.author && (
            <div className="flex items-center gap-2">
              {post.author.picture && (
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={post.author.picture}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <span className="font-medium">{post.author.name}</span>
            </div>
          )}
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {post.description && (
          <p className="text-xl text-gray-700 leading-relaxed border-l-4 border-blue-500 pl-4 italic">
            {post.description}
          </p>
        )}
      </header>

      {/* Post Content */}
      <div className="prose prose-lg max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t">
        <Link
          href="/blog"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Blog
        </Link>
      </footer>
    </article>
  );
}

