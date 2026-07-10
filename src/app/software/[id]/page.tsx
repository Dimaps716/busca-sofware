import SoftwareLogo from "../../SoftwareLogo";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 0; // disabled cache temporarily to see changes

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const software = await getSoftwareDetails(id);
  if (!software) return { title: 'No encontrado' };
  
  const content = software.content_json;
  return {
    title: `${content?.hero?.title || software.name} - Directorio`,
    description: content?.metaDescription || content?.hero?.description || software.description || `Información sobre ${software.name}`,
  };
}

async function getSoftwareDetails(id: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const res = await fetch(`${url}/rest/v1/post?id=eq.${id}&select=*`, {
    headers: { apikey: key!, Authorization: `Bearer ${key}` }
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.length > 0 ? data[0] : null;
}

async function getSuggestions(currentId: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const res = await fetch(`${url}/rest/v1/post?select=id,name,logo,rating,price&id=neq.${currentId}&limit=3`, {
    headers: { apikey: key!, Authorization: `Bearer ${key}` }
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function SoftwarePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const software = await getSoftwareDetails(id);

  if (!software) notFound();

  const content = software.content_json || {};
  const hero = content.hero || {};
  const overview = content.overview || {};
  const pricing = content.pricing || [];
  const reviews = content.reviews || [];
  const faq = content.faq || [];

  const suggestions = await getSuggestions(software.id);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-blue-200 selection:text-blue-900">
      
      {/* ── BARRA DE PROGRESO DE LECTURA (UI Trick) ── */}
      <div className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 w-full z-[60] origin-left scale-x-0 animate-pulse"></div>

      {/* ── NAVBAR GLASSMORPHISM ── */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <Link href="/" className="text-sm font-bold text-slate-600 hover:text-blue-600 flex items-center gap-2 transition-colors">
            <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-blue-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            </div>
            Volver al Directorio
          </Link>
          <a href={software.url} target="_blank" rel="noopener noreferrer"
             className="hidden md:flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 hover:bg-blue-600 text-white text-sm font-bold transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5">
            Visitar sitio oficial
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
          </a>
        </div>
      </header>

      {/* ── HERO SECTION DINÁMICO ── */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-blue-50 -z-10"></div>
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl -z-10 mix-blend-multiply opacity-70 animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl -z-10 mix-blend-multiply opacity-60 animate-pulse" style={{ animationDuration: '10s' }}></div>
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-10 items-center justify-center text-center md:text-left">
            
            {/* Logo con Animación Flotante */}
            <div className="flex-shrink-0 animate-[bounce_4s_infinite]">
              <div className="w-36 h-36 md:w-48 md:h-48 bg-white rounded-[2rem] shadow-2xl shadow-blue-900/10 flex items-center justify-center p-6 border border-white/50 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <SoftwareLogo url={software.url} name={software.name} />
              </div>
            </div>
            
            {/* Contenido del Hero */}
            <div className="flex-1 max-w-3xl">
              
              {/* Badges */}
              {hero.badges && hero.badges.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-6">
                  {hero.badges.map((badge: string, idx: number) => (
                    <span key={idx} className="px-3 py-1.5 bg-white shadow-sm rounded-full text-xs font-bold text-indigo-600 uppercase tracking-wider border border-indigo-100">
                      {badge}
                    </span>
                  ))}
                </div>
              )}
              
              <h1 className="text-4xl md:text-6xl font-black mb-6 text-slate-900 tracking-tight leading-[1.15]">
                {hero.title || software.name}
              </h1>
              
              <p className="text-lg md:text-2xl text-slate-600 mb-8 leading-relaxed font-medium">
                {hero.description || software.description}
              </p>
              
              {/* Rating & CTA */}
              <div className="flex flex-col sm:flex-row items-center gap-6 justify-center md:justify-start">
                {hero.rating && (
                  <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-5 py-3 rounded-2xl border border-slate-200/50 shadow-sm">
                    <span className="text-3xl font-black text-slate-900">{hero.rating}</span>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-0.5">
                        {(() => {
                          const ratingNum = parseFloat(hero.rating);
                          if (isNaN(ratingNum)) return null;
                          return [...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-4 h-4 ${i < Math.floor(ratingNum) ? 'text-yellow-400' : 'text-slate-300'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                          ));
                        })()}
                      </div>
                      <span className="text-xs font-semibold text-slate-500">Puntuación Global</span>
                    </div>
                  </div>
                )}
                
                <a href={software.url} target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1">
                  Visitar Sitio Oficial
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTENIDO PRINCIPAL (FORMATO BLOG) ── */}
      <section className="max-w-7xl mx-auto px-6 py-12 -mt-12">
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Columna Central de Lectura */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* Análisis Principal */}
            {overview.content && (
              <article className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 md:p-12">
                <div className="prose prose-lg md:prose-xl prose-slate max-w-none 
                                prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900 
                                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-4 prose-h2:border-b prose-h2:border-slate-100
                                prose-h3:text-2xl prose-p:leading-relaxed prose-p:text-slate-600
                                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                                prose-strong:text-slate-900 prose-strong:font-bold
                                prose-img:rounded-2xl prose-img:shadow-lg prose-img:w-full prose-img:border prose-img:border-slate-100
                                prose-ul:text-slate-600 prose-li:marker:text-blue-500">
                  <div dangerouslySetInnerHTML={{ __html: overview.content }} />
                </div>
              </article>
            )}

            {/* Capturas de Pantalla (Estilo Galería) */}
            {overview.images && overview.images.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-black text-slate-900">Una mirada por dentro</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {overview.images.map((src: string, idx: number) => (
                    <div key={idx} className="group relative rounded-2xl overflow-hidden bg-slate-100 aspect-video shadow-md border border-slate-200">
                      <img src={src} alt="Captura de pantalla" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <span className="text-white font-medium text-sm">Ver imagen</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ficha Técnica (Estilo Grid Moderno) */}
            {overview.facts && overview.facts.length > 0 && (
              <div className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-[2rem] p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
                  <span className="p-3 bg-white/10 rounded-xl">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </span>
                  Datos Clave
                </h2>
                <div className="grid sm:grid-cols-2 gap-6 relative z-10">
                  {overview.facts.map((fact: string, idx: number) => {
                    const [label, ...rest] = fact.split(':');
                    const value = rest.join(':').trim();
                    return (
                      <div key={idx} className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:bg-white/20 transition-colors">
                        <span className="text-blue-300 text-xs font-bold uppercase tracking-wider block mb-1">{label}</span>
                        <p className="font-semibold text-lg">{value || fact}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Planes y Precios (Tarjetas Dinámicas) */}
            {pricing && pricing.length > 0 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-black text-slate-900">Planes y Precios</h2>
                  <p className="text-slate-500 mt-2">Encuentra el plan perfecto para ti</p>
                </div>
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  {pricing.map((plan: any, idx: number) => (
                    <div key={idx} className={`relative rounded-[2rem] p-8 transition-all duration-300 hover:-translate-y-2 ${
                      plan.isFeatured 
                        ? 'bg-blue-600 text-white shadow-2xl shadow-blue-900/20' 
                        : 'bg-white border-2 border-slate-100 text-slate-900 shadow-lg hover:border-blue-200'
                    }`}>
                      {plan.isFeatured && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-lg">
                          Recomendado
                        </div>
                      )}
                      <h3 className={`text-xl font-bold ${plan.isFeatured ? 'text-blue-100' : 'text-slate-500'}`}>{plan.planName}</h3>
                      <div className="mt-4 mb-8">
                        <p className="text-4xl font-black">{plan.price}</p>
                      </div>
                      <ul className="space-y-4">
                        {plan.features?.map((feature: string, fIdx: number) => (
                          <li key={fIdx} className="flex items-start gap-3">
                            <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${plan.isFeatured ? 'bg-blue-500/50' : 'bg-blue-100'}`}>
                              <svg className={`w-3.5 h-3.5 ${plan.isFeatured ? 'text-white' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                            </div>
                            <span className={plan.isFeatured ? 'text-blue-50' : 'text-slate-600 font-medium'}>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Opiniones (Formato Conversacional) */}
            {reviews && reviews.length > 0 && (
              <div className="space-y-8">
                <h2 className="text-3xl font-black text-slate-900">¿Qué dicen los usuarios?</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {reviews.map((review: any, idx: number) => (
                    <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative">
                      <div className={`absolute -top-4 -left-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white
                        ${review.type === 'positive' ? 'bg-green-100 text-green-600' : review.type === 'negative' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                        {review.type === 'positive' ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                        ) : review.type === 'negative' ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                        )}
                      </div>
                      <p className="text-slate-600 italic font-medium leading-relaxed pt-2">"{review.text}"</p>
                      <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">{review.author || 'Usuario Anónimo'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ (Accordion Elegante) */}
            {faq && faq.length > 0 && (
              <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 md:p-12">
                <h2 className="text-3xl font-black text-slate-900 mb-8">Preguntas Frecuentes</h2>
                <div className="space-y-4">
                  {faq.map((item: any, idx: number) => (
                    <details key={idx} className="group border-b border-slate-100 pb-4 last:border-0 last:pb-0 [&_summary::-webkit-details-marker]:hidden">
                      <summary className="flex items-center justify-between font-bold text-lg text-slate-800 cursor-pointer hover:text-blue-600 transition-colors py-2">
                        {item.question}
                        <span className="relative flex-shrink-0 ml-4 w-6 h-6 flex items-center justify-center bg-blue-50 text-blue-600 rounded-full group-open:bg-slate-100 group-open:text-slate-500">
                          <svg className="w-4 h-4 transition-transform duration-300 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/></svg>
                        </span>
                      </summary>
                      <div className="pt-4 text-slate-600 leading-relaxed prose prose-blue" dangerouslySetInnerHTML={{ __html: item.answer }} />
                    </details>
                  ))}
                </div>
              </div>
            )}
            
            {/* Fallback to original HTML si JSON está vacío (Rediseñado) */}
            {Object.keys(content).length === 0 && software.content_html && (
              <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 md:p-12 prose prose-lg prose-slate max-w-none">
                <div dangerouslySetInnerHTML={{ __html: software.content_html }} />
              </div>
            )}

          </div>
          
          {/* ── SIDEBAR STICKY (Oportunidad para Publicidad) ── */}
          <aside className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-[100px] space-y-8">
              
              {/* Tarjeta de Resumen Rápido */}
              <div className="bg-white rounded-[2rem] shadow-lg border border-slate-100 p-8 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                <h3 className="text-xl font-black text-slate-900 mb-6">En resumen</h3>
                
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Precio Base</span>
                      <p className="text-slate-900 font-bold text-lg">{software.price || 'Consultar sitio'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Valoración</span>
                      <p className="text-slate-900 font-bold text-lg">{hero.rating || software.rating || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="pt-6 mt-6 border-t border-slate-100">
                    <a href={software.url} target="_blank" rel="noopener noreferrer"
                       className="flex items-center justify-center w-full px-6 py-4 bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-xl hover:-translate-y-1">
                      Probar {software.name}
                    </a>
                  </div>
                </div>
              </div>



            </div>
          </aside>
        </div>
      </section>

      {/* ── SUGERENCIAS / RELATED SOFTWARE ── */}
      {suggestions && suggestions.length > 0 && (
        <section className="bg-white border-t border-slate-200 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-black text-slate-900 mb-8 text-center">Sigue explorando herramientas</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {suggestions.map((item: any) => (
                <Link href={`/software/${item.id}`} key={item.id} className="group flex items-center gap-5 p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-lg hover:border-blue-300 transition-all">
                  <div className="w-16 h-16 shrink-0 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center overflow-hidden">
                    <SoftwareLogo url={item.url} name={item.name} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.name}</h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                      <span className="font-semibold text-slate-700">{item.rating || 'N/A'} ⭐</span>
                      <span>•</span>
                      <span>{item.price || 'Consultar'}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors">
                Ver todo el directorio
              </Link>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
