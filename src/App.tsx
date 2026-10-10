import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { GallerySection } from './components/GallerySection';
import { AvailabilityCalendar } from './components/AvailabilityCalendar';
import { BookingForm } from './components/BookingForm';
import { PracticalInfo } from './components/PracticalInfo';
import { AdminModal } from './components/AdminModal';
import { Footer } from './components/Footer';
import { BusinessConfig, PublicAvailabilitySlot } from './types';
import { DEMO_MODE } from './demo/demoMode';
import {
  DEMO_BUSINESS_CONFIG,
  DEMO_AVAILABILITY_SLOTS
} from './demo/demoBusinessConfig';

export default function App() {
  // Estado inicial con datos de demostración: la web se renderiza al instante
  // sin depender de que exista un backend ni de que la API responda.
  const [config, setConfig] = useState<BusinessConfig | null>(DEMO_BUSINESS_CONFIG);
  const [availabilitySlots, setAvailabilitySlots] = useState<PublicAvailabilitySlot[]>(
    DEMO_AVAILABILITY_SLOTS
  );
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    // Current date formatted YYYY-MM-DD
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`;
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return sessionStorage.getItem('la_tribu_admin_token') || null;
  });

  // Load business config and availability on mount (sólo si hay backend real)
  useEffect(() => {
    if (DEMO_MODE) return; // GitHub Pages: sin backend, mantenemos los datos demo
    fetchBusinessConfig();
    fetchAvailability();
  }, []);

  const fetchBusinessConfig = async () => {
    try {
      const res = await fetch('/api/business-config');
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
      }
    } catch (err) {
      console.error('Error fetching config:', err);
    }
  };

  const fetchAvailability = async () => {
    try {
      const res = await fetch('/api/availability');
      if (res.ok) {
        const data = await res.json();
        setAvailabilitySlots(data);
      }
    } catch (err) {
      console.error('Error fetching availability:', err);
    }
  };

  const handleLoginSuccess = (token: string) => {
    setAdminToken(token);
    sessionStorage.setItem('la_tribu_admin_token', token);
  };

  const handleLogout = () => {
    setAdminToken(null);
    sessionStorage.removeItem('la_tribu_admin_token');
  };

  const scrollToElement = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectRate = (rateTitle: string) => {
    scrollToElement('formulario');
  };

  return (
    <div className="min-h-screen bg-[#F8EFE1] text-[#4B5442] flex flex-col font-sans selection:bg-[#F1BF70] selection:text-[#36402E]">
      {/* Navigation Header */}
      <Navbar
        config={config}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAdminLoggedIn={Boolean(adminToken)}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          config={config}
          onCheckAvailability={() => scrollToElement('calendario')}
          onBookNow={() => scrollToElement('formulario')}
        />

        {/* Services & Celebrations */}
        <ServicesSection
          config={config}
          onSelectRate={handleSelectRate}
        />

        {/* Real-time Availability Calendar */}
        <AvailabilityCalendar
          slots={availabilitySlots}
          selectedDate={selectedDate}
          onSelectDate={(date) => setSelectedDate(date)}
          onGoToBooking={() => scrollToElement('formulario')}
        />

        {/* Public Booking Request Form */}
        <BookingForm
          config={config}
          selectedDate={selectedDate}
          onDateChange={(date) => setSelectedDate(date)}
          availabilitySlots={availabilitySlots}
          onBookingCreated={() => {
            fetchAvailability();
          }}
        />

        {/* Photo Gallery */}
        <GallerySection gallery={config?.gallery || []} />

        {/* Practical Info, Location & How to arrive */}
        <PracticalInfo config={config} />
      </main>

      {/* Footer with branding & owner access */}
      <Footer
        config={config}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAdminLoggedIn={Boolean(adminToken)}
      />

      {/* Owner Admin Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        adminToken={adminToken}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
        onDataModified={() => {
          fetchAvailability();
          fetchBusinessConfig();
        }}
        businessConfig={config}
      />
    </div>
  );
}
