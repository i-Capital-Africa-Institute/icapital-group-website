import { MetadataRoute } from 'next'
import { executeServerQuery } from '@/lib/serverApolloClient'
import { GET_ALL_PORTFOLIOS } from '@/graphql/portfolio/portfolio'

// Enable static generation with revalidation
export const revalidate = 3600 // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN
    ? `https://${process.env.NEXT_PUBLIC_DOMAIN}`
    : 'https://icapital.com'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/portfolios`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/eafs`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/eafs/previous-summit`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]

  // Dynamic portfolio pages
  try {
    const portfoliosData: any = await executeServerQuery(GET_ALL_PORTFOLIOS)
    const portfolios = portfoliosData?.portfolios || []
    
    const portfolioPages = portfolios.map((portfolio: any) => ({
      url: `${baseUrl}/portfolios/${portfolio.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    return [...staticPages, ...portfolioPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticPages
  }
}