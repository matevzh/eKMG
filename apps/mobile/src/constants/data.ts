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
