import type { GlossaryEntry } from '@/features/core/components/InfoSheet.component';

/** ⓘ content for the Categorías view (workspace rule: explanations live only here). */
export const CATEGORIES_INFO: { title: string; howItWorks: string[]; glossary: GlossaryEntry[] } = {
  title: 'Categorías',
  howItWorks: [
    'Las categorías agrupan los productos en el menú público, como «Postres» o «Bebidas».',
    'Su orden aquí es el orden del menú: usa «Subir» y «Bajar» para cambiarlo.',
    'Solo puedes eliminar una categoría cuando ya no tiene productos.',
  ],
  glossary: [{ term: 'Frase', meaning: 'Texto corto opcional que acompaña el nombre de la categoría en el menú.' }],
};
