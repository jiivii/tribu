import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Navigation,
  MessageCircle,
  HelpCircle,
  Car,
  Train,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { BusinessConfig } from '../types';

interface PracticalInfoProps {
  config: BusinessConfig | null;
}

export const PracticalInfo: React.FC<PracticalInfoProps> = ({ config }) => {
  return (
    <section id="contacto" className="py-16 md:py-24 bg-[#FFF9F1] border-b border-[#C39D70]/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#707A63] bg-[#9AA08A]/15 px-3 py-1 rounded-full">
            Información Práctica
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#36402E] mt-3 font-heading">
            Ubicación, horarios y cómo llegar
          </h2>
          <p className="text-[#5B6651] mt-3 text-base">
            Estamos a tu disposición para resolver dudas, enseñarte el local antes de tu evento o preparar tu presupuesto personalizado.
          </p>
        </div>

        {/* Contact and Location Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Contact & Hours Cards */}
          <div className="lg:col-span-5 space-y-4">
            {/* Phone Card */}
            <div className="bg-[#F8EFE1] p-6 rounded-2xl border border-[#C39D70]/30 hover:border-[#707A63] transition flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FFF9F1] border border-[#C39D70]/30 flex items-center justify-center text-[#707A63] shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#707A63] uppercase tracking-wider block">
                    Teléfono directo
                  </span>
                  <p className="font-extrabold text-[#36402E] text-lg mt-0.5">
                    {config?.phone || '+34 600 123 456 (Editable)'}
                  </p>
                  <p className="text-xs text-[#5B6651] mt-1">
                    Atención telefónica de 09:30 a 21:00 h
                  </p>
                </div>
              </div>
              <a
                href={`tel:${config?.phone?.replace(/\s+/g, '')}`}
                className="bg-[#707A63] text-white p-2.5 rounded-xl hover:bg-[#5B6651] transition shrink-0"
                title="Llamar"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>

            {/* WhatsApp Card */}
            <div className="bg-[#F8EFE1] p-6 rounded-2xl border border-[#C39D70]/30 hover:border-emerald-600 transition flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FFF9F1] border border-[#C39D70]/30 flex items-center justify-center text-emerald-600 shrink-0">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                    WhatsApp directo
                  </span>
                  <p className="font-extrabold text-[#36402E] text-lg mt-0.5">
                    {config?.whatsapp || '+34 600 123 456'}
                  </p>
                  <p className="text-xs text-[#5B6651] mt-1">
                    Escríbenos para consultas rápidas o fotos adicionales
                  </p>
                </div>
              </div>
              <a
                href={`https://wa.me/${config?.whatsapp?.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 text-white p-2.5 rounded-xl hover:bg-emerald-700 transition shrink-0"
                title="Abrir WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>

            {/* Email Card */}
            <div className="bg-[#F8EFE1] p-6 rounded-2xl border border-[#C39D70]/30 hover:border-[#707A63] transition flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FFF9F1] border border-[#C39D70]/30 flex items-center justify-center text-[#707A63] shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#707A63] uppercase tracking-wider block">
                    Correo electrónico
                  </span>
                  <p className="font-bold text-[#36402E] text-base mt-0.5 break-all">
                    {config?.email || 'contacto@latribu.com (Editable)'}
                  </p>
                  <p className="text-xs text-[#5B6651] mt-1">
                    Respondemos en menos de 24 horas
                  </p>
                </div>
              </div>
              <a
                href={`mailto:${config?.email}`}
                className="bg-[#707A63] text-white p-2.5 rounded-xl hover:bg-[#5B6651] transition shrink-0"
                title="Escribir email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>

            {/* Hours Card */}
            <div className="bg-[#F8EFE1] p-6 rounded-2xl border border-[#C39D70]/30 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FFF9F1] border border-[#C39D70]/30 flex items-center justify-center text-[#C39D70] shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#707A63] uppercase tracking-wider block">
                  Horarios del local
                </span>
                <p className="font-bold text-[#36402E] text-sm mt-0.5">
                  {config?.hoursDescription || 'Lunes a Domingo de 10:00 a 22:30 h'}
                </p>
                <p className="text-xs text-[#5B6651] mt-1">
                  Turno de mañana, tarde o día completo con posibilidad de horas extra.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Location & Arrival Guide with Visual Map */}
          <div className="lg:col-span-7 bg-[#F8EFE1] p-6 sm:p-8 rounded-3xl border border-[#C39D70]/30 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-extrabold uppercase text-[#707A63] tracking-wider block">
                  Dirección del local
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#36402E] font-heading mt-0.5">
                  {config?.address || 'Calle Mayor 45, 28013 Madrid (Editable)'}
                </h3>
              </div>

              <a
                href={config?.googleMapsUrl || 'https://maps.google.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#F1BF70] hover:bg-[#E5A84D] text-[#36402E] font-extrabold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-xs"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Cómo llegar en Google Maps</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            </div>

            {/* Visual Map Representation */}
            <div className="relative rounded-2xl overflow-hidden border border-[#C39D70]/40 aspect-16/9 bg-stone-100 shadow-inner group">
              <iframe
                title="Mapa de ubicación"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.601555026601!2d-3.7088927843890276!3d40.41655077936551!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd42287e076d3329%3A0x633b45508a8e52!2sCalle%20Mayor%2C%20Madrid!5e0!3m2!1ses!2ses!4v1680000000000!5m2!1ses!2ses"
                className="w-full h-full border-0 filter saturate-90"
                loading="lazy"
              ></iframe>

              {/* Pin badge over map */}
              <div className="absolute top-3 left-3 bg-[#FFF9F1]/95 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-[#C39D70]/30 shadow-md flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#707A63]" />
                <span className="text-xs font-extrabold text-[#36402E]">
                  Local La Tribu (Madrid Centro)
                </span>
              </div>
            </div>

            {/* Detailed Arrival Instructions */}
            <div className="bg-[#FFF9F1] p-5 rounded-2xl border border-[#C39D70]/25 space-y-3">
              <h4 className="text-sm font-extrabold text-[#36402E] flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#707A63]" />
                Indicaciones de transporte y accesos:
              </h4>

              <p className="text-xs text-[#5B6651] leading-relaxed">
                {config?.howToArrive || 'Metro Línea 1 y 2 (Sol / Ópera a 4 min). Autobuses 3, 148 y 50. Parking público 24h a 80m en Plaza Mayor.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-[#C39D70]/20 text-xs text-[#5B6651]">
                <div className="flex items-center gap-2">
                  <Train className="w-3.5 h-3.5 text-[#707A63] shrink-0" />
                  <span>Metro y tren a pocos minutos a pie</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="w-3.5 h-3.5 text-[#707A63] shrink-0" />
                  <span>Parking público cercano para invitados</span>
                </div>
              </div>
            </div>

            {/* Mini FAQ */}
            <div className="space-y-2.5 pt-2">
              <span className="text-xs font-extrabold uppercase text-[#707A63] tracking-wider block">
                Preguntas frecuentes antes de reservar:
              </span>
              <div className="bg-[#FFF9F1] p-3.5 rounded-xl border border-[#C39D70]/20 text-xs text-[#5B6651]">
                <strong className="text-[#36402E] block font-bold">¿Puedo llevar mi propia comida y bebida?</strong>
                Sí, tienes total libertad para traer tu propia comida, catering, merienda o contratar repostería exterior. Dispones de nevera y microondas.
              </div>
              <div className="bg-[#FFF9F1] p-3.5 rounded-xl border border-[#C39D70]/20 text-xs text-[#5B6651]">
                <strong className="text-[#36402E] block font-bold">¿Se puede visitar el local antes de reservar?</strong>
                ¡Por supuesto! Concertamos visitas entre semana para que conozcas las instalaciones en persona antes de tu celebración.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
