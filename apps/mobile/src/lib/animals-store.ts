import { useSyncExternalStore } from "react";

import { breedLabel, type Zival } from "@/constants/data";
import * as api from "@/lib/api";

// Live animal list backed by the API. Screens read it with `useAnimals()`;
// `loadAnimals` refreshes from the backend and `addAnimal` persists a new one.
let animals: Zival[] = [];
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return animals;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function toZival(a: api.ApiAnimal): Zival {
  return {
    id: a.id,
    si_id: a.si_id,
    ime: a.name,
    pasma: a.breed ? breedLabel(a.breed) : "—",
    isLactating: a.isLactating,
    isPregnant: a.isPregnant,
    datum_rojstva: a.dateOfBirth ?? "—",
    laktacija: a.lactation ?? 0,
  };
}

// Data collected by the add-animal form before it is sent to the backend.
export interface NewAnimalInput {
  ime: string;
  si_id: string;
  breed: string; // breed code
  spol: string; // gender
  isLactating: boolean;
  isPregnant: boolean;
  datum_rojstva: string;
  datum_pridobitve: string;
  datum_oznacitve: string;
  laktacija: number;
}

// The backend validates dates as ISO strings; only send a well-formed one.
function isoOrUndefined(value: string): string | undefined {
  return DATE_RE.test(value) ? value : undefined;
}

function toPayload(input: NewAnimalInput): api.CreateAnimalPayload {
  return {
    name: input.ime,
    si_id: input.si_id,
    breed: input.breed || undefined,
    gender: input.spol || undefined,
    isLactating: input.isLactating,
    isPregnant: input.isPregnant,
    dateOfBirth: isoOrUndefined(input.datum_rojstva),
    acquisitionDate: isoOrUndefined(input.datum_pridobitve),
    dateOfTagging: isoOrUndefined(input.datum_oznacitve),
    lactation: input.laktacija,
  };
}

export async function loadAnimals(token: string): Promise<void> {
  const fetched = await api.getAnimals(token);
  animals = fetched.map(toZival);
  emit();
}

export async function addAnimal(token: string, input: NewAnimalInput): Promise<Zival> {
  const created = toZival(await api.createAnimal(token, toPayload(input)));
  animals = [created, ...animals];
  emit();
  return created;
}

export async function updateAnimalState(
  token: string,
  id: number,
  state: Partial<Pick<Zival, "isLactating" | "isPregnant">>,
): Promise<void> {
  const updated = toZival(await api.updateAnimal(token, id, state));
  animals = animals.map((a) => (a.id === id ? updated : a));
  emit();
}

export async function removeAnimal(token: string, id: number): Promise<void> {
  await api.deleteAnimal(token, id);
  animals = animals.filter((a) => a.id !== id);
  emit();
}

export function useAnimals(): Zival[] {
  return useSyncExternalStore(subscribe, getSnapshot);
}
