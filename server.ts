import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.resolve(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Data file paths
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');
const BLOCKS_FILE = path.join(DATA_DIR, 'blocks.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');
const AUTH_FILE = path.join(DATA_DIR, 'auth.json');

// Interface definitions
export interface Booking {
  id: string;
  trackingCode: string;
  clientName: string;
  clientLastName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  phone: string;
  email: string;
  eventType: string;
  guests?: number;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  source: 'web' | 'phone' | 'manual';
  createdAt: string;
  adminNotes?: string;
}

export interface BlockedSlot {
  id: string;
  date: string; // YYYY-MM-DD
  isFullDay: boolean;
  startTime?: string;
  endTime?: string;
  reason: string;
  createdAt: string;
}

export interface BusinessConfig {
  name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  googleMapsUrl: string;
  hoursDescription: string;
  howToArrive: string;
  capacityMax: number;
  rates: {
    id: string;
    title: string;
    hours: string;
    price: string;
    description: string;
    isPopular?: boolean;
  }[];
  services: {
    id: string;
    title: string;
    description: string;
    icon: string;
    included: boolean;
  }[];
  celebrationTypes: {
    id: string;
    title: string;
    description: string;
    recommendedHours: string;
    badge: string;
    icon: string;
  }[];
  gallery: {
    id: string;
    title: string;
    category: string;
    imageUrl: string;
    description: string;
  }[];
}

// Helpers for read/write
function readJson<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) {
      writeJson(filePath, fallback);
      return fallback;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return fallback;
  }
}

function writeJson<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

// Seed initial business config if needed
const DEFAULT_CONFIG: BusinessConfig = {
  name: 'La Tribu',
  tagline: 'Celebraciones que se quedan en la memoria',
  phone: '+34 600 123 456 (Editable)',
  whatsapp: '+34 600 123 456',
  email: 'hola@latribucelebraciones.com (Editable)',
  address: 'Calle Mayor 45, 28013 Madrid (Texto provisional editable)',
  googleMapsUrl: 'https://maps.google.com/?q=Calle+Mayor+45+Madrid',
  hoursDescription: 'Lunes a Domingo de 10:00 a 22:30 h (Turnos flexibles y adaptables)',
  howToArrive: 'Metro Línea 1 y 2 (Sol / Ópera a 4 min). Autobuses 3, 148 y 50. Parking público 24h a 80m en Plaza Mayor.',
  capacityMax: 50,
  rates: [
    {
      id: 'rate-1',
      title: 'Turno Mañana',
      hours: '10:00 a 14:30 h (4,5h)',
      price: '130 €',
      description: 'Ideal para cumples infantiles matutinos, baby showers o almuerzos familiares.',
      isPopular: false
    },
    {
      id: 'rate-2',
      title: 'Turno Tarde',
      hours: '16:30 a 21:30 h (5h)',
      price: '160 €',
      description: 'Nuestro turno estrella para meriendas, cumpleaños, reuniones y celebraciones de tarde.',
      isPopular: true
    },
    {
      id: 'rate-3',
      title: 'Día Completo',
      hours: '11:00 a 21:30 h (10,5h)',
      price: '260 €',
      description: 'Disfruta de todo el día sin prisas para eventos familiares grandes y aniversarios.',
      isPopular: false
    },
    {
      id: 'rate-4',
      title: 'Horas Adicionales',
      hours: 'Por hora extra',
      price: '25 €/h',
      description: 'Sujeto a disponibilidad y previa consulta antes del cierre.',
      isPopular: false
    }
  ],
  services: [
    {
      id: 'srv-1',
      title: 'Espacio Exclusivo y Privado',
      description: 'El local es 100% privado para tu grupo. Sin compartir zonas con desconocidos.',
      icon: 'Home',
      included: true
    },
    {
      id: 'srv-2',
      title: 'Cocina & Office Equipado',
      description: 'Nevera espaciosa, microondas, cafetera de cápsulas, fregadero y zona de preparación de catering.',
      icon: 'Coffee',
      included: true
    },
    {
      id: 'srv-3',
      title: 'Área Infantil de Juegos',
      description: 'Parque de bolas acolchado, tobogán suave, pizarra de tizas y juguetes montessori seguros.',
      icon: 'Sparkles',
      included: true
    },
    {
      id: 'srv-4',
      title: 'Mesas, Sillas y Mobiliario',
      description: 'Mesas modulables para adultos y niños, tronas infantiles, manteles base y sillas cómodas.',
      icon: 'Layout',
      included: true
    },
    {
      id: 'srv-5',
      title: 'Sonido Bluetooth y Smart TV',
      description: 'Altavoces integrados para tu música favorita y Smart TV de 55" para proyectar recuerdos o vídeos.',
      icon: 'Music',
      included: true
    },
    {
      id: 'srv-6',
      title: 'Climatización Frío / Calor',
      description: 'Aire acondicionado y calefacción regulable para una temperatura agradable en cualquier época.',
      icon: 'Sun',
      included: true
    },
    {
      id: 'srv-7',
      title: 'Servicio de Limpieza Final',
      description: 'Opción de contratar limpieza profesional fin de fiesta para marcharte sin preocuparte.',
      icon: 'CheckCircle',
      included: false
    },
    {
      id: 'srv-8',
      title: 'Decoración Personalizada',
      description: 'Estructuras para globos, candy bar y photocall temático a consultar con el local.',
      icon: 'Heart',
      included: false
    }
  ],
  celebrationTypes: [
    {
      id: 'cel-1',
      title: 'Cumpleaños Infantiles',
      description: 'El plan favorito de los peques. Zona de juegos acolchada, espacio para merienda y tarta con total seguridad.',
      recommendedHours: 'Turno Mañana o Tarde',
      badge: 'Más solicitado',
      icon: 'Gift'
    },
    {
      id: 'cel-2',
      title: 'Fiestas Familiares y Bautizos',
      description: 'Reuniones de familia en un entorno acogedor, tranquilo y adaptado a todas las edades desde bebés hasta abuelos.',
      recommendedHours: 'Turno Mañana o Día Completo',
      badge: 'Familiar',
      icon: 'Users'
    },
    {
      id: 'cel-3',
      title: 'Baby Showers y Gender Reveal',
      description: 'Un rincón lleno de luz natural y colores cálidos para dar la bienvenida al nuevo miembro de la familia.',
      recommendedHours: 'Turno Mañana o Tarde',
      badge: 'Emotivo',
      icon: 'Smile'
    },
    {
      id: 'cel-4',
      title: 'Talleres y Reuniones Privadas',
      description: 'Espacio versátil para talleres creativos, showrooms temporales, cursos de cocina o dinámicas de grupo.',
      recommendedHours: 'Horas flexibles',
      badge: 'Polivalente',
      icon: 'Briefcase'
    }
  ],
  gallery: [
    {
      id: 'gal-1',
      title: 'Zona Principal y Comedor',
      category: 'Zona Principal',
      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      description: 'Mesas amplias de madera natural y luz cálida para comidas y meriendas.'
    },
    {
      id: 'gal-2',
      title: 'Parque Infantil y Rincón de Juegos',
      category: 'Zona Infantil',
      imageUrl: 'https://images.unsplash.com/photo-1596464716127-f2a829822301?auto=format&fit=crop&w=1200&q=80',
      description: 'Estructura acolchada con suelo blando, casita y elementos pedagógicos.'
    },
    {
      id: 'gal-3',
      title: 'Mesa Dulce y Decoración',
      category: 'Decoración',
      imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80',
      description: 'Rincón ambientado para tarta, photocall y entrega de regalos.'
    },
    {
      id: 'gal-4',
      title: 'Office y Barra de Preparación',
      category: 'Office & Cocina',
      imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
      description: 'Electrodomésticos, nevera de gran capacidad y espacio para catering.'
    },
    {
      id: 'gal-5',
      title: 'Ambiente Acogedor La Tribu',
      category: 'Zona Principal',
      imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80',
      description: 'Decoración con tonos tierra, plantas y toques en madera natural.'
    },
    {
      id: 'gal-6',
      title: 'Montaje para Bautizo y Baby Shower',
      category: 'Decoración',
      imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
      description: 'Detalles cuidados y mesas preparadas para celebraciones inolvidables.'
    }
  ]
};

// Seed initial bookings & blocks if empty
function initializeDatabase() {
  const existingConfig = readJson<BusinessConfig | null>(CONFIG_FILE, null);
  if (!existingConfig) {
    writeJson(CONFIG_FILE, DEFAULT_CONFIG);
  }

  const existingAuth = readJson<{ passwordHash: string; salt: string } | null>(AUTH_FILE, null);
  if (!existingAuth) {
    // Default admin password is 'admin123'
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync('admin123', salt, 1000, 64, 'sha512').toString('hex');
    writeJson(AUTH_FILE, { passwordHash: hash, salt });
  }

  const existingBlocks = readJson<BlockedSlot[] | null>(BLOCKS_FILE, null);
  if (!existingBlocks || existingBlocks.length === 0) {
    const sampleBlocks: BlockedSlot[] = [
      {
        id: 'block-1',
        date: '2026-10-18',
        isFullDay: true,
        reason: 'Mantenimiento preventivo del local',
        createdAt: '2026-10-01T10:00:00.000Z'
      },
      {
        id: 'block-2',
        date: '2026-10-25',
        isFullDay: false,
        startTime: '10:00',
        endTime: '14:30',
        reason: 'Uso privado de la familia propietaria',
        createdAt: '2026-10-02T12:00:00.000Z'
      }
    ];
    writeJson(BLOCKS_FILE, sampleBlocks);
  }

  const existingBookings = readJson<Booking[] | null>(BOOKINGS_FILE, null);
  if (!existingBookings || existingBookings.length === 0) {
    const sampleBookings: Booking[] = [
      {
        id: 'bkg-1',
        trackingCode: 'LT-4821',
        clientName: 'Laura (Ejemplo)',
        clientLastName: 'Gómez Martín',
        date: '2026-10-17',
        startTime: '16:30',
        endTime: '21:30',
        phone: '+34 654 321 987',
        email: 'laura.ejemplo@gmail.com',
        eventType: 'Cumpleaños infantil 5 años',
        guests: 25,
        notes: 'Traerán tarta casera y necesitan uso de microondas.',
        status: 'confirmed',
        source: 'phone',
        createdAt: '2026-10-05T14:20:00.000Z'
      },
      {
        id: 'bkg-2',
        trackingCode: 'LT-8819',
        clientName: 'Carlos (Ejemplo)',
        clientLastName: 'Sánchez Ruiz',
        date: '2026-10-24',
        startTime: '16:00',
        endTime: '21:00',
        phone: '+34 677 889 900',
        email: 'carlos.sanchez@ejemplo.es',
        eventType: 'Bautizo familiar',
        guests: 35,
        notes: 'Montarán mesa dulce a las 15:30 si es posible.',
        status: 'confirmed',
        source: 'web',
        createdAt: '2026-10-06T09:15:00.000Z'
      },
      {
        id: 'bkg-3',
        trackingCode: 'LT-9124',
        clientName: 'Marta (Ejemplo)',
        clientLastName: 'Fernández López',
        date: '2026-10-31',
        startTime: '17:00',
        endTime: '21:30',
        phone: '+34 611 223 344',
        email: 'marta.fiesta@ejemplo.com',
        eventType: 'Fiesta temática Halloween',
        guests: 28,
        notes: 'Decoración temática infantil con calabazas.',
        status: 'pending',
        source: 'web',
        createdAt: '2026-10-09T18:40:00.000Z'
      }
    ];
    writeJson(BOOKINGS_FILE, sampleBookings);
  }
}

initializeDatabase();

// In-memory active admin sessions (token -> timestamp)
const activeSessions = new Map<string, { createdAt: number }>();
const SESSION_EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 hours

// Middleware
app.use(express.json());

// Auth helper
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No autorizado. Se requiere inicio de sesión de administración.' });
    return;
  }
  const token = authHeader.substring(7);
  const session = activeSessions.get(token);
  if (!session || Date.now() - session.createdAt > SESSION_EXPIRATION_MS) {
    if (session) activeSessions.delete(token);
    res.status(401).json({ error: 'Sesión expirada o no válida. Por favor, identifícate de nuevo.' });
    return;
  }
  next();
}

// Time overlap calculation
// HH:mm to minutes from midnight
function toMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function intervalsOverlap(startA: string, endA: string, startB: string, endB: string): boolean {
  const sA = toMinutes(startA);
  const eA = toMinutes(endA);
  const sB = toMinutes(startB);
  const eB = toMinutes(endB);
  return Math.max(sA, sB) < Math.min(eA, eB);
}

// --- PUBLIC ROUTES ---

// 1. Get business configuration
app.get('/api/business-config', (_req: Request, res: Response) => {
  const config = readJson<BusinessConfig>(CONFIG_FILE, DEFAULT_CONFIG);
  res.json(config);
});

// 2. Get public availability
// Privacy guaranteed: No personal data (name, email, phone) is exposed to public
app.get('/api/availability', (req: Request, res: Response) => {
  const monthQuery = req.query.month as string; // Optional YYYY-MM
  const bookings = readJson<Booking[]>(BOOKINGS_FILE, []);
  const blocks = readJson<BlockedSlot[]>(BLOCKS_FILE, []);

  // Filter bookings that are confirmed or pending
  const activeBookings = bookings.filter((b) => b.status === 'confirmed' || b.status === 'pending');

  let publicSlots = [
    ...activeBookings.map((b) => ({
      id: b.id,
      date: b.date,
      startTime: b.startTime,
      endTime: b.endTime,
      status: b.status,
      isFullDay: false
    })),
    ...blocks.map((bl) => ({
      id: bl.id,
      date: bl.date,
      startTime: bl.startTime || '00:00',
      endTime: bl.endTime || '23:59',
      status: 'blocked' as const,
      isFullDay: bl.isFullDay
    }))
  ];

  if (monthQuery && /^\d{4}-\d{2}$/.test(monthQuery)) {
    publicSlots = publicSlots.filter((s) => s.date.startsWith(monthQuery));
  }

  res.json(publicSlots);
});

// 3. Create a reservation request from public form
app.post('/api/bookings', (req: Request, res: Response) => {
  const {
    clientName,
    clientLastName,
    date,
    startTime,
    endTime,
    phone,
    email,
    eventType,
    guests,
    notes
  } = req.body;

  // Validation
  if (!clientName || !clientName.trim()) {
    res.status(400).json({ error: 'El campo "Nombre" es obligatorio.' });
    return;
  }
  if (!clientLastName || !clientLastName.trim()) {
    res.status(400).json({ error: 'El campo "Apellidos" es obligatorio.' });
    return;
  }
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    res.status(400).json({ error: 'Debes indicar una fecha válida (AAAA-MM-DD).' });
    return;
  }
  if (!startTime || !/^\d{2}:\d{2}$/.test(startTime)) {
    res.status(400).json({ error: 'La hora de inicio es obligatoria y debe tener formato HH:mm.' });
    return;
  }
  if (!endTime || !/^\d{2}:\d{2}$/.test(endTime)) {
    res.status(400).json({ error: 'La hora de fin es obligatoria y debe tener formato HH:mm.' });
    return;
  }

  if (toMinutes(endTime) <= toMinutes(startTime)) {
    res.status(400).json({ error: 'La hora de fin debe ser posterior a la hora de inicio.' });
    return;
  }

  if (!phone || !phone.trim() || phone.trim().length < 6) {
    res.status(400).json({ error: 'El teléfono es obligatorio y debe ser válido.' });
    return;
  }
  if (!email || !email.trim() || !email.includes('@')) {
    res.status(400).json({ error: 'El correo electrónico es obligatorio y debe tener un formato válido.' });
    return;
  }

  const bookings = readJson<Booking[]>(BOOKINGS_FILE, []);
  const blocks = readJson<BlockedSlot[]>(BLOCKS_FILE, []);

  // Check overlap with confirmed bookings
  const overlappingBooking = bookings.find((b) => {
    if (b.status === 'cancelled') return false;
    if (b.date !== date) return false;
    return intervalsOverlap(startTime, endTime, b.startTime, b.endTime);
  });

  if (overlappingBooking) {
    res.status(409).json({
      error: `El horario solicitado (${startTime} a ${endTime}) se solapa con una reserva ${
        overlappingBooking.status === 'confirmed' ? 'ya confirmada' : 'en revisión'
      } para ese día. Por favor, selecciona otro horario o contacta con el local.`
    });
    return;
  }

  // Check overlap with blocked dates
  const overlappingBlock = blocks.find((bl) => {
    if (bl.date !== date) return false;
    if (bl.isFullDay) return true;
    if (bl.startTime && bl.endTime) {
      return intervalsOverlap(startTime, endTime, bl.startTime, bl.endTime);
    }
    return true;
  });

  if (overlappingBlock) {
    res.status(409).json({
      error: `El día o tramo horario seleccionado no está disponible (${overlappingBlock.reason || 'Bloqueado por el propietario'}). Por favor, consulta otras fechas en el calendario.`
    });
    return;
  }

  // Generate unique tracking code
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const trackingCode = `LT-${randomSuffix}`;

  const newBooking: Booking = {
    id: `bkg-${crypto.randomUUID()}`,
    trackingCode,
    clientName: clientName.trim(),
    clientLastName: clientLastName.trim(),
    date,
    startTime,
    endTime,
    phone: phone.trim(),
    email: email.trim(),
    eventType: eventType ? eventType.trim() : 'Celebración privada',
    guests: guests ? Number(guests) : undefined,
    notes: notes ? notes.trim() : '',
    status: 'pending', // Solicitudes públicas quedan pendientes de confirmación
    source: 'web',
    createdAt: new Date().toISOString()
  };

  bookings.push(newBooking);
  writeJson(BOOKINGS_FILE, bookings);

  res.status(201).json({
    success: true,
    message: '¡Solicitud de reserva recibida con éxito! Queda pendiente de confirmación por el propietario del local.',
    booking: {
      id: newBooking.id,
      trackingCode: newBooking.trackingCode,
      date: newBooking.date,
      startTime: newBooking.startTime,
      endTime: newBooking.endTime,
      status: newBooking.status
    }
  });
});

// --- ADMIN ROUTES ---

// Admin login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { password } = req.body;
  if (!password) {
    res.status(400).json({ error: 'Introduce la contraseña de acceso.' });
    return;
  }

  const authData = readJson<{ passwordHash: string; salt: string } | null>(AUTH_FILE, null);
  if (!authData) {
    res.status(500).json({ error: 'Configuración de seguridad no disponible.' });
    return;
  }

  const hash = crypto.pbkdf2Sync(password, authData.salt, 1000, 64, 'sha512').toString('hex');
  if (hash !== authData.passwordHash) {
    res.status(401).json({ error: 'Contraseña incorrecta.' });
    return;
  }

  const token = crypto.randomBytes(32).toString('hex');
  activeSessions.set(token, { createdAt: Date.now() });

  res.json({
    success: true,
    token,
    message: 'Sesión de administración iniciada correctamente.'
  });
});

// Change admin password
app.post('/api/admin/change-password', requireAdminAuth, (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres.' });
    return;
  }

  const authData = readJson<{ passwordHash: string; salt: string } | null>(AUTH_FILE, null);
  if (!authData) {
    res.status(500).json({ error: 'Error del sistema de autenticación.' });
    return;
  }

  const hash = crypto.pbkdf2Sync(currentPassword, authData.salt, 1000, 64, 'sha512').toString('hex');
  if (hash !== authData.passwordHash) {
    res.status(401).json({ error: 'La contraseña actual no es correcta.' });
    return;
  }

  const newSalt = crypto.randomBytes(16).toString('hex');
  const newHash = crypto.pbkdf2Sync(newPassword, newSalt, 1000, 64, 'sha512').toString('hex');
  writeJson(AUTH_FILE, { passwordHash: newHash, salt: newSalt });

  res.json({ success: true, message: 'Contraseña de administración actualizada correctamente.' });
});

// Get all bookings (Full details for Admin)
app.get('/api/admin/bookings', requireAdminAuth, (_req: Request, res: Response) => {
  const bookings = readJson<Booking[]>(BOOKINGS_FILE, []);
  // Sort by date descending
  bookings.sort((a, b) => b.date.localeCompare(a.date) || b.startTime.localeCompare(a.startTime));
  res.json(bookings);
});

// Add manual booking by owner (e.g., telephone or in person)
app.post('/api/admin/bookings', requireAdminAuth, (req: Request, res: Response) => {
  const {
    clientName,
    clientLastName,
    date,
    startTime,
    endTime,
    phone,
    email,
    eventType,
    guests,
    notes,
    adminNotes,
    status
  } = req.body;

  if (!clientName || !clientLastName || !date || !startTime || !endTime) {
    res.status(400).json({ error: 'Faltan campos obligatorios para registrar la reserva manual.' });
    return;
  }

  const bookings = readJson<Booking[]>(BOOKINGS_FILE, []);
  const blocks = readJson<BlockedSlot[]>(BLOCKS_FILE, []);

  // Check overlap with existing confirmed bookings
  const overlap = bookings.find((b) => {
    if (b.status === 'cancelled') return false;
    if (b.date !== date) return false;
    return intervalsOverlap(startTime, endTime, b.startTime, b.endTime);
  });

  if (overlap) {
    res.status(409).json({
      error: `Existe un solapamiento con otra reserva existente (${overlap.clientName} de ${overlap.startTime} a ${overlap.endTime}).`
    });
    return;
  }

  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const newBooking: Booking = {
    id: `bkg-${crypto.randomUUID()}`,
    trackingCode: `LT-${randomSuffix}`,
    clientName: clientName.trim(),
    clientLastName: clientLastName.trim(),
    date,
    startTime,
    endTime,
    phone: phone ? phone.trim() : 'Recibida por teléfono',
    email: email ? email.trim() : 'reserva.manual@local.es',
    eventType: eventType ? eventType.trim() : 'Celebración privada',
    guests: guests ? Number(guests) : undefined,
    notes: notes ? notes.trim() : '',
    adminNotes: adminNotes ? adminNotes.trim() : '',
    status: status || 'confirmed', // Por defecto confirmada al ser creada por el propietario
    source: req.body.source || 'phone',
    createdAt: new Date().toISOString()
  };

  bookings.push(newBooking);
  writeJson(BOOKINGS_FILE, bookings);

  res.status(201).json({ success: true, booking: newBooking });
});

// Update booking (status, times, notes)
app.patch('/api/admin/bookings/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const bookings = readJson<Booking[]>(BOOKINGS_FILE, []);

  const index = bookings.findIndex((b) => b.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Reserva no encontrada.' });
    return;
  }

  const current = bookings[index];

  // If changing date or times, verify overlap with others
  const targetDate = updates.date || current.date;
  const targetStart = updates.startTime || current.startTime;
  const targetEnd = updates.endTime || current.endTime;
  const targetStatus = updates.status || current.status;

  if (targetStatus !== 'cancelled') {
    const overlap = bookings.find((b) => {
      if (b.id === id || b.status === 'cancelled') return false;
      if (b.date !== targetDate) return false;
      return intervalsOverlap(targetStart, targetEnd, b.startTime, b.endTime);
    });

    if (overlap) {
      res.status(409).json({
        error: `Conflicto de horario con otra reserva existente (${overlap.clientName} de ${overlap.startTime} a ${overlap.endTime}).`
      });
      return;
    }
  }

  const updated: Booking = {
    ...current,
    ...updates,
    id: current.id,
    trackingCode: current.trackingCode,
    createdAt: current.createdAt
  };

  bookings[index] = updated;
  writeJson(BOOKINGS_FILE, bookings);

  res.json({ success: true, booking: updated });
});

// Delete booking
app.delete('/api/admin/bookings/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const bookings = readJson<Booking[]>(BOOKINGS_FILE, []);

  const filtered = bookings.filter((b) => b.id !== id);
  if (filtered.length === bookings.length) {
    res.status(404).json({ error: 'Reserva no encontrada.' });
    return;
  }

  writeJson(BOOKINGS_FILE, filtered);
  res.json({ success: true, message: 'Reserva eliminada con éxito.' });
});

// Get blocks
app.get('/api/admin/blocks', requireAdminAuth, (_req: Request, res: Response) => {
  const blocks = readJson<BlockedSlot[]>(BLOCKS_FILE, []);
  blocks.sort((a, b) => b.date.localeCompare(a.date));
  res.json(blocks);
});

// Create block
app.post('/api/admin/blocks', requireAdminAuth, (req: Request, res: Response) => {
  const { date, isFullDay, startTime, endTime, reason } = req.body;
  if (!date) {
    res.status(400).json({ error: 'La fecha es obligatoria para bloquear.' });
    return;
  }

  const blocks = readJson<BlockedSlot[]>(BLOCKS_FILE, []);
  const newBlock: BlockedSlot = {
    id: `blk-${crypto.randomUUID()}`,
    date,
    isFullDay: Boolean(isFullDay),
    startTime: isFullDay ? undefined : startTime,
    endTime: isFullDay ? undefined : endTime,
    reason: reason ? reason.trim() : 'Bloqueado por el propietario',
    createdAt: new Date().toISOString()
  };

  blocks.push(newBlock);
  writeJson(BLOCKS_FILE, blocks);

  res.status(201).json({ success: true, block: newBlock });
});

// Delete block
app.delete('/api/admin/blocks/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const blocks = readJson<BlockedSlot[]>(BLOCKS_FILE, []);
  const filtered = blocks.filter((b) => b.id !== id);

  if (filtered.length === blocks.length) {
    res.status(404).json({ error: 'Bloqueo no encontrado.' });
    return;
  }

  writeJson(BLOCKS_FILE, filtered);
  res.json({ success: true, message: 'Bloqueo eliminado correctamente.' });
});

// Update business configuration
app.put('/api/admin/business-config', requireAdminAuth, (req: Request, res: Response) => {
  const newConfig = req.body as BusinessConfig;
  if (!newConfig || !newConfig.name) {
    res.status(400).json({ error: 'Datos de configuración incompletos.' });
    return;
  }

  writeJson(CONFIG_FILE, newConfig);
  res.json({ success: true, config: newConfig });
});

// --- VITE DEV OR PRODUCTION STATIC SERVER ---
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  const distPath = path.resolve(__dirname, 'dist');

  if (!isProduction && !fs.existsSync(distPath)) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
