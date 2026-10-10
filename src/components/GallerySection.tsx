import React, { useState } from 'react';
import { Image, X, ZoomIn, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { GalleryItem } from '../types';

interface GallerySectionProps {
  gallery: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ gallery }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = ['Todas', ...Array.from(new Set(gallery.map((g) => g.category)))];

  const filteredPhotos =
    selectedCategory === 'Todas'
      ? gallery
      : gallery.filter((item) => item.category === selectedCategory);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const prevPhoto = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
  };

  const nextPhoto = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length);
  };

  return (
    <section id="galeria" className="py-16 md:py-24 bg-[#F8EFE1]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#707A63] bg-[#9AA08A]/15 px-3 py-1 rounded-full">
            Nuestras Instalaciones
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#36402E] mt-3 font-heading">
            Galería del Local
          </h2>
          <p className="text-[#5B6651] mt-3 text-base">
            Conoce cada rincón de La Tribu. Espacios pensados con mimo para disfrutar al máximo.
          </p>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#707A63] text-[#FFF9F1] shadow-xs'
                    : 'bg-[#FFF9F1] text-[#707A63] border border-[#C39D70]/30 hover:border-[#707A63]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo, idx) => (
            <div
              key={photo.id}
              onClick={() => openLightbox(idx)}
              className="group relative bg-[#FFF9F1] rounded-2xl overflow-hidden border border-[#C39D70]/30 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-stone-200">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="bg-[#FFF9F1]/90 text-[#36402E] font-bold text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow">
                    <ZoomIn className="w-3.5 h-3.5" />
                    Ampliar foto
                  </span>
                </div>
                <span className="absolute top-3 left-3 bg-[#FFF9F1]/90 backdrop-blur-xs text-[#36402E] text-[11px] font-extrabold px-2.5 py-1 rounded-lg border border-[#C39D70]/20">
                  {photo.category}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-[#36402E] text-base group-hover:text-[#707A63] transition font-heading">
                    {photo.title}
                  </h3>
                  <p className="text-xs text-[#5B6651] mt-1 leading-relaxed">
                    {photo.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {lightboxIndex !== null && filteredPhotos[lightboxIndex] && (
          <div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            onClick={closeLightbox}
          >
            <div
              className="relative max-w-4xl w-full bg-[#FFF9F1] rounded-3xl overflow-hidden shadow-2xl border border-[#C39D70]/40"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 text-white hover:bg-black/80 flex items-center justify-center transition"
                aria-label="Cerrar vista"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Prev / Next buttons */}
              <button
                onClick={prevPhoto}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 text-white hover:bg-black/80 flex items-center justify-center transition"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 text-white hover:bg-black/80 flex items-center justify-center transition"
                aria-label="Foto siguiente"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <div className="relative max-h-[70vh] bg-stone-900 flex items-center justify-center overflow-hidden">
                <img
                  src={filteredPhotos[lightboxIndex].imageUrl}
                  alt={filteredPhotos[lightboxIndex].title}
                  className="max-h-[70vh] w-auto object-contain mx-auto"
                />
              </div>

              <div className="p-6 bg-[#FFF9F1] border-t border-[#C39D70]/20 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <span className="text-xs font-bold text-[#707A63] uppercase tracking-wider">
                    {filteredPhotos[lightboxIndex].category}
                  </span>
                  <h4 className="text-xl font-extrabold text-[#36402E] font-heading">
                    {filteredPhotos[lightboxIndex].title}
                  </h4>
                  <p className="text-xs text-[#5B6651] mt-1">
                    {filteredPhotos[lightboxIndex].description}
                  </p>
                </div>
                <span className="text-xs font-bold text-[#707A63] bg-[#F8EFE1] px-3 py-1 rounded-full border border-[#C39D70]/20">
                  {lightboxIndex + 1} de {filteredPhotos.length}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
