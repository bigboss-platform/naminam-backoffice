import type { GlossaryEntry } from '@/features/core/components/InfoSheet.component';

/** ⓘ content for the Negocio view. */
export const BUSINESS_INFO: { title: string; howItWorks: string[]; glossary: GlossaryEntry[] } = {
  title: 'Negocio',
  howItWorks: [
    'Toca una tarjeta para editarla. Los cambios se guardan al tocar «Guardar».',
    'Los números se escriben con el código del país, sin el "+": 58 para Venezuela (ej. 584126722218).',
    'Para la ubicación, abre el local en Google Maps, copia el enlace de la barra de direcciones y pégalo: el mapa se lee de ese enlace.',
    'Los horarios se escriben en formato 24 horas: 1930 son las 7:30 p. m.',
    'La portada es la foto grande del inicio de la web. Pega el enlace directo de la foto.',
  ],
  glossary: [
    { term: 'WhatsApp', meaning: 'El número que recibe los pedidos desde la web.' },
    { term: 'Llamadas', meaning: 'El número del botón «Llamar» del pie de página.' },
    { term: 'Formato 24 horas', meaning: 'Las horas de la tarde se escriben sumando 12: 8 p. m. = 20:00.' },
    { term: 'Portada', meaning: 'La foto principal que se ve al abrir la web.' },
  ],
};
