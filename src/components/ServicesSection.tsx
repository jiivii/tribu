import React, { useState } from 'react';
import {
  Gift,
  Users,
  Smile,
  Briefcase,
  Home,
  Coffee,
  Sparkles,
  Layout,
  Music,
  Sun,
  CheckCircle,
  Heart,
  Clock,
  Check,
  Tag,
  ArrowRight
} from 'lucide-react';
import { BusinessConfig } from '../types';

interface ServicesSectionProps {
  config: BusinessConfig | null;
  onSelectRate: (hoursTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ config, onSelectRate }) => {
  const [activeTab, setActiveTab] = useState<'types' | 'equipment' | 'rates'>('types');

  // Helper to map icon names to Lucide icons
  const renderIcon = (iconName: string, className: string = 'w-5 h-5') => {
    switch (iconName) {
      case 'Gift':
        return <Gift className={className} />;
      case 'Users':
        return <Users className={className} />;
      case 'Smile':
        return <Smile className={className} />;
      case 'Briefcase':
        return <Briefcase className={className} />;
      case 'Home':
        return <Home className={className} />;
      case 'Coffee':
        return <Coffee className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'Layout':
        return <Layout className={className} />;
      case 'Music':
        return <Music className={className} />;
      case 'Sun':
        return <Sun className={className} />;
      case 'CheckCircle':
        return <CheckCircle className={className} />;
      case 'Heart':
        return <Heart className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  return (
    <section id="servicios" className="py-16 md:py-24 bg-[#FFF9F1] border-y border-[#C39D70]/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#707A63] bg-[#9AA08A]/15 px-3 py-1 rounded-full">
            Servicios & Celebraciones
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#36402E] mt-3 font-heading">
            Todo lo que necesitas para tu fiesta perfecta
          </h2>
          <p className="text-[#5B6651] mt-3 text-base sm:text-lg">
            Instalaciones preparadas al detalle para que solo te preocupes de invitar a tu gente y disfrutar de momentos inolvidables.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            <button
              onClick={() => setActiveTab('types')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer ${
                activeTab === 'types'
                  ? 'bg-[#707A63] text-[#FFF9F1] shadow-xs'
                  : 'bg-[#F8EFE1] text-[#707A63] hover:bg-[#9AA08A]/20'
              }`}
            >
              Tipos de Celebraciones
            </button>
            <button
              onClick={() => setActiveTab('equipment')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer ${
                activeTab === 'equipment'
                  ? 'bg-[#707A63] text-[#FFF9F1] shadow-xs'
                  : 'bg-[#F8EFE1] text-[#707A63] hover:bg-[#9AA08A]/20'
              }`}
            >
              Equipamiento & Servicios
            </button>
            <button
              onClick={() => setActiveTab('rates')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer ${
                activeTab === 'rates'
                  ? 'bg-[#707A63] text-[#FFF9F1] shadow-xs'
                  : 'bg-[#F8EFE1] text-[#707A63] hover:bg-[#9AA08A]/20'
              }`}
            >
              Tarifas & Horarios
            </button>
          </div>
        </div>

        {/* Tab 1: Celebration Types */}
        {activeTab === 'types' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn">
            {config?.celebrationTypes.map((item) => (
              <div
                key={item.id}
                className="bg-[#F8EFE1] p-6 rounded-2xl border border-[#C39D70]/25 hover:border-[#707A63] hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#FFF9F1] border border-[#C39D70]/30 flex items-center justify-center text-[#707A63] group-hover:scale-110 transition">
                      {renderIcon(item.icon, 'w-6 h-6 text-[#707A63]')}
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#F1BF70]/30 text-[#36402E]">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-[#36402E] font-heading mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#5B6651] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[#C39D70]/20 flex items-center justify-between text-xs text-[#707A63] font-semibold">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#C39D70]" />
                    {item.recommendedHours}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Equipment & Amenities */}
        {activeTab === 'equipment' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-fadeIn">
            {config?.services.map((svc) => (
              <div
                key={svc.id}
                className="bg-[#F8EFE1] p-5 rounded-2xl border border-[#C39D70]/20 hover:border-[#9AA08A] transition flex flex-col justify-between"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF9F1] border border-[#C39D70]/30 flex items-center justify-center text-[#707A63] shrink-0 mt-0.5">
                    {renderIcon(svc.icon, 'w-5 h-5 text-[#707A63]')}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="font-extrabold text-[#36402E] text-base leading-snug">
                        {svc.title}
                      </h4>
                      {svc.included ? (
                        <span className="text-[10px] bg-[#9AA08A]/25 text-[#36402E] px-1.5 py-0.5 rounded font-bold">
                          Incluido
                        </span>
                      ) : (
                        <span className="text-[10px] bg-[#DFAEA1]/40 text-[#543029] px-1.5 py-0.5 rounded font-bold">
                          Opcional
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#5B6651] mt-1.5 leading-relaxed">
                      {svc.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Rates & Shifts */}
        {activeTab === 'rates' && (
          <div id="tarifas" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn">
            {config?.rates.map((rate) => (
              <div
                key={rate.id}
                className={`p-6 rounded-3xl transition-all relative flex flex-col justify-between ${
                  rate.isPopular
                    ? 'bg-[#F8EFE1] border-2 border-[#F1BF70] shadow-md ring-2 ring-[#F1BF70]/20'
                    : 'bg-[#F8EFE1] border border-[#C39D70]/30 hover:border-[#707A63]'
                }`}
              >
                {rate.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#F1BF70] text-[#36402E] text-[11px] font-extrabold px-3 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
                    Más Reservado
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-extrabold text-[#36402E] font-heading">
                    {rate.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#707A63] font-bold mt-1">
                    <Clock className="w-3.5 h-3.5 text-[#C39D70]" />
                    <span>{rate.hours}</span>
                  </div>

                  <div className="my-5">
                    <span className="text-4xl font-extrabold text-[#36402E]">
                      {rate.price}
                    </span>
                    <span className="text-xs text-[#707A63] block mt-0.5 font-medium">
                      (Texto provisional editable)
                    </span>
                  </div>

                  <p className="text-xs text-[#5B6651] leading-relaxed mb-4">
                    {rate.description}
                  </p>

                  <ul className="text-xs text-[#5B6651] space-y-2 border-t border-[#C39D70]/20 pt-3">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#707A63] shrink-0" />
                      <span>Uso exclusivo del local</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#707A63] shrink-0" />
                      <span>Acceso a parque infantil y office</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#707A63] shrink-0" />
                      <span>Mobiliario y climatización</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-2">
                  <button
                    onClick={() => onSelectRate(rate.title)}
                    className={`w-full py-2.5 rounded-xl font-extrabold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      rate.isPopular
                        ? 'bg-[#F1BF70] hover:bg-[#E5A84D] text-[#36402E]'
                        : 'bg-[#FFF9F1] hover:bg-[#9AA08A]/20 text-[#707A63] border border-[#C39D70]/40'
                    }`}
                  >
                    <span>Seleccionar este turno</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Note about provisional data */}
        <div className="mt-10 p-4 rounded-2xl bg-[#F8EFE1] border border-[#C39D70]/30 text-center max-w-2xl mx-auto">
          <p className="text-xs text-[#707A63] leading-relaxed">
            💡 <strong>Nota para el propietario:</strong> Todos los servicios, tipos de celebraciones, turnos y precios mostrados arriba son totalmente editables desde el <strong>Panel de Propietario</strong> (acceso privado) sin necesidad de modificar el código.
          </p>
        </div>
      </div>
    </section>
  );
};
