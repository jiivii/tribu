import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Calendar,
  CheckCircle,
  XCircle,
  Trash2,
  Plus,
  Ban,
  Clock,
  Phone,
  Mail,
  User,
  Settings,
  ShieldAlert,
  Save,
  Key,
  ExternalLink,
  Edit,
  Database,
  RefreshCw,
  LogOut,
  AlertTriangle,
  Info
} from 'lucide-react';
import { Booking, BlockedSlot, BusinessConfig } from '../types';
import { DEMO_MODE, DEMO_NOTICE } from '../demo/demoMode';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminToken: string | null;
  onLoginSuccess: (token: string) => void;
  onLogout: () => void;
  onDataModified: () => void;
  businessConfig: BusinessConfig | null;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  adminToken,
  onLoginSuccess,
  onLogout,
  onDataModified,
  businessConfig
}) => {
  // Authentication state
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active admin tab
  const [activeTab, setActiveTab] = useState<'bookings' | 'new-booking' | 'blocks' | 'config' | 'security'>('bookings');

  // Bookings state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsFilter, setBookingsFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  // Blocks state
  const [blocks, setBlocks] = useState<BlockedSlot[]>([]);
  const [newBlockDate, setNewBlockDate] = useState('');
  const [newBlockIsFullDay, setNewBlockIsFullDay] = useState(true);
  const [newBlockStartTime, setNewBlockStartTime] = useState('10:00');
  const [newBlockEndTime, setNewBlockEndTime] = useState('14:30');
  const [newBlockReason, setNewBlockReason] = useState('Mantenimiento del local');

  // Manual booking form state
  const [manualBooking, setManualBooking] = useState({
    clientName: '',
    clientLastName: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '16:30',
    endTime: '21:30',
    phone: '',
    email: '',
    eventType: 'Cumpleaños infantil',
    guests: '20',
    notes: 'Reserva telefónica',
    adminNotes: ''
  });
  const [manualBookingError, setManualBookingError] = useState<string | null>(null);
  const [manualBookingSuccess, setManualBookingSuccess] = useState<string | null>(null);

  // Config editor state
  const [editableConfig, setEditableConfig] = useState<BusinessConfig | null>(businessConfig);
  const [configSaveSuccess, setConfigSaveSuccess] = useState<string | null>(null);

  // Password change state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passChangeMessage, setPassChangeMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load bookings and blocks when authenticated
  useEffect(() => {
    if (adminToken && isOpen) {
      loadAdminData();
    }
    if (businessConfig) {
      setEditableConfig(JSON.parse(JSON.stringify(businessConfig)));
    }
  }, [adminToken, isOpen, businessConfig]);

  const loadAdminData = async () => {
    if (!adminToken) return;
    setIsLoadingBookings(true);
    try {
      const [resBookings, resBlocks] = await Promise.all([
        fetch('/api/admin/bookings', {
          headers: { Authorization: `Bearer ${adminToken}` }
        }),
        fetch('/api/admin/blocks', {
          headers: { Authorization: `Bearer ${adminToken}` }
        })
      ]);

      if (resBookings.ok) {
        const data = await resBookings.json();
        setBookings(data);
      }
      if (resBlocks.ok) {
        const blocksData = await resBlocks.json();
        setBlocks(blocksData);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Contraseña incorrecta.');
      }

      onLoginSuccess(data.token);
      setPasswordInput('');
    } catch (err: any) {
      setLoginError(err.message || 'Error de conexión.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleUpdateBookingStatus = async (id: string, status: 'confirmed' | 'cancelled' | 'pending') => {
    if (!adminToken) return;
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status })
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Error al actualizar reserva');
        return;
      }

      await loadAdminData();
      onDataModified();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!adminToken) return;
    if (!confirm('¿Estás seguro de que deseas eliminar permanentemente esta reserva?')) return;

    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      if (res.ok) {
        await loadAdminData();
        onDataModified();
      }
    } catch (err) {
      console.error('Error deleting booking:', err);
    }
  };

  const handleCreateManualBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setManualBookingError(null);
    setManualBookingSuccess(null);

    if (!adminToken) return;

    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          ...manualBooking,
          status: 'confirmed',
          source: 'phone'
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'No se pudo crear la reserva');
      }

      setManualBookingSuccess(`¡Reserva manual creada correctamente con código ${data.booking.trackingCode}!`);
      setManualBooking({
        clientName: '',
        clientLastName: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '16:30',
        endTime: '21:30',
        phone: '',
        email: '',
        eventType: 'Cumpleaños infantil',
        guests: '20',
        notes: '',
        adminNotes: ''
      });

      await loadAdminData();
      onDataModified();
    } catch (err: any) {
      setManualBookingError(err.message);
    }
  };

  const handleCreateBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken || !newBlockDate) return;

    try {
      const res = await fetch('/api/admin/blocks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          date: newBlockDate,
          isFullDay: newBlockIsFullDay,
          startTime: newBlockIsFullDay ? undefined : newBlockStartTime,
          endTime: newBlockIsFullDay ? undefined : newBlockEndTime,
          reason: newBlockReason
        })
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Error al bloquear fecha');
        return;
      }

      setNewBlockDate('');
      await loadAdminData();
      onDataModified();
    } catch (err) {
      console.error('Error creating block:', err);
    }
  };

  const handleDeleteBlock = async (id: string) => {
    if (!adminToken) return;
    try {
      const res = await fetch(`/api/admin/blocks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      if (res.ok) {
        await loadAdminData();
        onDataModified();
      }
    } catch (err) {
      console.error('Error deleting block:', err);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken || !editableConfig) return;

    try {
      const res = await fetch('/api/admin/business-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(editableConfig)
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Error al guardar los datos');
        return;
      }

      setConfigSaveSuccess('¡Datos del local guardados con éxito en el servidor!');
      setTimeout(() => setConfigSaveSuccess(null), 4000);
      onDataModified();
    } catch (err) {
      console.error('Error saving config:', err);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;
    setPassChangeMessage(null);

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          currentPassword: currentPass,
          newPassword: newPass
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al cambiar contraseña');
      }

      setPassChangeMessage({ type: 'success', text: '¡Contraseña actualizada correctamente!' });
      setCurrentPass('');
      setNewPass('');
    } catch (err: any) {
      setPassChangeMessage({ type: 'error', text: err.message });
    }
  };

  if (!isOpen) return null;

  const filteredBookings = bookings.filter((b) => {
    if (bookingsFilter === 'all') return true;
    return b.status === bookingsFilter;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#FFF9F1] rounded-3xl w-full max-w-5xl my-auto border border-[#C39D70]/40 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-[#707A63] text-[#FFF9F1] px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FFF9F1]/20 flex items-center justify-center text-[#F1BF70]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base font-heading tracking-wide">
                Panel de Administración del Propietario
              </h3>
              <p className="text-[11px] text-[#FFF9F1]/80">
                Gestión privada de reservas, disponibilidad y datos del negocio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {adminToken && (
              <button
                onClick={onLogout}
                className="text-xs bg-[#FFF9F1]/20 hover:bg-[#FFF9F1]/30 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
                title="Cerrar sesión"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-[#FFF9F1]/80 hover:text-white p-1 rounded-lg transition"
              aria-label="Cerrar modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {DEMO_MODE ? (
          /* MODO DEMO: sin backend no hay login ni datos reales, se explica en
             lugar de mostrar controles que no harían nada. */
          <div className="p-8 sm:p-12 max-w-md mx-auto w-full my-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center mx-auto">
              <Database className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-2xl font-extrabold text-[#36402E] font-heading">
                Panel no disponible en la demo
              </h4>
              <p className="text-xs text-[#5B6651] mt-2 leading-relaxed">
                <strong>{DEMO_NOTICE}</strong> El panel de administración necesita el backend
                (server.ts + Express) para iniciar sesión, leer y modificar reservas, bloquear fechas
                o guardar los datos del local. Esta publicación en GitHub Pages es únicamente una
                demostración visual.
              </p>
            </div>

            <div className="p-3 bg-[#F8EFE1] border border-[#C39D70]/30 rounded-xl text-left text-[11px] text-[#707A63] leading-relaxed">
              💡 <strong>¿Eres el propietario?</strong> Despliega el proyecto con el backend real
              (por ejemplo en un servidor con Node.js) y desactiva el modo demo para usar el acceso
              privado con contraseña.
            </div>

            <button
              onClick={onClose}
              className="w-full bg-[#707A63] hover:bg-[#5B6651] text-[#FFF9F1] font-bold text-sm py-3 rounded-xl transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <X className="w-4 h-4 text-[#F1BF70]" />
              <span>Cerrar y volver a la web</span>
            </button>
          </div>
        ) : !adminToken ? (
          /* LOGIN SCREEN */
          <div className="p-8 sm:p-12 max-w-md mx-auto w-full my-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#707A63]/15 text-[#707A63] flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-2xl font-extrabold text-[#36402E] font-heading">
                Identificación de Propietario
              </h4>
              <p className="text-xs text-[#5B6651] mt-2 leading-relaxed">
                Esta sección está protegida para que los visitantes no puedan ver datos personales de clientes ni modificar reservas.
              </p>
            </div>

            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-[#36402E] mb-1.5">
                  Contraseña de acceso
                </label>
                <input
                  type="password"
                  required
                  placeholder="Introduce la contraseña"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-[#F8EFE1] border border-[#C39D70]/40 rounded-xl px-4 py-3 text-sm text-[#36402E] focus:outline-none focus:ring-2 focus:ring-[#707A63]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-[#707A63] hover:bg-[#5B6651] text-[#FFF9F1] font-bold text-sm py-3 rounded-xl transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Key className="w-4 h-4 text-[#F1BF70]" />
                <span>{isLoggingIn ? 'Comprobando...' : 'Entrar al Panel'}</span>
              </button>
            </form>

            <div className="p-3 bg-[#F8EFE1] border border-[#C39D70]/30 rounded-xl text-left text-[11px] text-[#707A63] leading-relaxed">
              💡 <strong>Nota de configuración:</strong> La contraseña provisional por defecto es{' '}
              <code className="bg-[#FFF9F1] px-1.5 py-0.5 rounded font-mono font-bold text-[#36402E]">
                admin123
              </code>
              . Podrás cambiarla a una propia en cualquier momento desde la pestaña "Seguridad".
            </div>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN PANEL */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Admin Tabs */}
            <div className="bg-[#F8EFE1] border-b border-[#C39D70]/30 px-6 py-2.5 flex flex-wrap gap-2 shrink-0">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer ${
                  activeTab === 'bookings'
                    ? 'bg-[#707A63] text-white shadow-xs'
                    : 'text-[#707A63] hover:bg-[#9AA08A]/20'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Reservas ({bookings.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('new-booking')}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer ${
                  activeTab === 'new-booking'
                    ? 'bg-[#707A63] text-white shadow-xs'
                    : 'text-[#707A63] hover:bg-[#9AA08A]/20'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nueva Reserva Telefónica</span>
              </button>

              <button
                onClick={() => setActiveTab('blocks')}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer ${
                  activeTab === 'blocks'
                    ? 'bg-[#707A63] text-white shadow-xs'
                    : 'text-[#707A63] hover:bg-[#9AA08A]/20'
                }`}
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Bloquear Fechas ({blocks.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('config')}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer ${
                  activeTab === 'config'
                    ? 'bg-[#707A63] text-white shadow-xs'
                    : 'text-[#707A63] hover:bg-[#9AA08A]/20'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Editar Datos del Local</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer ${
                  activeTab === 'security'
                    ? 'bg-[#707A63] text-white shadow-xs'
                    : 'text-[#707A63] hover:bg-[#9AA08A]/20'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>Seguridad & Persistencia</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* TAB 1: RESERVAS */}
              {activeTab === 'bookings' && (
                <div className="space-y-4">
                  {/* Filter Sub-bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F8EFE1] p-3 rounded-2xl border border-[#C39D70]/20">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#707A63]">Filtrar por estado:</span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => setBookingsFilter('all')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                            bookingsFilter === 'all' ? 'bg-[#707A63] text-white' : 'bg-[#FFF9F1] text-[#707A63]'
                          }`}
                        >
                          Todas ({bookings.length})
                        </button>
                        <button
                          onClick={() => setBookingsFilter('pending')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                            bookingsFilter === 'pending' ? 'bg-amber-600 text-white' : 'bg-[#FFF9F1] text-amber-800'
                          }`}
                        >
                          Pendientes ({bookings.filter((b) => b.status === 'pending').length})
                        </button>
                        <button
                          onClick={() => setBookingsFilter('confirmed')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                            bookingsFilter === 'confirmed' ? 'bg-emerald-700 text-white' : 'bg-[#FFF9F1] text-emerald-800'
                          }`}
                        >
                          Confirmadas ({bookings.filter((b) => b.status === 'confirmed').length})
                        </button>
                        <button
                          onClick={() => setBookingsFilter('cancelled')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                            bookingsFilter === 'cancelled' ? 'bg-rose-700 text-white' : 'bg-[#FFF9F1] text-rose-800'
                          }`}
                        >
                          Canceladas ({bookings.filter((b) => b.status === 'cancelled').length})
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={loadAdminData}
                      className="text-xs text-[#707A63] hover:text-[#36402E] flex items-center gap-1 font-bold"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Actualizar</span>
                    </button>
                  </div>

                  {isLoadingBookings ? (
                    <div className="py-12 text-center text-xs text-[#707A63]">Cargando reservas...</div>
                  ) : filteredBookings.length === 0 ? (
                    <div className="py-12 text-center bg-[#F8EFE1] rounded-2xl border border-[#C39D70]/20 text-xs text-[#707A63]">
                      No hay reservas registradas con este filtro.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredBookings.map((b) => (
                        <div
                          key={b.id}
                          className="bg-[#FFF9F1] p-4 sm:p-5 rounded-2xl border border-[#C39D70]/30 shadow-xs hover:border-[#707A63] transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          <div className="space-y-1.5 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-xs font-black bg-[#F8EFE1] px-2 py-0.5 rounded border border-[#C39D70]/30 text-[#36402E]">
                                {b.trackingCode}
                              </span>
                              <h4 className="font-extrabold text-base text-[#36402E]">
                                {b.clientName} {b.clientLastName}
                              </h4>
                              <span
                                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                                  b.status === 'confirmed'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : b.status === 'pending'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {b.status === 'confirmed'
                                  ? 'Confirmada'
                                  : b.status === 'pending'
                                  ? 'Pendiente'
                                  : 'Cancelada'}
                              </span>
                              <span className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                                {b.source === 'phone' ? '📞 Teléfono' : b.source === 'manual' ? '✏️ Manual' : '🌐 Web'}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#5B6651]">
                              <span className="flex items-center gap-1 font-bold text-[#36402E]">
                                <Calendar className="w-3.5 h-3.5 text-[#707A63]" />
                                {b.date} ({b.startTime} a {b.endTime} h)
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="w-3.5 h-3.5 text-[#707A63]" />
                                <a href={`tel:${b.phone}`} className="hover:underline font-semibold">
                                  {b.phone}
                                </a>
                              </span>
                              <span className="flex items-center gap-1">
                                <Mail className="w-3.5 h-3.5 text-[#707A63]" />
                                <a href={`mailto:${b.email}`} className="hover:underline">
                                  {b.email}
                                </a>
                              </span>
                            </div>

                            <div className="text-xs text-[#5B6651] pt-1">
                              <span className="font-semibold text-[#707A63]">Evento:</span> {b.eventType}
                              {b.guests && <span> • <strong>{b.guests}</strong> invitados</span>}
                              {b.notes && (
                                <p className="italic text-[#707A63] bg-[#F8EFE1] p-2 rounded-lg mt-1 text-[11px]">
                                  "{b.notes}"
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Quick Admin Action Buttons */}
                          <div className="flex flex-wrap items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0">
                            {b.status !== 'confirmed' && (
                              <button
                                onClick={() => handleUpdateBookingStatus(b.id, 'confirmed')}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 shadow-xs transition"
                                title="Confirmar reserva"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Confirmar</span>
                              </button>
                            )}

                            {b.status !== 'cancelled' && (
                              <button
                                onClick={() => handleUpdateBookingStatus(b.id, 'cancelled')}
                                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 shadow-xs transition"
                                title="Cancelar reserva"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Cancelar</span>
                              </button>
                            )}

                            {b.status === 'cancelled' && (
                              <button
                                onClick={() => handleUpdateBookingStatus(b.id, 'pending')}
                                className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 shadow-xs transition"
                                title="Reactivar como pendiente"
                              >
                                <span>Reactivar</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteBooking(b.id)}
                              className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-2 rounded-xl transition"
                              title="Eliminar permanentemente"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: NUEVA RESERVA TELEFÓNICA / MANUAL */}
              {activeTab === 'new-booking' && (
                <div className="max-w-2xl mx-auto space-y-6">
                  <div>
                    <h4 className="text-xl font-extrabold text-[#36402E] font-heading">
                      Añadir Reserva Telefónica o Presencial
                    </h4>
                    <p className="text-xs text-[#5B6651] mt-1">
                      Usa este formulario cuando recibas una reserva por teléfono, WhatsApp o en persona. Se guardará con estado Confirmada y bloqueará ese tramo horario en el calendario público.
                    </p>
                  </div>

                  {manualBookingSuccess && (
                    <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{manualBookingSuccess}</span>
                    </div>
                  )}

                  {manualBookingError && (
                    <div className="p-4 bg-rose-50 border border-rose-300 text-rose-800 text-xs font-semibold rounded-2xl flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{manualBookingError}</span>
                    </div>
                  )}

                  <form onSubmit={handleCreateManualBooking} className="bg-[#F8EFE1] p-6 rounded-3xl border border-[#C39D70]/30 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#36402E] mb-1">
                          Nombre del cliente *
                        </label>
                        <input
                          type="text"
                          required
                          value={manualBooking.clientName}
                          onChange={(e) => setManualBooking({ ...manualBooking, clientName: e.target.value })}
                          className="w-full bg-[#FFF9F1] border border-[#C39D70]/40 rounded-xl px-3 py-2 text-xs font-medium text-[#36402E]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#36402E] mb-1">
                          Apellidos *
                        </label>
                        <input
                          type="text"
                          required
                          value={manualBooking.clientLastName}
                          onChange={(e) => setManualBooking({ ...manualBooking, clientLastName: e.target.value })}
                          className="w-full bg-[#FFF9F1] border border-[#C39D70]/40 rounded-xl px-3 py-2 text-xs font-medium text-[#36402E]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#36402E] mb-1">
                          Teléfono de contacto *
                        </label>
                        <input
                          type="tel"
                          required
                          value={manualBooking.phone}
                          onChange={(e) => setManualBooking({ ...manualBooking, phone: e.target.value })}
                          className="w-full bg-[#FFF9F1] border border-[#C39D70]/40 rounded-xl px-3 py-2 text-xs font-medium text-[#36402E]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#36402E] mb-1">
                          Correo electrónico
                        </label>
                        <input
                          type="email"
                          value={manualBooking.email}
                          onChange={(e) => setManualBooking({ ...manualBooking, email: e.target.value })}
                          className="w-full bg-[#FFF9F1] border border-[#C39D70]/40 rounded-xl px-3 py-2 text-xs font-medium text-[#36402E]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <div>
                        <label className="block text-xs font-bold text-[#36402E] mb-1">
                          Fecha *
                        </label>
                        <input
                          type="date"
                          required
                          value={manualBooking.date}
                          onChange={(e) => setManualBooking({ ...manualBooking, date: e.target.value })}
                          className="w-full bg-[#FFF9F1] border border-[#C39D70]/40 rounded-xl px-3 py-2 text-xs font-medium text-[#36402E]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#36402E] mb-1">
                          Hora inicio *
                        </label>
                        <input
                          type="time"
                          required
                          value={manualBooking.startTime}
                          onChange={(e) => setManualBooking({ ...manualBooking, startTime: e.target.value })}
                          className="w-full bg-[#FFF9F1] border border-[#C39D70]/40 rounded-xl px-3 py-2 text-xs font-medium text-[#36402E]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#36402E] mb-1">
                          Hora fin *
                        </label>
                        <input
                          type="time"
                          required
                          value={manualBooking.endTime}
                          onChange={(e) => setManualBooking({ ...manualBooking, endTime: e.target.value })}
                          className="w-full bg-[#FFF9F1] border border-[#C39D70]/40 rounded-xl px-3 py-2 text-xs font-medium text-[#36402E]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-xs font-bold text-[#36402E] mb-1">
                          Tipo de evento
                        </label>
                        <input
                          type="text"
                          value={manualBooking.eventType}
                          onChange={(e) => setManualBooking({ ...manualBooking, eventType: e.target.value })}
                          className="w-full bg-[#FFF9F1] border border-[#C39D70]/40 rounded-xl px-3 py-2 text-xs font-medium text-[#36402E]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#36402E] mb-1">
                          Nº de invitados
                        </label>
                        <input
                          type="number"
                          value={manualBooking.guests}
                          onChange={(e) => setManualBooking({ ...manualBooking, guests: e.target.value })}
                          className="w-full bg-[#FFF9F1] border border-[#C39D70]/40 rounded-xl px-3 py-2 text-xs font-medium text-[#36402E]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#36402E] mb-1">
                        Notas internas del propietario
                      </label>
                      <textarea
                        rows={2}
                        value={manualBooking.adminNotes}
                        onChange={(e) => setManualBooking({ ...manualBooking, adminNotes: e.target.value })}
                        placeholder="Ej. Fianza pagada en mano de 50€, avisar si llegan 15 min antes..."
                        className="w-full bg-[#FFF9F1] border border-[#C39D70]/40 rounded-xl px-3 py-2 text-xs font-medium text-[#36402E]"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#707A63] hover:bg-[#5B6651] text-[#FFF9F1] font-bold text-sm py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-[#F1BF70]" />
                      <span>Registrar Reserva Confirmada</span>
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 3: BLOQUEAR FECHAS U HORARIOS */}
              {activeTab === 'blocks' && (
                <div className="space-y-6 max-w-3xl mx-auto">
                  <div>
                    <h4 className="text-xl font-extrabold text-[#36402E] font-heading">
                      Bloquear Fechas u Horarios Manualmente
                    </h4>
                    <p className="text-xs text-[#5B6651] mt-1">
                      Los días u horarios que bloquees aquí no podrán ser reservados por ningún visitante en el calendario público.
                    </p>
                  </div>

                  {/* Add Block Form */}
                  <form onSubmit={handleCreateBlock} className="bg-[#F8EFE1] p-5 rounded-2xl border border-[#C39D70]/30 space-y-4">
                    <span className="text-xs font-extrabold uppercase text-[#707A63] block">
                      Añadir nuevo bloqueo
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#36402E] mb-1">
                          Fecha a bloquear *
                        </label>
                        <input
                          type="date"
                          required
                          value={newBlockDate}
                          onChange={(e) => setNewBlockDate(e.target.value)}
                          className="w-full bg-[#FFF9F1] border border-[#C39D70]/40 rounded-xl px-3 py-2 text-xs font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#36402E] mb-1">
                          Motivo del bloqueo
                        </label>
                        <input
                          type="text"
                          value={newBlockReason}
                          onChange={(e) => setNewBlockReason(e.target.value)}
                          placeholder="Ej. Vacaciones, Mantenimiento, Fiesta familiar del dueño"
                          className="w-full bg-[#FFF9F1] border border-[#C39D70]/40 rounded-xl px-3 py-2 text-xs font-medium"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pt-1">
                      <label className="flex items-center gap-2 text-xs font-bold text-[#36402E] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newBlockIsFullDay}
                          onChange={(e) => setNewBlockIsFullDay(e.target.checked)}
                          className="rounded text-[#707A63]"
                        />
                        <span>Bloquear todo el día completo</span>
                      </label>
                    </div>

                    {!newBlockIsFullDay && (
                      <div className="grid grid-cols-2 gap-4 pt-1">
                        <div>
                          <label className="block text-xs font-bold text-[#36402E] mb-1">
                            Hora inicio bloqueo
                          </label>
                          <input
                            type="time"
                            value={newBlockStartTime}
                            onChange={(e) => setNewBlockStartTime(e.target.value)}
                            className="w-full bg-[#FFF9F1] border border-[#C39D70]/40 rounded-xl px-3 py-2 text-xs font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#36402E] mb-1">
                            Hora fin bloqueo
                          </label>
                          <input
                            type="time"
                            value={newBlockEndTime}
                            onChange={(e) => setNewBlockEndTime(e.target.value)}
                            className="w-full bg-[#FFF9F1] border border-[#C39D70]/40 rounded-xl px-3 py-2 text-xs font-medium"
                          />
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="bg-[#707A63] hover:bg-[#5B6651] text-[#FFF9F1] font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Ban className="w-3.5 h-3.5 text-[#F1BF70]" />
                      <span>Guardar Bloqueo</span>
                    </button>
                  </form>

                  {/* List of current blocks */}
                  <div className="space-y-2">
                    <span className="text-xs font-extrabold uppercase text-[#707A63] block">
                      Bloqueos activos ({blocks.length})
                    </span>

                    {blocks.length === 0 ? (
                      <p className="text-xs text-[#5B6651] bg-[#F8EFE1] p-4 rounded-xl border border-[#C39D70]/20">
                        No hay ninguna fecha ni horario bloqueado actualmente.
                      </p>
                    ) : (
                      blocks.map((bl) => (
                        <div
                          key={bl.id}
                          className="bg-[#FFF9F1] p-3.5 rounded-xl border border-[#C39D70]/30 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-extrabold text-[#36402E]">{bl.date}</span>
                            <span className="text-[#707A63] ml-2">
                              {bl.isFullDay ? '(Día completo)' : `(${bl.startTime} a ${bl.endTime} h)`}
                            </span>
                            <p className="text-[11px] text-[#5B6651] mt-0.5">Motivo: {bl.reason}</p>
                          </div>

                          <button
                            onClick={() => handleDeleteBlock(bl.id)}
                            className="text-rose-600 hover:text-rose-800 p-1.5 hover:bg-rose-50 rounded-lg transition"
                            title="Eliminar bloqueo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: CONFIGURACIÓN DEL LOCAL (TEXTOS PROVISIONALES) */}
              {activeTab === 'config' && editableConfig && (
                <form onSubmit={handleSaveConfig} className="max-w-3xl mx-auto space-y-6">
                  <div>
                    <h4 className="text-xl font-extrabold text-[#36402E] font-heading">
                      Personalización de Textos Provisionales
                    </h4>
                    <p className="text-xs text-[#5B6651] mt-1">
                      Edita el nombre del local, teléfono, correo, dirección y tarifas directamente. Los cambios se guardan permanentemente en el servidor.
                    </p>
                  </div>

                  {configSaveSuccess && (
                    <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{configSaveSuccess}</span>
                    </div>
                  )}

                  <div className="bg-[#F8EFE1] p-6 rounded-3xl border border-[#C39D70]/30 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#36402E] mb-1">
                          Nombre del local
                        </label>
                        <input
                          type="text"
                          value={editableConfig.name}
                          onChange={(e) => setEditableConfig({ ...editableConfig, name: e.target.value })}
                          className="w-full bg-[#FFF9F1] border border-[#C39D70]/40 rounded-xl px-3 py-2 text-xs font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#36402E] mb-1">
                          Lema / Subtítulo
                        </label>
                        <input
                          type="text"
                          value={editableConfig.tagline}
                          onChange={(e) => setEditableConfig({ ...editableConfig, tagline: e.target.value })}
                          className="w-full bg-[#FFF9F1] border border-[#C39D70]/40 rounded-xl px-3 py-2 text-xs font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#36402E] mb-1">
                          Teléfono de contacto (Editable)
                        </label>
                        <input
                          type="text"
                          value={editableConfig.phone}
                          onChange={(e) => setEditableConfig({ ...editableConfig, phone: e.target.value })}
                          className="w-full bg-[#FFF9F1] border border-[#C39D70]/40 rounded-xl px-3 py-2 text-xs font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#36402E] mb-1">
                          WhatsApp de contacto
                        </label>
                        <input
                          type="text"
                          value={editableConfig.whatsapp}
                          onChange={(e) => setEditableConfig({ ...editableConfig, whatsapp: e.target.value })}
                          className="w-full bg-[#FFF9F1] border border-[#C39D70]/40 rounded-xl px-3 py-2 text-xs font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#36402E] mb-1">
                          Email de contacto (Editable)
                        </label>
                        <input
                          type="text"
                          value={editableConfig.email}
                          onChange={(e) => setEditableConfig({ ...editableConfig, email: e.target.value })}
                          className="w-full bg-[#FFF9F1] border border-[#C39D70]/40 rounded-xl px-3 py-2 text-xs font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#36402E] mb-1">
                          Aforo máximo (personas)
                        </label>
                        <input
                          type="number"
                          value={editableConfig.capacityMax}
                          onChange={(e) => setEditableConfig({ ...editableConfig, capacityMax: Number(e.target.value) })}
                          className="w-full bg-[#FFF9F1] border border-[#C39D70]/40 rounded-xl px-3 py-2 text-xs font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#36402E] mb-1">
                        Dirección física completa
                      </label>
                      <input
                        type="text"
                        value={editableConfig.address}
                        onChange={(e) => setEditableConfig({ ...editableConfig, address: e.target.value })}
                        className="w-full bg-[#FFF9F1] border border-[#C39D70]/40 rounded-xl px-3 py-2 text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#36402E] mb-1">
                        Indicaciones de transporte ("Cómo llegar")
                      </label>
                      <textarea
                        rows={2}
                        value={editableConfig.howToArrive}
                        onChange={(e) => setEditableConfig({ ...editableConfig, howToArrive: e.target.value })}
                        className="w-full bg-[#FFF9F1] border border-[#C39D70]/40 rounded-xl px-3 py-2 text-xs font-medium"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="bg-[#707A63] hover:bg-[#5B6651] text-[#FFF9F1] font-bold text-xs px-6 py-3 rounded-xl transition flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4 text-[#F1BF70]" />
                      <span>Guardar Cambios en el Negocio</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 5: SEGURIDAD & PERSISTENCIA */}
              {activeTab === 'security' && (
                <div className="max-w-2xl mx-auto space-y-6">
                  <div>
                    <h4 className="text-xl font-extrabold text-[#36402E] font-heading">
                      Seguridad y Persistencia de Datos
                    </h4>
                    <p className="text-xs text-[#5B6651] mt-1">
                      Gestiona la clave del administrador y consulta la información técnica de persistencia.
                    </p>
                  </div>

                  {/* Change Password */}
                  <form onSubmit={handleChangePassword} className="bg-[#F8EFE1] p-6 rounded-3xl border border-[#C39D70]/30 space-y-4">
                    <span className="text-xs font-extrabold uppercase text-[#707A63] block">
                      Cambiar contraseña de administrador
                    </span>

                    {passChangeMessage && (
                      <div
                        className={`p-3 text-xs font-semibold rounded-xl flex items-center gap-2 ${
                          passChangeMessage.type === 'success'
                            ? 'bg-emerald-50 border border-emerald-300 text-emerald-800'
                            : 'bg-rose-50 border border-rose-300 text-rose-800'
                        }`}
                      >
                        {passChangeMessage.type === 'success' ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <AlertTriangle className="w-4 h-4" />
                        )}
                        <span>{passChangeMessage.text}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#36402E] mb-1">
                          Contraseña actual
                        </label>
                        <input
                          type="password"
                          required
                          value={currentPass}
                          onChange={(e) => setCurrentPass(e.target.value)}
                          className="w-full bg-[#FFF9F1] border border-[#C39D70]/40 rounded-xl px-3 py-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#36402E] mb-1">
                          Nueva contraseña (mínimo 6 caracteres)
                        </label>
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={newPass}
                          onChange={(e) => setNewPass(e.target.value)}
                          className="w-full bg-[#FFF9F1] border border-[#C39D70]/40 rounded-xl px-3 py-2 text-xs"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="bg-[#707A63] hover:bg-[#5B6651] text-[#FFF9F1] font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Key className="w-3.5 h-3.5 text-[#F1BF70]" />
                      <span>Actualizar Contraseña</span>
                    </button>
                  </form>

                  {/* Persistence Architecture & Supabase Notice */}
                  <div className="bg-[#FFF9F1] p-6 rounded-3xl border border-[#C39D70]/30 space-y-3">
                    <div className="flex items-center gap-2 text-[#707A63]">
                      <Database className="w-5 h-5" />
                      <h5 className="font-extrabold text-sm text-[#36402E]">
                        Arquitectura de almacenamiento y privacidad
                      </h5>
                    </div>

                    <p className="text-xs text-[#5B6651] leading-relaxed">
                      ✅ <strong>Persistencia en servidor:</strong> Todas las reservas, fechas bloqueadas y textos personalizados se guardan de forma persistente en archivos JSON en el servidor (directorio <code className="bg-[#F8EFE1] px-1 py-0.5 rounded font-mono">/data/</code>). No se pierden al cerrar el navegador.
                    </p>

                    <p className="text-xs text-[#5B6651] leading-relaxed">
                      🔒 <strong>Privacidad estricta:</strong> Los clientes no necesitan registrarse ni iniciar sesión. La ruta pública <code className="bg-[#F8EFE1] px-1 py-0.5 rounded font-mono">/api/availability</code> sólo devuelve franjas horarias ocupadas sin nombres, teléfonos ni correos.
                    </p>

                    <p className="text-xs text-[#5B6651] leading-relaxed">
                      ☁️ <strong>Conexión con Supabase (Opcional):</strong> Si en el futuro deseas conectar tu base de datos remota de Supabase, solo necesitas añadir <code className="bg-[#F8EFE1] px-1 py-0.5 rounded font-mono">SUPABASE_URL</code> y <code className="bg-[#F8EFE1] px-1 py-0.5 rounded font-mono">SUPABASE_ANON_KEY</code> en las variables de entorno (.env). La lógica actual ya contempla el aislamiento de permisos de lectura y escritura.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
