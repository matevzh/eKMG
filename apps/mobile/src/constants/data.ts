export interface Farm {
  ime: string;
  lastnik: string;
  lokacija: string;
  kmg_mid: string;
  obcina: string;
  posta: string;
}

export interface Zival {
  id: number;
  si_id: string;
  ime: string;
  pasma: string;
  gender?: string;
  isLactating: boolean;
  isPregnant: boolean;
  datum_rojstva: string;
  laktacija: number;
  fatherId?: number | null;
  motherId?: number | null;
}

export interface ZivalDetail {
  osemenjevanja: { datum: string; ime_bika: string; rezultat_brejosti: string }[];
  zdravstveni_dogodki: { datum: string; tip: string; diagnoza: string; ime_veterinarja: string }[];
  terapije: { datum: string; doza: string; karenca: string; aplikator: string }[];
  premiki: { datum: string; tip_premika: string; prevoznik: string }[];
  telitve: { datum: string }[];
}

export interface Molzenje {
  id: number;
  datum: string;
  cas: string;
  vnesel: string;
  kolicina_mleka: number;
  mascoba: number;
  beljakovine: number;
  somatske_celice: number;
}

export interface Dostava {
  id: number;
  datum: string;
  kolicina_litrov: number;
  mascoba: number;
  beljakovine: number;
  cena_na_liter: number;
  stevilka_analize: string;
}

export interface Prihodek {
  id: number;
  kategorija: string;
  kolicina: number;
  datum: string;
}

export interface Odhodek extends Prihodek {
  prodajalec: string;
}

export const FARM: Farm = {
  ime: "Kmetija Novak",
  lastnik: "Janez Novak",
  lokacija: "Trbovlje",
  kmg_mid: "100482-031",
  obcina: "Trbovlje",
  posta: "1420 Trbovlje",
};

export const USER = { ime: "Janez Novak", vloga: "Lastnik" };

// Empty detail placeholder used until per-animal sub-resources (health events,
// inseminations, movements, calvings) have their own backend endpoints.
export const EMPTY_DETAIL: ZivalDetail = {
  osemenjevanja: [],
  zdravstveni_dogodki: [],
  terapije: [],
  premiki: [],
  telitve: [],
};

export const MOLZENJA: Molzenje[] = [
  { id: 1, datum: "2026-06-28", cas: "06:10", vnesel: "Janez Novak", kolicina_mleka: 312.4, mascoba: 4.1, beljakovine: 3.4, somatske_celice: 178 },
  { id: 2, datum: "2026-06-27", cas: "18:05", vnesel: "Janez Novak", kolicina_mleka: 298.7, mascoba: 4.0, beljakovine: 3.3, somatske_celice: 165 },
  { id: 3, datum: "2026-06-27", cas: "06:02", vnesel: "Ana Novak", kolicina_mleka: 305.1, mascoba: 4.2, beljakovine: 3.5, somatske_celice: 182 },
];

export const DOSTAVE: Dostava[] = [
  { id: 1, datum: "2026-06-26", kolicina_litrov: 612.0, mascoba: 4.1, beljakovine: 3.4, cena_na_liter: 0.41, stevilka_analize: "A-22341" },
  { id: 2, datum: "2026-06-23", kolicina_litrov: 598.5, mascoba: 4.0, beljakovine: 3.3, cena_na_liter: 0.4, stevilka_analize: "A-22298" },
];

export const PRIHODKI: Prihodek[] = [
  { id: 1, kategorija: "Prodaja mleka", kolicina: 982.4, datum: "2026-06-26" },
  { id: 2, kategorija: "Subvencije", kolicina: 1450.0, datum: "2026-06-10" },
];

export const ODHODKI: Odhodek[] = [
  { id: 1, kategorija: "Krma", kolicina: 412.0, datum: "2026-06-20", prodajalec: "Mlinotest" },
  { id: 2, kategorija: "Veterina", kolicina: 95.5, datum: "2026-06-03", prodajalec: "Vet. ambulanta Kovač" },
];

// Cattle breeds the user can pick from. `code` matches the backend breed codes;
// `label` is the feminine (default) Slovenian name; `labelMale` for bulls.
export interface BreedOption {
  code: string;
  label: string;
  labelMale: string;
}

export const BREEDS: BreedOption[] = [
  { code: "LS", label: "Lisasta (simentalka)", labelMale: "Lisasti (simentalec)" },
  { code: "RJ", label: "Rjava", labelMale: "Rjavi" },
  { code: "ČB", label: "Črno-bela (holstein)", labelMale: "Črno-beli (holstein)" },
  { code: "CK", label: "Cikasta", labelMale: "Cikasti" },
  { code: "LIM", label: "Limuzin", labelMale: "Limuzin" },
  { code: "CHA", label: "Šarole", labelMale: "Šarole" },
  { code: "JE", label: "Jersey", labelMale: "Jersey" },
  { code: "AY", label: "Ayrshire", labelMale: "Ayrshire" },
  { code: "MIX", label: "Mešana", labelMale: "Mešani" },
  { code: "KR", label: "Križanec", labelMale: "Križanec" },
];

export function breedLabel(code: string, gender?: string | null): string {
  const breed = BREEDS.find((b) => b.code === code);
  if (!breed) return code;
  return gender === "Moški" ? breed.labelMale : breed.label;
}

export const GENDERS: { value: string; label: string }[] = [
  { value: "Ženska", label: "Ženska" },
  { value: "Moški", label: "Moški" },
];

export function isMaleAnimal(gender?: string | null): boolean {
  return gender === "Moški";
}

export function isFemaleAnimal(gender?: string | null): boolean {
  return gender === "Ženska";
}

/** Farm-facing sex label for glanceable UI. */
export function animalSexLabel(gender?: string | null): "Bik" | "Krava" | null {
  if (isMaleAnimal(gender)) return "Bik";
  if (isFemaleAnimal(gender)) return "Krava";
  return null;
}

// Preset event titles in the add-opravilo UI. "Drugo" is UI-only: the user
// then types a custom title, which is what gets saved.
export const EVENT_TITLES = [
  "Predvidena telitev",
  "Veterinarski pregled",
  "Semenitev",
  "Premik",
  "Drugo",
] as const;

export const CUSTOM_EVENT_TITLE = "Drugo";

export const EVENT_TITLE_OPTIONS = EVENT_TITLES.map((t) => ({ value: t, label: t }));
