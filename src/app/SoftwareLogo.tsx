'use client';

import { useState } from 'react';

export default function SoftwareLogo({ url, name }: { url: string; name: string }) {
  const [error, setError] = useState(false);
  
  // Extraer dominio limpio para Icon Horse (mejor que Clearbit)
  let domain = '';
  try {
    domain = new URL(url).hostname.replace('www.', '');
  } catch (e) {}

  if (!domain || error) {
    return (
      <span className="text-blue-600 font-bold text-xl">
        {name.substring(0, 2).toUpperCase()}
      </span>
    );
  }

  return (
    <img 
      src={`https://icon.horse/icon/${domain}`} 
      alt={name} 
      className="w-full h-full object-contain p-2"
      onError={() => setError(true)}
    />
  );
}
