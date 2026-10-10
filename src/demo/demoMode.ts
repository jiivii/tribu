/**
 * Interruptor del MODO DEMO (GitHub Pages).
 *
 * GitHub Pages sólo sirve archivos estáticos: no ejecuta `server.ts`, Express
 * ni las rutas `/api/...` (todas devolverían 404). Con el modo demo activado
 * —que es el valor por defecto— la web se renderiza por completo con datos
 * provisionales locales y NO se realiza ninguna llamada de red a rutas de API.
 *
 * Si en el futuro vuelves a ejecutar el backend real (server.ts + Express) y
 * quieres que la app vuelva a consumirlo, construye con la variable de entorno
 * `VITE_DEMO_MODE=false` (por ejemplo en un archivo `.env.local`):
 *
 *   VITE_DEMO_MODE=false npm run build
 */
export const DEMO_MODE: boolean = import.meta.env.VITE_DEMO_MODE !== 'false';

/**
 * Mensaje estándar mostrado al usuario en modo demo, para que quede claro que
 * la demostración es visual y no persiste datos.
 */
export const DEMO_NOTICE = 'Demo visual: las reservas no se guardan todavía.';
