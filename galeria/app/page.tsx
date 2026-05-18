"use client";

import React, { useState, useEffect } from "react";

interface NekosiaApiResponse {
  image: {
    original: {
      url: string;
    };
  };
}

export default function Home() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);

      const requests = Array.from({ length: 4 }, () =>
        fetch(`https://api.nekosia.cat/api/v1/images/catgirl?ts=${Math.random()}`, {
          method: "GET",
          headers: {
            "Accept": "application/json",
          },
        }).then((res) => {
          if (!res.ok) throw new Error(`Erro: ${res.status}`);
          return res.json();
        })
      );

      const responses = await Promise.all(requests);
      
      const urls = responses.map((data: NekosiaApiResponse) => {
        return data?.image?.original?.url || "";
      });

      setImages(urls.filter((url) => url !== ""));
    } catch (err: any) {
      console.error("Erro ao processar Nekosia API:", err);
      setError("Não foi possível conectar ao servidor da galeria.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center p-6 md:p-12 bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30">
      
      {/* Header Minimalista e Elegante */}
      <header className="text-center my-12 max-w-xl">
        <h1 className="text-3xl font-light tracking-widest text-zinc-100 uppercase">
          Galeria <span className="font-medium text-indigo-400">Nekosia</span>
        </h1>
        <div className="h-[1px] w-12 bg-indigo-500/50 mx-auto my-4"></div>
        <p className="text-zinc-400 text-xs tracking-wide uppercase font-medium">
          Nekosia API
        </p>
      </header>

      {/* Estado de Carregamento Ultra Moderno */}
      {loading ? (
        <div className="flex flex-col items-center gap-4 my-32">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-2 border-t-indigo-400 rounded-full animate-spin"></div>
          </div>
          <p className="text-zinc-500 text-xs tracking-widest uppercase animate-pulse">Carregando acervo...</p>
        </div>
      ) : error ? (
        /* Tela de Erro Limpa */
        <div className="text-center p-8 bg-zinc-900/50 backdrop-blur-md rounded-xl border border-zinc-800 my-16 max-w-sm">
          <p className="text-zinc-300 text-sm font-medium">Conexão interrompida</p>
          <p className="text-zinc-500 text-xs mt-1">{error}</p>
          <button 
            onClick={fetchImages}
            className="mt-6 px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-lg transition-all border border-zinc-700"
          >
            Tentar Novamente
          </button>
        </div>
      ) : (
        /* Grid Estilo Portfólio Premium */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-7xl px-4">
          {images.map((url, index) => (
            <div 
              key={index} 
              className="group relative flex flex-col bg-zinc-900/30 border border-zinc-900 rounded-xl overflow-hidden shadow-2xl transition-all duration-500 hover:border-zinc-700 hover:shadow-indigo-500/5"
            >
              {/* Container da Imagem com Aspect Ratio Fixo */}
              <div className="aspect-[3/4] w-full overflow-hidden bg-zinc-900 relative">
                <img
                  src={url}
                  alt={`Ilustração ${index + 1}`}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter grayscale-[10%] group-hover:grayscale-0"
                  loading="lazy"
                />
                {/* Overlay sutil que aparece no hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-[10px] tracking-widest text-zinc-300 uppercase"></span>
                </div>
              </div>
              
              {/* Rodapé do card discreto */}
              <div className="p-4 flex items-center justify-between border-t border-zinc-900 bg-zinc-900/50">
                <span className="text-[11px] font-mono text-zinc-500">#{(index + 1).toString().padStart(3, '0')}</span>
                <span className="text-[10px] tracking-wider text-zinc-400 uppercase font-light">Nekosia Index</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Botão de Ação Minimalista */}
      {!loading && !error && (
        <button
          onClick={fetchImages}
          className="mt-16 px-8 py-3 bg-zinc-100 hover:bg-white text-zinc-950 text-xs tracking-widest uppercase font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 duration-300"
        >
          Atualizar Galeria
        </button>
      )}
    </div>
  );
}