/**
 * Outstatic Configuration
 * 
 * This configuration file sets up Outstatic CMS for managing blog content.
 * Outstatic provides a user-friendly admin interface at /outstatic for creating
 * and editing blog posts with SEO metadata.
 * 
 * Documentation: https://outstatic.com/docs
 */

/**
 * @type {import('outstatic').OutstaticConfig}
 */
const outstaticConfig = {
  // Repository name (format: "owner/repo")
  repoSlug: 'Henry-Family/patriot-heavy-ops',
  
  // Branch where content will be stored
  repoBranch: 'dev',
  
  // Path where content files are stored
  contentPath: 'content',
  
  // Collections define different content types
  collections: [
    {
      name: 'posts',
      title: 'Blog Posts',
      slug: 'posts',
      description: 'Blog posts and articles',
      // Fields available for each post
      fields: [
        {
          name: 'title',
          type: 'string',
          label: 'Title',
          required: true
        },
        {
          name: 'publishedAt',
          type: 'datetime',
          label: 'Published Date',
          required: true
        },
        {
          name: 'description',
          type: 'string',
          label: 'Description',
          description: 'SEO description (150-160 characters recommended)',
          required: true
        },
        {
          name: 'author',
          type: 'object',
          label: 'Author',
          fields: [
            {
              name: 'name',
              type: 'string',
              label: 'Name'
            },
            {
              name: 'picture',
              type: 'string',
              label: 'Picture URL'
            }
          ]
        },
        {
          name: 'coverImage',
          type: 'string',
          label: 'Cover Image URL',
          description: 'Main image for the post (1200x630px recommended for OG image)'
        },
        {
          name: 'tags',
          type: 'array',
          label: 'Tags',
          of: { type: 'string' }
        },
        {
          name: 'status',
          type: 'string',
          label: 'Status',
          options: ['draft', 'published'],
          default: 'draft'
        }
      ]
    },
    {
      name: 'pages',
      title: 'Pages',
      slug: 'pages',
      description: 'Static pages like About, Contact, etc.',
      fields: [
        {
          name: 'title',
          type: 'string',
          label: 'Title',
          required: true
        },
        {
          name: 'description',
          type: 'string',
          label: 'Description',
          description: 'SEO description',
          required: true
        },
        {
          name: 'slug',
          type: 'string',
          label: 'URL Slug',
          required: true
        }
      ]
    }
  ],
  
  // Monorepo configuration (if applicable)
  monorepoPath: '',
  
  // Session configuration
  session: {
    // Session secret will be generated automatically or read from OUTSTATIC_SESSION_SECRET env var
    secret: process.env.OUTSTATIC_SESSION_SECRET || ''
  }
};

export default outstaticConfig;

