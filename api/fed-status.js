// api/fed-status.js
// Serverless function para Vercel (100% gratis con plan hobby)

module.exports = async (req, res) => {
  // Configurar CORS para permitir llamadas desde MT5
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Manejar preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Solo permitir GET requests
  if (req.method !== 'GET') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    // Obtener fecha actual en zona horaria EST (Fed Reserve es USA)
    const now = new Date();
    const estDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    
    // Formatear fecha como YYYY-MM-DD
    const year = estDate.getFullYear();
    const month = String(estDate.getMonth() + 1).padStart(2, '0');
    const day = String(estDate.getDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`;

    // CALENDARIO FED 2026 - Fechas CONFIRMADAS de reuniones FOMC
    // ⚠️ DÍAS DE ALTA VOLATILIDAD - Bot operará en modo conservador
    // Fuente: Federal Reserve Official Calendar
    const fedMeetings = [
      // === 2026 OFICIAL ===
      '2026-01-28', '2026-01-29', // Enero 28-29 ⚠️
      // Febrero: SIN REUNIÓN
      '2026-03-18', '2026-03-19', // Marzo 18-19 ⚠️
      '2026-04-29', '2026-04-30', // Abril 29-30 ⚠️
      // Mayo: SIN REUNIÓN
      '2026-06-17', '2026-06-18', // Junio 17-18 ⚠️
      '2026-07-29', '2026-07-30', // Julio 29-30 ⚠️
      // Agosto: SIN REUNIÓN
      '2026-09-16', '2026-09-17', // Septiembre 16-17 ⚠️
      '2026-10-28', '2026-10-29', // Octubre 28-29 ⚠️
      // Noviembre: SIN REUNIÓN
      '2026-12-09', '2026-12-10', // Diciembre 9-10 ⚠️
      
      // === 2027 PROYECTADO ===
      // (Actualizar cuando Fed publique calendario oficial 2027)
      '2027-01-26', '2027-01-27', // Enero (estimado)
      '2027-03-16', '2027-03-17', // Marzo (estimado)
      '2027-04-27', '2027-04-28', // Abril (estimado)
      '2027-06-15', '2027-06-16', // Junio (estimado)
      '2027-07-27', '2027-07-28', // Julio (estimado)
      '2027-09-21', '2027-09-22', // Septiembre (estimado)
      '2027-11-02', '2027-11-03', // Noviembre (estimado)
      '2027-12-14', '2027-12-15', // Diciembre (estimado)
    ];

    // Verificar si hoy hay reunión Fed
    const hasFedMeeting = fedMeetings.includes(today);

    // Retornar 1 o 0 como solicitado
    const response = hasFedMeeting ? '1' : '0';
    
    // Log para debugging (visible en Vercel dashboard)
    console.log(`[${today}] Fed Meeting: ${hasFedMeeting ? 'YES' : 'NO'}`);

    // Retornar respuesta simple (solo "1" o "0")
    return res.status(200).send(response);

  } catch (error) {
    console.error('Error en Fed API:', error);
    // En caso de error, retornar 0 (no hay reunión) para que el bot opere normal
    return res.status(200).send('0');
  }
};