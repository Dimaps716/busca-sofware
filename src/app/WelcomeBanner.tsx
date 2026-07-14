'use client';

import { useState, useEffect } from 'react';

export default function WelcomeBanner({ show }: { show: boolean }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (show) {
      const dismissed = sessionStorage.getItem('dismissed_welcome_banner');
      if (!dismissed) {
        setIsRendered(true);
        // Small delay to trigger smooth transition/animation
        const timer = setTimeout(() => setIsVisible(true), 50);
        return () => clearTimeout(timer);
      }
    }
  }, [show]);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('dismissed_welcome_banner', 'true');
    // Remove from DOM after transition completes
    setTimeout(() => setIsRendered(false), 400);
  };

  if (!isRendered) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Click outside to dismiss */}
      <div className="absolute inset-0" onClick={handleDismiss}></div>

      {/* Modal Card */}
      <div 
        className={`bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden p-8 md:p-12 relative flex flex-col items-center text-center transition-all duration-500 transform ${
          isVisible ? 'scale-100 translate-y-0 opacity-100' : 'scale-90 translate-y-4 opacity-0'
        }`}
      >
        {/* Top Gradient Circle with floating search/stars icon */}
        <div className="relative mb-6">
          <div className="absolute -inset-1.5 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-[2.2rem] blur opacity-30 animate-pulse"></div>
          <div className="relative w-20 h-20 rounded-[2rem] bg-gradient-to-tr from-blue-600 via-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 7L10 9M8 8L12 8" />
            </svg>
          </div>
        </div>

        {/* Header Text */}
        <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-4">
          ¡Bienvenidos al nuevo <br />
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">busca.software</span>! ✨
        </h2>

        {/* Body Text */}
        <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-6 font-medium">
          Hemos rediseñado y mejorado por completo nuestra plataforma para ofrecerte una experiencia mucho más rápida, intuitiva y profesional.
        </p>

        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          Te invitamos a navegar, comparar reseñas reales y buscar toda la información que necesitas sobre las mejores herramientas de software para tu negocio.
        </p>

        {/* Action Button */}
        <button 
          onClick={handleDismiss}
          className="w-full py-4 bg-slate-900 hover:bg-blue-600 text-white font-extrabold rounded-2xl shadow-lg hover:shadow-blue-500/20 active:scale-[0.98] transition-all duration-300 cursor-pointer"
        >
          Comenzar a explorar
        </button>

        {/* Subtle hint */}
        <p className="text-xs text-slate-400 mt-4 font-semibold">
          Usa la barra de búsqueda principal para filtrar lo que necesitas
        </p>

        {/* Close Icon in the corner */}
        <button 
          onClick={handleDismiss}
          aria-label="Cerrar"
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
