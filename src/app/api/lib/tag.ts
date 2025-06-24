export const GLOBAL_TAGS = {
	'arithmetic': { names: { fr: 'Arithmétique', en: 'Arithmetic' } },
	'plane': { names: { fr: 'Plan 2D', en: '2D Plane' } },
	'vectors': { names: { fr: 'Vecteurs', en: 'Vectors' } },
	'combinatorics': { names: { fr: 'Combinatoire', en: 'Combinatorics' } },
	'conversion': { names: { fr: 'Conversion', en: 'Conversion' } },
	'lists': { names: { fr: 'Liste', en: 'List' } }
} as const;

export type TAG_ID = keyof typeof GLOBAL_TAGS 