import Image from "next/image";
import Link from "next/link";
import SoftwareLogo from "./SoftwareLogo";

export const revalidate = 0; // disabled cache to allow search

async function getSoftware(q: string, sort: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  let query = `${url}/rest/v1/post?select=id,name,description,rating,url,price,logo`;
  
  if (q) {
    // Basic ilike search on name
    query += `&name=ilike.*${encodeURIComponent(q)}*`;
  }
  
  if (sort === 'rating') {
    query += `&order=rating.desc.nullslast`;
  } else if (sort === 'popular') {
    query += `&order=id.desc`;
  } else {
    query += `&order=id.asc`;
  }
  
  query += `&limit=20`;

  const res = await fetch(query, {
    headers: { apikey: key!, Authorization: `Bearer ${key}` }
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function Home(props: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams?.q === 'string' ? searchParams.q : '';
  const sort = typeof searchParams?.sort === 'string' ? searchParams.sort : 'relevance';
  
  const software = await getSoftware(q, sort);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100">
      
      {/* --- NAVBAR --- */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            {/* Si no tienes el archivo logo.png en public/, esto fallará. Usa una fallback temporal o asegúrate de subirlo */}
            <div className="flex items-center text-[#113a5d]">
              <svg className="w-8 h-8 -mr-5 z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <circle cx="10" cy="10" r="7" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6" />
              </svg>
              <span className="font-extrabold text-2xl tracking-tight pl-5">busca.software</span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="/" className="hover:text-blue-600 transition-colors font-semibold text-blue-600">Directorio</Link>
            <Link href="/?q=ERP" className="hover:text-blue-600 transition-colors">Categorías</Link>
          </nav>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <main className="bg-white border-b border-slate-200 relative overflow-hidden">
        {/* Dynamic Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-blue-50 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[50%] bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-20 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]">
            Encuentra el software ideal <br className="hidden md:block" /> para hacer crecer tu negocio.
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            El directorio B2B de mayor confianza. Compara reseñas reales, precios y características de miles de herramientas SaaS.
          </p>

          {/* Search Bar (Functional Form) */}
          <form action="/" method="GET" className="max-w-3xl mx-auto relative group mb-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative flex items-center bg-white border border-slate-200 hover:border-blue-400 transition-colors rounded-xl overflow-hidden h-16 shadow-lg shadow-slate-200/50 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20">
              <svg className="w-6 h-6 text-slate-400 ml-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input 
                type="text" 
                name="q"
                defaultValue={q}
                placeholder="Ej. Obsidian, Notion, ClickUp..."
                className="flex-1 bg-transparent border-none py-3 px-5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-0 text-lg"
              />
              {sort && <input type="hidden" name="sort" value={sort} />}
              <button type="submit" className="h-12 px-8 mr-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md hover:shadow-lg transition-all">
                Buscar
              </button>
            </div>
          </form>
          
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 text-sm text-slate-500">
            <span className="font-semibold text-slate-600">Populares:</span>
            <Link href="/?q=Notion" className="bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 px-4 py-1.5 rounded-full font-medium transition-colors border border-slate-200 hover:border-blue-200">Notion</Link>
            <Link href="/?q=Obsidian" className="bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 px-4 py-1.5 rounded-full font-medium transition-colors border border-slate-200 hover:border-blue-200">Obsidian</Link>
            <Link href="/?q=Asana" className="bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 px-4 py-1.5 rounded-full font-medium transition-colors border border-slate-200 hover:border-blue-200">Gestión de Proyectos</Link>
          </div>
        </div>
      </main>

      {/* --- CONTENT LAYOUT --- */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col gap-8">
          
          {/* List Content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 border-b border-slate-200 pb-4 gap-4">
              <h2 className="text-2xl font-black text-slate-900">
                {q ? `Resultados para "${q}"` : 'Top Software B2B'}
              </h2>
              <form action="/" method="GET" className="flex items-center gap-3">
                <input type="hidden" name="q" value={q} />
                <label htmlFor="sort" className="text-sm font-semibold text-slate-500">Ordenar por:</label>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <select 
                      name="sort" 
                      id="sort"
                      defaultValue={sort}
                      className="appearance-none text-sm border border-slate-300 rounded-lg text-slate-700 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 py-2 pl-4 pr-10 font-medium cursor-pointer"
                    >
                      <option value="relevance">Relevancia</option>
                      <option value="rating">Mejor Valorados</option>
                      <option value="popular">Más Populares</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                  <button type="submit" className="text-sm font-bold bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors shadow-sm">Aplicar</button>
                </div>
              </form>
            </div>

            {software.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No se encontraron resultados</h3>
                <p className="text-slate-500">Intenta buscar con otros términos o elimina los filtros.</p>
                <Link href="/" className="inline-block mt-6 px-6 py-2.5 bg-blue-50 text-blue-600 font-bold rounded-lg hover:bg-blue-100 transition-colors">
                  Ver todos los softwares
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
                {software.map((item: any) => (
                  <div key={item.id} className="group bg-white border border-slate-200 rounded-[2rem] p-8 hover:-translate-y-2 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 flex flex-col gap-6 h-full relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    {/* Header: Logo & Title */}
                    <div className="flex items-start gap-5">
                      <div className="w-20 h-20 shrink-0 rounded-2xl bg-white flex items-center justify-center shadow-md border border-slate-100 overflow-hidden group-hover:scale-105 transition-transform">
                        <SoftwareLogo url={item.url} name={item.name} />
                      </div>
                      <div className="flex-1 pt-1">
                        <Link href={`/software/${item.id}`} className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 before:absolute before:inset-0">
                          {item.name}
                        </Link>
                        <div className="flex items-center gap-1 mt-2 relative z-10 bg-slate-50 inline-flex px-2.5 py-1 rounded-md border border-slate-100">
                          <span className="text-sm font-black text-slate-900">{item.rating || 'N/A'}</span>
                          <div className="flex text-yellow-400">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="flex-1 relative z-10 pointer-events-none">
                      <p className="text-slate-600 leading-relaxed line-clamp-3">
                        {item.description || 'Herramienta de software B2B para potenciar la productividad y el crecimiento de tu empresa.'}
                      </p>
                    </div>

                    {/* Pricing & CTA */}
                    <div className="w-full pt-6 mt-auto relative z-20 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-5">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Precio Inicial</span>
                        <span className="text-base font-black text-slate-900">{item.price || 'Consultar'}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Link href={`/software/${item.id}`} className="flex items-center justify-center py-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 text-slate-700 text-sm font-bold transition-all text-center">
                          Análisis
                        </Link>
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-sm font-bold transition-all shadow-md text-center group/btn">
                          Sitio Web
                          <svg className="w-4 h-4 opacity-80 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {software.length > 0 && (
              <div className="flex items-center justify-center gap-2 mt-16">
                <button className="w-12 h-12 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-colors disabled:opacity-50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <button className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-600/20">1</button>
                <button className="w-12 h-12 rounded-xl border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 font-bold transition-colors">2</button>
                <span className="text-slate-400 px-2">...</span>
                <button className="w-12 h-12 rounded-xl border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
                </button>
              </div>
            )}

          </div>
        </div>
      </section>
    </div>
  );
}
