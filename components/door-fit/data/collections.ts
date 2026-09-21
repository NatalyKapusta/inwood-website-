import type { CollId, Collection } from '../types';

const ET_FILMS = [
  'white', 'astana-merle', 'concrete-snow', 'concrete-grey', 'concrete-dark', 'white-textured', 'wenge-south',
  'oak-glasgow', 'oak-chateau', 'stone-cut', 'carpathian-spruce', 'ash-softtouch', 'rustic-gold', 'rustic-avignon',
  'pine-provence', 'black-cork', 'veneer-brown',
];
const NL_FILMS = [
  'white', 'anthracite', 'wenge', 'nemo-latte', 'nemo-silver', 'pasadena', 'portovy', 'chateau', 'oxide-white',
  'oxide-light', 'oxide-dark', 'feldgrau',
];

/**
 * Колекції: films — палітра плівок; paint — можливе фарбування RAL/NCS; edges — варіанти кромки;
 * hinges — видимі петлі на візуалах; cop — доступний компланарний короб; flush — двері прихованого монтажу.
 */
export const COLLECTIONS: Record<CollId, Collection> = {
  ETALON: {
    id: 'ETALON', name: 'ETALON', lt: 40, def: 'ET-02', films: ET_FILMS, fdef: 'astana-merle',
    edges: ['film', 'black', 'white', 'agrey', 'ablack', 'aral'], paint: false, hinges: false, cop: true, grv: 0.3,
  },
  NOMINAL: {
    id: 'NOMINAL', name: 'NOMINAL', lt: 34, def: 'NL-05', films: NL_FILMS.map((x) => 'nl-' + x), fdef: 'nl-white',
    edges: ['black', 'white'], paint: false, hinges: true, grv: 0.3,
  },
  FREZZATTI: {
    id: 'FREZZATTI', name: 'FREZZATTI', lt: 34, def: 'FZ-01', films: NL_FILMS.map((x) => 'fz-' + x), fdef: 'fz-white',
    edges: ['black', 'white'], paint: true, hinges: true, grv: 0.22,
  },
  PERFETTO: {
    id: 'PERFETTO', name: 'PERFETTO', lt: 40, def: 'PF-01', films: ET_FILMS, fdef: 'white',
    edges: ['film', 'black', 'white'], paint: true, hinges: false, cop: true, grv: 0.3,
  },
  HIDDEN: {
    id: 'HIDDEN', name: 'HIDDEN DOORS', lt: 40, def: 'HD-01', films: [], fdef: 'paint',
    edges: ['film', 'agrey', 'ablack', 'aral'], paint: true, hinges: false, flush: true, grv: 0.3,
  },
};
export const COLL_ORDER: CollId[] = ['ETALON', 'NOMINAL', 'FREZZATTI', 'PERFETTO', 'HIDDEN'];
