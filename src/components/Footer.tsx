import React from 'react';
import { LaTribuLogo } from './LaTribuLogo';
import { Lock, Phone, Mail, MapPin, Heart, Shield } from 'lucide-react';
import { BusinessConfig } from '../types';

interface FooterProps {
  config: BusinessConfig | null;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const Footer: React.FC<FooterProps> = ({ config, onOpenAdmin, isAdminLoggedIn }) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#4B5442] text-[#FFF9F1] pt-14 pb-8 border-t border-[#C39D70]/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-5 space-y-4">
            <LaTribuLogo size="lg" textColor="#FFF9F1" />
            <p className="text-sm text-[#FFF9F1]/80 max-w-sm leading-relaxed mt-2">
              Espacio exclusivo y acogedor para fiestas de cumpleaños, reuniones de familia, bautizos y baby showers. Un lugar pensado para crear recuerdos felices.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-[#F1BF70] font-semibold">
              <Shield className="w-4 h-4" />
              <span>Alquiler privado exclusivo para cada celebración</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#F1BF70] block">
              Navegación Rápida
            </span>
            <ul className="space-y-2 text-sm text-[#FFF9F1]/80 font-medium">
              <li>
                <button onClick={() => scrollTo('inicio')} className="hover:text-white transition">
                  Inicio
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('servicios')} className="hover:text-white transition">
                  Tipos de Celebraciones
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('tarifas')} className="hover:text-white transition">
                  Tarifas y Turnos
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('galeria')} className="hover:text-white transition">
                  Galería de Fotos
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('calendario')} className="hover:text-white transition">
                  Consultar Disponibilidad
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('formulario')} className="hover:text-white transition">
                  Solicitar Reserva
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Practical Info */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#F1BF70] block">
              Contacto y Localización
            </span>
            <ul className="space-y-2.5 text-xs text-[#FFF9F1]/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#F1BF70] shrink-0 mt-0.5" />
                <span>{config?.address || 'Calle Mayor 45, 28013 Madrid (Editable)'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#F1BF70] shrink-0" />
                <span>{config?.phone || '+34 600 123 456 (Editable)'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#F1BF70] shrink-0" />
                <span className="break-all">{config?.email || 'contacto@latribu.com (Editable)'}</span>
              </li>
            </ul>

            <div className="pt-3">
              <button
                onClick={onOpenAdmin}
                className={`text-xs px-3.5 py-2 rounded-xl flex items-center gap-2 transition cursor-pointer border ${
                  isAdminLoggedIn
                    ? 'bg-[#F1BF70] text-[#36402E] font-bold border-transparent'
                    : 'bg-white/10 hover:bg-white/15 text-white/90 border-white/20'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isAdminLoggedIn ? 'Panel de Propietario (Sesión abierta)' : 'Acceso Propietario / Administración'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FFF9F1]/60">
          <p>© {new Date().getFullYear()} {config?.name || 'La Tribu'}. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1.5 text-center">
            <span>Hecho con</span>
            <Heart className="w-3.5 h-3.5 text-[#DFAEA1] fill-current" />
            <span>para celebraciones inolvidables</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
