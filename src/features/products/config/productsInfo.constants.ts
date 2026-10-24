import type { GlossaryEntry } from '@/features/core/components/InfoSheet.component';

/** ⓘ content for the Productos view (workspace rule: explanations live only here). */
export const PRODUCTS_INFO: { title: string; howItWorks: string[]; glossary: GlossaryEntry[] } = {
  title: 'Productos',
  howItWorks: [
    'Toca un postre para editarlo, ocultarlo del menú, ponerlo en "Nuestros favoritos" o eliminarlo.',
    'Las fotos y videos no se suben aquí: súbelos a un servicio como Cloudinary y pega el enlace directo del archivo.',
    'Mientras llenas el formulario ves la tarjeta en vivo, tal como aparecerá en el menú.',
    'Si un postre se agota, ocúltalo en vez de eliminarlo: así conservas su foto y descripción.',
    'Las categorías se administran en la sección «Categorías»; su orden es el orden del menú.',
  ],
  glossary: [
    { term: 'Oculto', meaning: 'El postre existe pero no aparece en el menú público.' },
    { term: 'Nuestros favoritos', meaning: 'Los postres destacados en la rueda del inicio.' },
    { term: 'Complemento', meaning: 'Algo que se agrega a otro postre, como el extra de helado.' },
    { term: 'Etiqueta', meaning: 'Texto corto sobre la foto, como «Favorito de la casa».' },
    { term: 'Enlace directo', meaning: 'Un enlace que abre solo la foto o el video, no una página (las publicaciones de Instagram no sirven).' },
  ],
};
