import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  Ban,
  ArrowRight,
  Info
} from 'lucide-react';
import { PublicAvailabilitySlot } from '../types';

interface AvailabilityCalendarProps {
  slots: PublicAvailabilitySlot[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onGoToBooking: () => void;
}

export const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  slots,
  selectedDate,
  onSelectDate,
  onGoToBooking
}) => {
  // Current viewed month (using year 2026 as reference from metadata)
  const [viewDate, setViewDate] = useState(() => {
    const today = new Date();
    // Ensure we start at current month
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth(); // 0-indexed

  // Month names in Spanish
  const monthNames = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ];

  const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  // Days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Day of week for 1st of month (0 = Sunday, 1 = Monday)
  let firstDayIndex = new Date(year, month, 1).getDay();
  // Adjust so Monday is 0, Sunday is 6
  firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  const prevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  // Helper format YYYY-MM-DD
  const formatDateString = (d: number): string => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  // Determine availability status for day
  const getDayStatus = (dateStr: string) => {
    const daySlots = slots.filter((s) => s.date === dateStr);
    if (daySlots.length === 0) {
      return { status: 'free', label: 'Disponible', count: 0 };
    }

    // Check if full day is blocked
    const hasFullDayBlock = daySlots.some((s) => s.status === 'blocked' && s.isFullDay);
    if (hasFullDayBlock) {
      return { status: 'blocked', label: 'Bloqueado', count: daySlots.length };
    }

    // If more than 1 active slot, likely fully booked
    if (daySlots.length >= 2) {
      return { status: 'busy', label: 'Completo', count: daySlots.length };
    }

    return { status: 'partial', label: 'Turno libre', count: daySlots.length };
  };

  // Get slots for the selected day
  const selectedDaySlots = slots.filter((s) => s.date === selectedDate);
  const selectedDayStatus = getDayStatus(selectedDate);

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <section id="calendario" className="py-16 md:py-24 bg-[#FFF9F1] border-b border-[#C39D70]/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#707A63] bg-[#9AA08A]/15 px-3.5 py-1 rounded-full">
            Calendario en Tiempo Real
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#36402E] mt-3 font-heading">
            Consulta la disponibilidad del local
          </h2>
          <p className="text-[#5B6651] mt-3 text-base">
            Selecciona un día en el calendario para ver los turnos disponibles. Los días u horarios bloqueados u ocupados se actualizan automáticamente.
          </p>
        </div>

        {/* Calendar Card and Day Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Month Grid */}
          <div className="lg:col-span-7 bg-[#F8EFE1] p-6 sm:p-8 rounded-3xl border border-[#C39D70]/30 shadow-sm">
            {/* Calendar Controls */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#C39D70]/20">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-[#707A63]" />
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#36402E] font-heading capitalize">
                  {monthNames[month]} {year}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={prevMonth}
                  className="w-9 h-9 rounded-xl bg-[#FFF9F1] border border-[#C39D70]/30 hover:border-[#707A63] flex items-center justify-center text-[#707A63] transition cursor-pointer"
                  aria-label="Mes anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextMonth}
                  className="w-9 h-9 rounded-xl bg-[#FFF9F1] border border-[#C39D70]/30 hover:border-[#707A63] flex items-center justify-center text-[#707A63] transition cursor-pointer"
                  aria-label="Mes siguiente"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-extrabold text-[#707A63] uppercase tracking-wider mb-2">
              {daysOfWeek.map((day) => (
                <div key={day} className="py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {/* Empty placeholder days for first day offset */}
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square opacity-0 pointer-events-none" />
              ))}

              {/* Month days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dateStr = formatDateString(dayNum);
                const isSelected = dateStr === selectedDate;
                const dayStatus = getDayStatus(dateStr);
                const isPast = dateStr < todayStr;

                return (
                  <button
                    key={dateStr}
                    onClick={() => onSelectDate(dateStr)}
                    className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center text-xs sm:text-sm font-bold transition duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-[#707A63] text-white shadow-md ring-2 ring-[#707A63]/50 scale-102 z-10'
                        : isPast
                        ? 'bg-[#EFE7D8]/60 text-[#8E9685] hover:bg-[#EFE7D8]'
                        : 'bg-[#FFF9F1] text-[#36402E] hover:border-[#707A63] border border-[#C39D70]/20'
                    }`}
                  >
                    <span>{dayNum}</span>

                    {/* Status Dot */}
                    {!isPast && (
                      <div className="mt-1 flex items-center gap-0.5">
                        {dayStatus.status === 'free' && (
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isSelected ? 'bg-[#F1BF70]' : 'bg-emerald-500'
                            }`}
                            title="Completamente disponible"
                          />
                        )}
                        {dayStatus.status === 'partial' && (
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isSelected ? 'bg-white' : 'bg-amber-500'
                            }`}
                            title="Turno libre disponible"
                          />
                        )}
                        {(dayStatus.status === 'busy' || dayStatus.status === 'blocked') && (
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isSelected ? 'bg-red-200' : 'bg-rose-500'
                            }`}
                            title="Completo o bloqueado"
                          />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-[#C39D70]/20 flex flex-wrap items-center justify-between gap-3 text-xs text-[#5B6651]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="font-semibold">Disponible</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="font-semibold">Parcialmente libre</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="font-semibold">Ocupado / Bloqueado</span>
              </div>
            </div>
          </div>

          {/* Right Detail Card for Selected Date */}
          <div className="lg:col-span-5 bg-[#F8EFE1] p-6 sm:p-7 rounded-3xl border border-[#C39D70]/30 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#C39D70]/20">
                <span className="text-xs font-extrabold uppercase text-[#707A63] tracking-wider">
                  Detalle del día seleccionado
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#FFF9F1] border border-[#C39D70]/30 text-[#36402E]">
                  {selectedDate}
                </span>
              </div>

              <div className="my-5">
                <h4 className="text-2xl font-extrabold text-[#36402E] font-heading">
                  {new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-ES', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </h4>

                {/* Status summary banner */}
                <div className="mt-4">
                  {selectedDayStatus.status === 'free' && (
                    <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-emerald-800 text-xs">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                      <div>
                        <strong className="block font-bold">¡Día totalmente libre!</strong>
                        Puedes reservar el turno de mañana, de tarde o el día completo.
                      </div>
                    </div>
                  )}

                  {selectedDayStatus.status === 'partial' && (
                    <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-amber-800 text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                      <div>
                        <strong className="block font-bold">Tiene horarios ocupados</strong>
                        Hay turnos libres disponibles que no se solapan con los eventos ya registrados.
                      </div>
                    </div>
                  )}

                  {selectedDayStatus.status === 'busy' && (
                    <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-800 text-xs">
                      <Ban className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                      <div>
                        <strong className="block font-bold">Día completo ocupado</strong>
                        No hay más turnos disponibles para esta fecha. Te recomendamos elegir otro día.
                      </div>
                    </div>
                  )}

                  {selectedDayStatus.status === 'blocked' && (
                    <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-800 text-xs">
                      <Ban className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                      <div>
                        <strong className="block font-bold">Fecha no disponible</strong>
                        Este día ha sido bloqueado por el propietario (mantenimiento o uso privado).
                      </div>
                    </div>
                  )}
                </div>

                {/* Existing reservations/blocks on this day (anonymized) */}
                <div className="mt-5 space-y-2">
                  <span className="text-xs font-bold text-[#707A63] uppercase tracking-wide block">
                    Horarios registrados:
                  </span>

                  {selectedDaySlots.length === 0 ? (
                    <p className="text-xs text-[#5B6651] italic bg-[#FFF9F1] p-3 rounded-xl border border-[#C39D70]/20">
                      No hay reservas registradas para este día. ¡Todo el horario está libre!
                    </p>
                  ) : (
                    selectedDaySlots.map((slot) => (
                      <div
                        key={slot.id}
                        className="bg-[#FFF9F1] p-3 rounded-xl border border-[#C39D70]/25 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-[#707A63]" />
                          <span className="font-extrabold text-[#36402E]">
                            {slot.isFullDay ? 'Día Completo' : `${slot.startTime} a ${slot.endTime} h`}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            slot.status === 'confirmed'
                              ? 'bg-rose-100 text-rose-800'
                              : slot.status === 'blocked'
                              ? 'bg-stone-200 text-stone-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {slot.status === 'confirmed'
                            ? 'Ocupado (Confirmado)'
                            : slot.status === 'blocked'
                            ? 'Bloqueado'
                            : 'Pendiente de confirmación'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Quick Button to go to booking form with preselected date */}
            <div className="mt-6 pt-4 border-t border-[#C39D70]/20">
              <button
                onClick={onGoToBooking}
                disabled={selectedDayStatus.status === 'busy' || selectedDayStatus.status === 'blocked'}
                className={`w-full py-3.5 px-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
                  selectedDayStatus.status === 'busy' || selectedDayStatus.status === 'blocked'
                    ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                    : 'bg-[#F1BF70] hover:bg-[#E5A84D] text-[#36402E] shadow-sm hover:shadow active:scale-95'
                }`}
              >
                <span>Solicitar reserva para el {selectedDate}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-[#707A63] justify-center">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>Sin registro ni cuenta de usuario obligatoria</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
