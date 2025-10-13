/**
 * Blog Post Page
 *
 * This page displays individual blog posts with full content and SEO metadata.
 * Posts are fetched from the Outstatic content directory.
 */

import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getDocumentBySlug, getDocuments } from "outstatic/server"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface Post {
  slug: string
  title: string
  publishedAt: string
  description: string
  content: string
  coverImage?: string
  author?: {
    name: string
    picture?: string
  }
  tags?: string[]
  status: string
}

interface PageProps {
  params: {
    slug: string
  }
}

// Generate static params for all posts
export async function generateStaticParams() {
  const posts = getDocuments("posts", ["slug"]) as Post[]
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const post = getDocumentBySlug("posts", params.slug, [
    "title",
    "description",
    "coverImage",
    "publishedAt",
    "author",
  ]) as Post

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: `${post.title} | Patriot Heavy Ops`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
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
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = getDocumentBySlug("posts", params.slug, [
    "title",
    "publishedAt",
    "description",
    "content",
    "coverImage",
    "author",
    "tags",
    "status",
  ]) as Post

  if (!post || post.status !== "published") {
    notFound()
  }

  return (
    <article className="container mx-auto max-w-4xl px-4 py-12">
      {/* Back to blog link */}
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center text-blue-600 hover:text-blue-800"
      >
        <svg
          className="mr-2 h-4 w-4"
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
        <div className="relative mb-8 h-64 w-full overflow-hidden rounded-lg md:h-96">
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
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">{post.title}</h1>

        <div className="mb-4 flex items-center gap-4 text-gray-600">
          {post.author && (
            <div className="flex items-center gap-2">
              {post.author.picture && (
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
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
            {new Date(post.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {post.description && (
          <p className="border-l-4 border-blue-500 pl-4 text-xl italic leading-relaxed text-gray-700">
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
      <footer className="mt-12 border-t pt-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg
            className="mr-2 h-4 w-4"
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
  )
}
