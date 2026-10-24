import type { GlossaryEntry } from '@/features/core/components/InfoSheet.component';

/** ⓘ content for the Productos view (workspace rule: explanations live only here). */
export const PRODUCTS_INFO: { title: string; howItWorks: string[]; glossary: GlossaryEntry[] } = {
  title: 'Productos',
  howItWorks: [
    'Toca un producto para editarlo, ocultarlo del menú, ponerlo en "Los consentidos de la casa" o eliminarlo.',
    'Las fotos y videos no se suben aquí: súbelos a un servicio como Cloudinary y pega el enlace directo del archivo.',
    'Mientras llenas el formulario ves la tarjeta en vivo, tal como aparecerá en el menú.',
    'Si un producto se agota, ocúltalo en vez de eliminarlo: así conservas su foto y descripción.',
    'Las categorías se administran en la sección «Categorías»; su orden es el orden del menú.',
  ],
  glossary: [
    { term: 'Oculto', meaning: 'El producto existe pero no aparece en el menú público.' },
    { term: 'Los consentidos de la casa', meaning: 'Los productos destacados en "Los consentidos de la casa".' },
    { term: 'Complemento', meaning: 'Algo que se agrega a otro producto, como las salsas.' },
    { term: 'Etiqueta', meaning: 'Texto corto sobre la foto, como «Favorito de la casa».' },
    { term: 'Enlace directo', meaning: 'Un enlace que abre solo la foto o el video, no una página (las publicaciones de Instagram no sirven).' },
  ],
};
