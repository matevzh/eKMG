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
// `label` is the Slovenian name shown in the app.
export interface BreedOption {
  code: string;
  label: string;
}

export const BREEDS: BreedOption[] = [
  { code: "LS", label: "Lisasta (simentalka)" },
  { code: "RJ", label: "Rjava" },
  { code: "ČB", label: "Črno-bela (holstein)" },
  { code: "CK", label: "Cikasta" },
  { code: "LIM", label: "Limuzin" },
  { code: "CHA", label: "Šarole" },
  { code: "JE", label: "Jersey" },
  { code: "AY", label: "Ayrshire" },
  { code: "MIX", label: "Mešana" },
  { code: "KR", label: "Križanec" },
];

export function breedLabel(code: string): string {
  return BREEDS.find((b) => b.code === code)?.label ?? code;
}

export const GENDERS: { value: string; label: string }[] = [
  { value: "Ženska", label: "Ženska" },
  { value: "Moški", label: "Moški" },
];
