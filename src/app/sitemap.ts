import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // Fetch all software to generate sitemap URLs
  const res = await fetch(`${url}/rest/v1/post?select=id`, {
    headers: { apikey: key!, Authorization: `Bearer ${key}` }
  });
  
  const softwares = res.ok ? await res.json() : [];

  const softwareEntries: MetadataRoute.Sitemap = softwares.map((s: any) => ({
    url: `https://busca.software/software/${s.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: 'https://busca.software',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...softwareEntries,
  ]
}
