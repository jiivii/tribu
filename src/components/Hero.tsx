import React from 'react';
import { Calendar, Clock, Heart, ShieldCheck, Sparkles, Users, ArrowRight } from 'lucide-react';
import { BusinessConfig } from '../types';

interface HeroProps {
  config: BusinessConfig | null;
  onCheckAvailability: () => void;
  onBookNow: () => void;
}

export const Hero: React.FC<HeroProps> = ({ config, onCheckAvailability, onBookNow }) => {
  return (
    <section id="inicio" className="relative overflow-hidden pt-6 pb-16 md:pt-12 md:pb-24">
      {/* Subtle organic background arches evoking brand style */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#9AA08A]/10 pointer-events-none blur-2xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-[#F1BF70]/15 pointer-events-none blur-3xl"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF9F1] border border-[#C39D70]/30 shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-[#9AA08A] animate-pulse"></span>
              <span className="text-xs font-bold text-[#707A63] tracking-wide uppercase">
                {config?.tagline || 'Celebraciones que se quedan en la memoria'}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#36402E] leading-tight font-heading">
              Tu local exclusivo para <span className="text-[#707A63] relative inline-block">
                celebrar en familia
                <svg className="absolute -bottom-1.5 left-0 w-full h-3 text-[#F1BF70]" viewBox="0 0 100 12" preserveAspectRatio="none">
                  <path d="M0,8 Q50,0 100,8" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-[#5B6651] max-w-2xl font-medium leading-relaxed">
              Un espacio íntimo, cálido y pensado para que niños y adultos disfruten juntos sin preocupaciones. Cumpleaños infantiles, bautizos, baby showers y reuniones privadas con alquiler 100% exclusivo.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                onClick={onCheckAvailability}
                className="bg-[#707A63] hover:bg-[#5C6450] text-[#FFF9F1] font-bold text-base px-6 py-3.5 rounded-2xl shadow-sm hover:shadow transition flex items-center justify-center gap-2 cursor-pointer group"
              >
                <Calendar className="w-5 h-5 text-[#F1BF70] group-hover:scale-110 transition" />
                <span>Consultar disponibilidad</span>
              </button>

              <button
                onClick={onBookNow}
                className="bg-[#F1BF70] hover:bg-[#E5A84D] text-[#36402E] font-extrabold text-base px-7 py-3.5 rounded-2xl shadow-sm hover:shadow transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Reservar fecha</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Key trust badges */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-[#C39D70]/20">
              <div className="flex items-center gap-2.5 text-[#5B6651] text-xs font-semibold">
                <div className="w-7 h-7 rounded-lg bg-[#FFF9F1] border border-[#C39D70]/30 flex items-center justify-center text-[#707A63] shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span>Uso 100% exclusivo para tu grupo</span>
              </div>

              <div className="flex items-center gap-2.5 text-[#5B6651] text-xs font-semibold">
                <div className="w-7 h-7 rounded-lg bg-[#FFF9F1] border border-[#C39D70]/30 flex items-center justify-center text-[#F1BF70] shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <span>Aforo hasta {config?.capacityMax || 50} personas</span>
              </div>

              <div className="flex items-center gap-2.5 text-[#5B6651] text-xs font-semibold col-span-2 sm:col-span-1">
                <div className="w-7 h-7 rounded-lg bg-[#FFF9F1] border border-[#C39D70]/30 flex items-center justify-center text-[#DFAEA1] shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span>Zona de juegos & cocina equipada</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5">
            <div className="relative">
              {/* Backing decorative frame in brand colors */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#9AA08A]/40 via-[#F1BF70]/30 to-[#DFAEA1]/40 rounded-3xl transform rotate-1"></div>

              {/* Main Card */}
              <div className="relative bg-[#FFF9F1] p-3 sm:p-4 rounded-3xl shadow-xl border border-[#C39D70]/30">
                <div className="relative overflow-hidden rounded-2xl aspect-4/3 group">
                  <img
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80"
                    alt="Espacio interior La Tribu para celebraciones"
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-5">
                    <div className="text-white">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#F1BF70] bg-black/30 px-2 py-0.5 rounded backdrop-blur-xs">
                        Espacio polivalente
                      </span>
                      <p className="text-base font-bold mt-1">
                        Salón amplio con luz natural, mesas y parque de juegos
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating mini stat card */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                  <div className="bg-[#F8EFE1] p-2.5 rounded-xl border border-[#C39D70]/20">
                    <span className="block text-xs font-bold text-[#707A63]">Turno Mañana</span>
                    <span className="text-sm font-extrabold text-[#36402E]">10:00 a 14:30 h</span>
                  </div>
                  <div className="bg-[#F8EFE1] p-2.5 rounded-xl border border-[#C39D70]/20">
                    <span className="block text-xs font-bold text-[#707A63]">Turno Tarde</span>
                    <span className="text-sm font-extrabold text-[#36402E]">16:30 a 21:30 h</span>
                  </div>
                </div>

                <div className="mt-2 text-center">
                  <span className="text-[11px] text-[#707A63] italic">
                    * Puedes consultar turnos completos y días enteros en el calendario
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
