import React, { useState } from 'react';
import { LaTribuLogo } from './LaTribuLogo';
import { Calendar, Lock, Menu, X, Phone, MapPin } from 'lucide-react';
import { BusinessConfig } from '../types';

interface NavbarProps {
  config: BusinessConfig | null;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ config, onOpenAdmin, isAdminLoggedIn }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFF9F1]/95 backdrop-blur-md border-b border-[#C39D70]/20 transition-all shadow-xs">
      {/* Top micro bar with contact info */}
      <div className="bg-[#707A63] text-[#FFF9F1] text-xs py-1.5 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#F1BF70]" />
              <span className="hidden sm:inline">Ubicación:</span> {config?.address || 'Calle Mayor 45, Madrid (Editable)'}
            </span>
            <span className="hidden md:flex items-center gap-1 font-medium">
              <Phone className="w-3.5 h-3.5 text-[#F1BF70]" />
              {config?.phone || '+34 600 123 456 (Editable)'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-[#9AA08A]/40 text-[#FFF9F1] px-2 py-0.5 rounded-full text-[11px] font-semibold">
              Alquiler 100% privado
            </span>
            <button
              onClick={onOpenAdmin}
              className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded transition ${
                isAdminLoggedIn
                  ? 'bg-[#F1BF70] text-[#36402E] font-bold'
                  : 'text-[#FFF9F1]/80 hover:text-white hover:bg-white/10'
              }`}
              title="Acceso restringido para el propietario del local"
            >
              <Lock className="w-3 h-3" />
              <span>{isAdminLoggedIn ? 'Panel Propietario (Activo)' : 'Acceso Propietario'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <button
          onClick={() => scrollTo('inicio')}
          className="text-left focus:outline-none focus:ring-2 focus:ring-[#9AA08A] rounded-lg"
        >
          <LaTribuLogo size="md" />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7 text-[15px] font-bold text-[#707A63]">
          <button onClick={() => scrollTo('inicio')} className="hover:text-[#4B5442] transition">
            Inicio
          </button>
          <button onClick={() => scrollTo('servicios')} className="hover:text-[#4B5442] transition">
            Servicios y Fiestas
          </button>
          <button onClick={() => scrollTo('tarifas')} className="hover:text-[#4B5442] transition">
            Tarifas
          </button>
          <button onClick={() => scrollTo('galeria')} className="hover:text-[#4B5442] transition">
            Fotos
          </button>
          <button onClick={() => scrollTo('calendario')} className="hover:text-[#4B5442] transition flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#C39D70]" />
            Disponibilidad
          </button>
          <button onClick={() => scrollTo('contacto')} className="hover:text-[#4B5442] transition">
            Cómo llegar
          </button>
        </nav>

        {/* CTA Button */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => scrollTo('calendario')}
            className="text-xs font-bold text-[#707A63] border border-[#707A63]/30 hover:bg-[#9AA08A]/10 px-3.5 py-2 rounded-xl transition"
          >
            Ver Calendario
          </button>
          <button
            onClick={() => scrollTo('formulario')}
            className="bg-[#F1BF70] hover:bg-[#E5A84D] active:scale-95 text-[#36402E] font-extrabold text-sm px-5 py-2.5 rounded-xl shadow-xs hover:shadow transition flex items-center gap-2 cursor-pointer"
          >
            <span>Solicitar Reserva</span>
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-[#707A63] hover:text-[#4B5442] focus:outline-none"
          aria-label="Abrir menú"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FFF9F1] border-b border-[#C39D70]/20 px-6 py-5 flex flex-col gap-4 text-[#707A63] font-bold text-base shadow-lg animate-fadeIn">
          <button
            onClick={() => scrollTo('inicio')}
            className="text-left py-2 border-b border-[#F8EFE1]"
          >
            Inicio
          </button>
          <button
            onClick={() => scrollTo('servicios')}
            className="text-left py-2 border-b border-[#F8EFE1]"
          >
            Servicios y Fiestas
          </button>
          <button
            onClick={() => scrollTo('tarifas')}
            className="text-left py-2 border-b border-[#F8EFE1]"
          >
            Tarifas y Turnos
          </button>
          <button
            onClick={() => scrollTo('galeria')}
            className="text-left py-2 border-b border-[#F8EFE1]"
          >
            Galería de fotos
          </button>
          <button
            onClick={() => scrollTo('calendario')}
            className="text-left py-2 border-b border-[#F8EFE1] flex items-center justify-between"
          >
            <span>Consultar disponibilidad</span>
            <Calendar className="w-4 h-4 text-[#C39D70]" />
          </button>
          <button
            onClick={() => scrollTo('contacto')}
            className="text-left py-2 border-b border-[#F8EFE1]"
          >
            Ubicación y contacto
          </button>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => scrollTo('formulario')}
              className="w-full bg-[#F1BF70] text-[#36402E] font-extrabold py-3 rounded-xl text-center shadow-xs"
            >
              Solicitar Reserva
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="text-xs text-center py-2 text-[#707A63] flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isAdminLoggedIn ? 'Abrir Panel de Administración' : 'Acceso Propietario (Gestión de Reservas)'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
