import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Info,
  Users,
  MessageSquare,
  FileCheck,
  Check
} from 'lucide-react';
import { PublicAvailabilitySlot, BusinessConfig } from '../types';

interface BookingFormProps {
  config: BusinessConfig | null;
  selectedDate: string;
  onDateChange: (date: string) => void;
  availabilitySlots: PublicAvailabilitySlot[];
  onBookingCreated: () => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  config,
  selectedDate,
  onDateChange,
  availabilitySlots,
  onBookingCreated
}) => {
  // Form fields
  const [formData, setFormData] = useState({
    clientName: '',
    clientLastName: '',
    date: selectedDate,
    startTime: '16:30',
    endTime: '21:30',
    phone: '',
    email: '',
    eventType: 'Cumpleaños infantil',
    guests: '25',
    notes: ''
  });

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<{
    trackingCode: string;
    date: string;
    startTime: string;
    endTime: string;
    clientName: string;
  } | null>(null);

  // Sync with prop when selected date in calendar changes
  useEffect(() => {
    if (selectedDate) {
      setFormData((prev) => ({ ...prev, date: selectedDate }));
    }
  }, [selectedDate]);

  // Turnos shortcuts
  const selectShift = (start: string, end: string) => {
    setFormData((prev) => ({ ...prev, startTime: start, endTime: end }));
  };

  // Time conversion helper
  const toMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  // Check collision locally in real-time
  const checkCollision = () => {
    if (!formData.date || !formData.startTime || !formData.endTime) return null;

    const startMin = toMinutes(formData.startTime);
    const endMin = toMinutes(formData.endTime);

    if (endMin <= startMin) {
      return 'La hora de fin debe ser posterior a la hora de inicio.';
    }

    const daySlots = availabilitySlots.filter((s) => s.date === formData.date);

    for (const slot of daySlots) {
      if (slot.isFullDay) {
        return `El día ${formData.date} está completo o bloqueado por el propietario.`;
      }

      const sMin = toMinutes(slot.startTime);
      const eMin = toMinutes(slot.endTime);

      if (Math.max(startMin, sMin) < Math.min(endMin, eMin)) {
        if (slot.status === 'confirmed') {
          return `El horario seleccionado se solapa con una reserva ya confirmada (${slot.startTime} a ${slot.endTime} h). Por favor, elige otro turno.`;
        }
        if (slot.status === 'blocked') {
          return `El horario seleccionado (${formData.startTime} a ${formData.endTime}) coincide con un horario bloqueado por el local (${slot.startTime} a ${slot.endTime} h).`;
        }
        return `El horario seleccionado coincide con una reserva en revisión (${slot.startTime} a ${slot.endTime} h).`;
      }
    }

    return null;
  };

  const collisionError = checkCollision();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Validation
    if (!formData.clientName.trim()) {
      setSubmitError('El nombre es obligatorio.');
      return;
    }
    if (!formData.clientLastName.trim()) {
      setSubmitError('Los apellidos son obligatorios.');
      return;
    }
    if (!formData.date) {
      setSubmitError('La fecha es obligatoria.');
      return;
    }
    if (!formData.startTime || !formData.endTime) {
      setSubmitError('Las horas de inicio y fin son obligatorias.');
      return;
    }
    if (collisionError) {
      setSubmitError(collisionError);
      return;
    }
    if (!formData.phone.trim()) {
      setSubmitError('El teléfono de contacto es obligatorio.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setSubmitError('Introduce un correo electrónico válido.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'No se pudo procesar la solicitud.');
      }

      setSuccessResult({
        trackingCode: data.booking.trackingCode,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        clientName: formData.clientName
      });

      onBookingCreated();
    } catch (err: any) {
      setSubmitError(err.message || 'Error al conectar con el servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="formulario" className="py-16 md:py-24 bg-[#F8EFE1]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#707A63] bg-[#9AA08A]/15 px-3 py-1 rounded-full">
            Sin registro previo
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#36402E] mt-3 font-heading">
            Solicita tu reserva online
          </h2>
          <p className="text-[#5B6651] mt-3 text-base max-w-xl mx-auto">
            Rellena los datos para solicitar la fecha. Tu solicitud quedará registrada y el propietario te confirmará la disponibilidad sin esperas.
          </p>
        </div>

        {/* Success Modal or Form */}
        {successResult ? (
          <div className="bg-[#FFF9F1] rounded-3xl p-8 sm:p-10 border-2 border-[#9AA08A] shadow-xl text-center animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xs">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full">
              ¡Solicitud enviada correctamente!
            </span>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#36402E] mt-3 font-heading">
              Gracias, {successResult.clientName}
            </h3>

            {/* Clear Status Notice as requested */}
            <div className="my-5 inline-block bg-[#F8EFE1] border border-[#C39D70]/40 rounded-2xl p-4 text-left max-w-lg mx-auto">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></span>
                <span className="text-xs font-extrabold uppercase text-[#707A63]">
                  Estado de tu reserva:
                </span>
                <span className="text-xs font-black bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                  Pendiente de confirmación
                </span>
              </div>
              <p className="text-xs text-[#5B6651] leading-relaxed">
                Hemos recibido tu petición con el código de seguimiento:{' '}
                <strong className="text-[#36402E] font-extrabold text-sm font-mono">
                  {successResult.trackingCode}
                </strong>
                . El propietario del local revisará tu horario y te contactará por teléfono o correo para formalizar los detalles y darte la bienvenida a La Tribu.
              </p>
            </div>

            {/* Summary info */}
            <div className="bg-[#F8EFE1] rounded-2xl p-5 max-w-md mx-auto grid grid-cols-2 gap-3 text-left text-xs mb-6 border border-[#C39D70]/20">
              <div>
                <span className="text-[#707A63] font-bold block">Fecha:</span>
                <span className="font-extrabold text-[#36402E] text-sm">
                  {successResult.date}
                </span>
              </div>
              <div>
                <span className="text-[#707A63] font-bold block">Horario:</span>
                <span className="font-extrabold text-[#36402E] text-sm">
                  {successResult.startTime} a {successResult.endTime} h
                </span>
              </div>
            </div>

            {/* Contact details for owner as requested */}
            <div className="p-5 bg-[#707A63] text-[#FFF9F1] rounded-2xl max-w-md mx-auto text-left mb-6">
              <h4 className="font-bold text-sm text-[#F1BF70] mb-2 flex items-center gap-1.5">
                <Phone className="w-4 h-4" />
                Datos de contacto del local:
              </h4>
              <p className="text-xs opacity-90">
                <strong>Teléfono / WhatsApp:</strong> {config?.phone || '+34 600 123 456 (Editable)'}
              </p>
              <p className="text-xs opacity-90 mt-1">
                <strong>Email:</strong> {config?.email || 'contacto@latribu.com (Editable)'}
              </p>
              <p className="text-xs opacity-90 mt-1">
                <strong>Dirección:</strong> {config?.address || 'Calle Mayor 45, Madrid (Editable)'}
              </p>
            </div>

            <button
              onClick={() => {
                setSuccessResult(null);
                setFormData({
                  clientName: '',
                  clientLastName: '',
                  date: selectedDate,
                  startTime: '16:30',
                  endTime: '21:30',
                  phone: '',
                  email: '',
                  eventType: 'Cumpleaños infantil',
                  guests: '25',
                  notes: ''
                });
              }}
              className="px-6 py-2.5 rounded-xl bg-[#F8EFE1] hover:bg-[#9AA08A]/20 text-[#707A63] font-bold text-xs transition cursor-pointer border border-[#C39D70]/30"
            >
              Hacer otra consulta o reserva
            </button>
          </div>
        ) : (
          /* Form Card */
          <form
            onSubmit={handleSubmit}
            className="bg-[#FFF9F1] rounded-3xl p-6 sm:p-10 border border-[#C39D70]/30 shadow-lg space-y-6"
          >
            {/* Clear Status Notice */}
            <div className="p-4 rounded-2xl bg-[#F8EFE1] border border-[#C39D70]/30 flex items-start gap-3 text-xs text-[#5B6651]">
              <Info className="w-5 h-5 text-[#707A63] shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-[#36402E] block">
                  Información sobre el proceso de reserva:
                </span>
                Al enviar este formulario, tu solicitud quedará en estado{' '}
                <strong className="text-[#707A63]">“Pendiente de confirmación”</strong>. No se cobra nada online. El propietario verificará la disponibilidad y se pondrá en contacto contigo para confirmar la fecha.
              </div>
            </div>

            {/* Error banner */}
            {submitError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-semibold flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Collision warning in real-time */}
            {collisionError && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <span>{collisionError}</span>
              </div>
            )}

            {/* Client Personal Data (Obligatorios) */}
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-[#36402E] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#C39D70]/20 pb-2">
                <User className="w-4 h-4 text-[#707A63]" />
                1. Datos de contacto del cliente (Obligatorios)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#36402E] mb-1">
                    Nombre <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. María"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full bg-[#F8EFE1] border border-[#C39D70]/40 rounded-xl px-3.5 py-2.5 text-sm text-[#36402E] focus:outline-none focus:ring-2 focus:ring-[#707A63]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#36402E] mb-1">
                    Apellidos <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Gómez Ruiz"
                    value={formData.clientLastName}
                    onChange={(e) => setFormData({ ...formData, clientLastName: e.target.value })}
                    className="w-full bg-[#F8EFE1] border border-[#C39D70]/40 rounded-xl px-3.5 py-2.5 text-sm text-[#36402E] focus:outline-none focus:ring-2 focus:ring-[#707A63]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#36402E] mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#707A63]" />
                    Teléfono de contacto <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej. +34 612 345 678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#F8EFE1] border border-[#C39D70]/40 rounded-xl px-3.5 py-2.5 text-sm text-[#36402E] focus:outline-none focus:ring-2 focus:ring-[#707A63]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#36402E] mb-1 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-[#707A63]" />
                    Correo electrónico <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Ej. maria@ejemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#F8EFE1] border border-[#C39D70]/40 rounded-xl px-3.5 py-2.5 text-sm text-[#36402E] focus:outline-none focus:ring-2 focus:ring-[#707A63]"
                  />
                </div>
              </div>
            </div>

            {/* Date and Time (Obligatorios) */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-extrabold text-[#36402E] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#C39D70]/20 pb-2">
                <CalendarIcon className="w-4 h-4 text-[#707A63]" />
                2. Fecha y horario de la celebración (Obligatorios)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#36402E] mb-1">
                    Fecha del evento <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => {
                      setFormData({ ...formData, date: e.target.value });
                      onDateChange(e.target.value);
                    }}
                    className="w-full bg-[#F8EFE1] border border-[#C39D70]/40 rounded-xl px-3.5 py-2.5 text-sm text-[#36402E] focus:outline-none focus:ring-2 focus:ring-[#707A63]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#36402E] mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#707A63]" />
                    Hora de inicio <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full bg-[#F8EFE1] border border-[#C39D70]/40 rounded-xl px-3.5 py-2.5 text-sm text-[#36402E] focus:outline-none focus:ring-2 focus:ring-[#707A63]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#36402E] mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#707A63]" />
                    Hora de fin <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full bg-[#F8EFE1] border border-[#C39D70]/40 rounded-xl px-3.5 py-2.5 text-sm text-[#36402E] focus:outline-none focus:ring-2 focus:ring-[#707A63]"
                  />
                </div>
              </div>

              {/* Turnos Shortcuts */}
              <div>
                <span className="text-[11px] font-bold text-[#707A63] block mb-1.5">
                  Atajos rápidos de turnos habituales:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => selectShift('10:00', '14:30')}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-bold transition cursor-pointer ${
                      formData.startTime === '10:00' && formData.endTime === '14:30'
                        ? 'bg-[#707A63] text-white border-[#707A63]'
                        : 'bg-[#F8EFE1] text-[#707A63] border-[#C39D70]/30 hover:border-[#707A63]'
                    }`}
                  >
                    Turno Mañana (10:00 a 14:30)
                  </button>
                  <button
                    type="button"
                    onClick={() => selectShift('16:30', '21:30')}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-bold transition cursor-pointer ${
                      formData.startTime === '16:30' && formData.endTime === '21:30'
                        ? 'bg-[#707A63] text-white border-[#707A63]'
                        : 'bg-[#F8EFE1] text-[#707A63] border-[#C39D70]/30 hover:border-[#707A63]'
                    }`}
                  >
                    Turno Tarde (16:30 a 21:30)
                  </button>
                  <button
                    type="button"
                    onClick={() => selectShift('11:00', '21:30')}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-bold transition cursor-pointer ${
                      formData.startTime === '11:00' && formData.endTime === '21:30'
                        ? 'bg-[#707A63] text-white border-[#707A63]'
                        : 'bg-[#F8EFE1] text-[#707A63] border-[#C39D70]/30 hover:border-[#707A63]'
                    }`}
                  >
                    Día Completo (11:00 a 21:30)
                  </button>
                </div>
              </div>
            </div>

            {/* Event details */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-extrabold text-[#36402E] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#C39D70]/20 pb-2">
                <Sparkles className="w-4 h-4 text-[#707A63]" />
                3. Detalles de la celebración (Opcionales)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#36402E] mb-1">
                    Tipo de evento
                  </label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full bg-[#F8EFE1] border border-[#C39D70]/40 rounded-xl px-3.5 py-2.5 text-sm text-[#36402E] focus:outline-none focus:ring-2 focus:ring-[#707A63]"
                  >
                    <option value="Cumpleaños infantil">Cumpleaños infantil</option>
                    <option value="Bautizo / Comunión">Bautizo o Comunión familiar</option>
                    <option value="Baby Shower / Gender Reveal">Baby Shower / Gender Reveal</option>
                    <option value="Reunión familiar o aniversario">Reunión familiar o aniversario</option>
                    <option value="Taller o evento privado">Taller o evento privado</option>
                    <option value="Otro tipo de celebración">Otro tipo de celebración</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#36402E] mb-1 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#707A63]" />
                    Nº aproximado de asistentes (Máx {config?.capacityMax || 50})
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={config?.capacityMax || 50}
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    className="w-full bg-[#F8EFE1] border border-[#C39D70]/40 rounded-xl px-3.5 py-2.5 text-sm text-[#36402E] focus:outline-none focus:ring-2 focus:ring-[#707A63]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#36402E] mb-1 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-[#707A63]" />
                  Comentarios o peticiones especiales
                </label>
                <textarea
                  rows={3}
                  placeholder="Cuéntanos si necesitas servicio de limpieza final, decoración, traer tarta especial, o cualquier detalle sobre el horario..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-[#F8EFE1] border border-[#C39D70]/40 rounded-xl px-3.5 py-2 text-sm text-[#36402E] focus:outline-none focus:ring-2 focus:ring-[#707A63]"
                ></textarea>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-[#C39D70]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-[#5B6651]">
                🔒 Tus datos solo se usan para gestionar tu reserva. Sin spam ni cuentas de usuario.
              </p>

              <button
                type="submit"
                disabled={isSubmitting || Boolean(collisionError)}
                className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
                  collisionError
                    ? 'bg-stone-300 text-stone-600 cursor-not-allowed'
                    : 'bg-[#F1BF70] hover:bg-[#E5A84D] text-[#36402E] shadow-sm hover:shadow active:scale-95'
                }`}
              >
                {isSubmitting ? (
                  <span>Enviando solicitud...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Enviar Solicitud de Reserva</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
