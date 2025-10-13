# Blog/CMS Setup Guide (Outstatic)

Patriot Heavy Ops now includes Outstatic, a file-based CMS for Next.js that provides an easy-to-use admin interface for managing blog content with SEO features.

## Quick Start

### 1. Install Dependencies

```bash
npm install outstatic react-markdown remark-gfm gray-matter
```

### 2. Set Up GitHub OAuth App

Outstatic uses GitHub for authentication. Create a GitHub OAuth App:

1. Go to https://github.com/settings/applications/new
2. Fill in the details:
   - **Application name**: `Patriot Heavy Ops CMS`
   - **Homepage URL**: `http://localhost:3000` (for development)
   - **Authorization callback URL**: `http://localhost:3000/api/outstatic/callback`
3. Click "Register application"
4. Copy your **Client ID** and generate a **Client Secret**

### 3. Configure Environment Variables

Add these to your `.env.local` file:

```bash
# Outstatic/GitHub OAuth
OST_GITHUB_ID=your_github_client_id
OST_GITHUB_SECRET=your_github_client_secret
OST_TOKEN_SECRET=your_random_token_secret_here
OUTSTATIC_SESSION_SECRET=your_random_session_secret_here
```

Generate random secrets:
```bash
# macOS/Linux
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 4. Access the Admin Dashboard

1. Start your Next.js development server:
   ```bash
   npm run dev
   ```

2. Navigate to: http://localhost:3000/outstatic

3. Sign in with your GitHub account

4. Start creating content!

## Using Outstatic

### Creating a Blog Post

1. Go to `/outstatic` in your browser
2. Click "Posts" collection
3. Click "New Post"
4. Fill in the fields:
   - **Title**: Post title (used in SEO)
   - **Description**: Meta description (150-160 characters for SEO)
   - **Cover Image**: Hero image URL (1200x630px recommended)
   - **Author**: Author name and picture
   - **Tags**: Categories/topics
   - **Status**: `draft` or `published`
5. Write your content in the Markdown editor
6. Click "Save" or "Publish"

### SEO Features

Outstatic automatically generates:
- Meta title and description
- Open Graph tags (Facebook, LinkedIn)
- Twitter Card tags
- Structured data for articles
- Sitemap-friendly URLs

All fields in the admin UI map to proper SEO metadata.

### Content Storage

Content is stored as Markdown files in:
```
content/
  posts/
    my-first-post.md
    another-post.md
  pages/
    about.md
```

These files are:
- ✅ Version controlled (Git)
- ✅ Human-readable
- ✅ Easy to migrate
- ✅ No database required

## What Was Added

The following files have been created:

1. **`outstatic.config.js`** - Outstatic configuration
2. **`app/api/outstatic/[[...ost]]/route.ts`** - API endpoints for Outstatic
3. **`app/blog/page.tsx`** - Blog listing page
4. **`app/blog/[slug]/page.tsx`** - Individual blog post page
5. **`docs/BLOG-SETUP.md`** - This setup guide

## Production Deployment

### Environment Variables

Add to your production environment (Vercel, Netlify, etc.):
- `OST_GITHUB_ID`
- `OST_GITHUB_SECRET`
- `OST_TOKEN_SECRET`
- `OUTSTATIC_SESSION_SECRET`

### OAuth Callback

Update your GitHub OAuth App:
- **Homepage URL**: `https://patriot-heavy-ops.vercel.app` (or your domain)
- **Callback URL**: `https://patriot-heavy-ops.vercel.app/api/outstatic/callback`

### Access Control

By default, anyone with the OAuth credentials can access the admin. To restrict access:

1. Check the authenticated user in your API route
2. Implement role-based access control
3. Or use GitHub organization membership checks

## Resources

- **Outstatic Docs**: https://outstatic.com/docs
- **GitHub Repo**: https://github.com/avitorio/outstatic
- **Example Site**: https://outstatic.com/blog

## Troubleshooting

**Issue**: "Failed to authenticate"
- Check your OAuth credentials in `.env.local`
- Verify callback URL matches your GitHub OAuth App settings

**Issue**: "Content not showing"
- Ensure posts have `status: 'published'`
- Check that content is in the correct directory (`content/posts/`)

**Issue**: "Images not loading"
- Use absolute URLs for images
- Or set up proper image hosting (Cloudinary, Vercel Blob, etc.)

For more help, see the [Outstatic documentation](https://outstatic.com/docs).

