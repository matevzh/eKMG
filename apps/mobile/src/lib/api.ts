// API base URL. Override by setting EXPO_PUBLIC_API_URL in a .env file — e.g.
// http://10.0.2.2:3000 for the Android emulator, or your machine's LAN IP for
// a physical device via Expo Go, since "localhost" there means the device itself.
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://10.0.2.2:3000";

export interface AuthFarm {
  id: number;
  kmg_mid: string;
}

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  farm: AuthFarm;
}

export interface AuthResult {
  access_token: string;
  user: AuthUser;
  // Only set on registration: true when a brand-new farm was created, so the owner should complete farm setup. Absent/false when joining an existing farm.
  needsFarmSetup?: boolean;
}

export interface ProfileFarm {
  id: number;
  name: string | null;
  location: string | null;
  kmg_mid: string;
  province: string | null;
  postOffice: string | null;
}

export interface Profile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  farm: ProfileFarm;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  kmg_mid: string;
  // GDPR consent captured at registration: must be true, with the version of the Terms/Privacy texts the user accepted.
  acceptedTerms: boolean;
  policyVersion: string;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const payload = await res.json().catch(() => null);

  if (!res.ok) {
    const message = payload?.message ?? "Nekaj je šlo narobe. Poskusi znova.";
    throw new Error(Array.isArray(message) ? message.join("\n") : message);
  }

  return payload as T;
}

async function postAuth<T>(path: string, body: unknown, token: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const payload = await res.json().catch(() => null);

  if (!res.ok) {
    const message = payload?.message ?? "Nekaj je šlo narobe. Poskusi znova.";
    throw new Error(Array.isArray(message) ? message.join("\n") : message);
  }

  return payload as T;
}

async function get<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const payload = await res.json().catch(() => null);

  if (!res.ok) {
    const message = payload?.message ?? "Nekaj je šlo narobe. Poskusi znova.";
    throw new Error(Array.isArray(message) ? message.join("\n") : message);
  }

  return payload as T;
}

async function patch<T>(path: string, body: unknown, token: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const payload = await res.json().catch(() => null);

  if (!res.ok) {
    const message = payload?.message ?? "Nekaj je šlo narobe. Poskusi znova.";
    throw new Error(Array.isArray(message) ? message.join("\n") : message);
  }

  return payload as T;
}

async function del(path: string, token: string): Promise<void> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => null);
    const message = payload?.message ?? "Nekaj je šlo narobe. Poskusi znova.";
    throw new Error(Array.isArray(message) ? message.join("\n") : message);
  }
}

export function login(payload: LoginPayload): Promise<AuthResult> {
  return post<AuthResult>("/auth/login", payload);
}

export function getProfile(token: string): Promise<Profile> {
  return get<Profile>("/users/me", token);
}

// GDPR Art. 15/20 — the full personal-data export for the signed-in user.
export function exportMyData(token: string): Promise<unknown> {
  return get<unknown>("/users/me/export", token);
}

// GDPR Art. 17 — permanently delete the signed-in user's account.
export function deleteMyAccount(token: string): Promise<void> {
  return del("/users/me", token);
}

export interface UpdateFarmPayload {
  name: string;
  location: string;
  province: string;
  postOffice: string;
}

export function updateFarm(token: string, payload: UpdateFarmPayload): Promise<ProfileFarm> {
  return patch<ProfileFarm>("/farms/mine", payload, token);
}

export async function register(payload: RegisterPayload): Promise<AuthResult> {
  const { data } = await post<{ data: AuthUser & { access_token: string; needsFarmSetup?: boolean } }>(
    "/auth/register",
    payload,
  );
  const { access_token, needsFarmSetup, ...user } = data;
  return { access_token, user, needsFarmSetup };
}

// Animal shape returned by the backend (subset of the `animals` entity).
export interface ApiAnimal {
  id: number;
  si_id: string;
  name: string;
  breed: string | null;
  isLactating: boolean;
  isPregnant: boolean;
  dateOfBirth: string | null;
  lactation: number | null;
}

export interface CreateAnimalPayload {
  name: string;
  si_id: string;
  breed?: string;
  gender?: string;
  isLactating?: boolean;
  isPregnant?: boolean;
  dateOfBirth?: string;
  acquisitionDate?: string;
  dateOfTagging?: string;
  lactation?: number;
}

export function getAnimals(token: string): Promise<ApiAnimal[]> {
  return get<ApiAnimal[]>("/animals", token);
}

export function createAnimal(token: string, payload: CreateAnimalPayload): Promise<ApiAnimal> {
  return postAuth<ApiAnimal>("/animals", payload, token);
}

export type UpdateAnimalPayload = Partial<Pick<ApiAnimal, "isLactating" | "isPregnant">>;

export function updateAnimal(token: string, id: number, payload: UpdateAnimalPayload): Promise<ApiAnimal> {
  return patch<ApiAnimal>(`/animals/${id}`, payload, token);
}

export function deleteAnimal(token: string, id: number): Promise<void> {
  return del(`/animals/${id}`, token);
}

// Calendar event returned by the backend.
export interface ApiEvent {
  id: number;
  title: string;
  note: string | null;
  date: string;
  notificationId: string | null;
  reminderSent: boolean;
  animalId: number | null;
  animalName: string | null;
  animalSiId: string | null;
}

export interface CreateEventPayload {
  title: string;
  note?: string;
  date: string;
  notificationId?: string | null;
  animalId?: number | null;
}

export function getEvents(token: string): Promise<ApiEvent[]> {
  return get<ApiEvent[]>("/events", token);
}

export function createEvent(token: string, payload: CreateEventPayload): Promise<ApiEvent> {
  return postAuth<ApiEvent>("/events", payload, token);
}

export function deleteEvent(token: string, id: number): Promise<void> {
  return del(`/events/${id}`, token);
}

export interface RegisterPushTokenPayload {
  token: string;
  platform?: string;
}

export function registerPushToken(authToken: string, payload: RegisterPushTokenPayload): Promise<void> {
  return postAuth<void>("/push/register", payload, authToken);
}

export function unregisterPushToken(authToken: string, pushToken: string): Promise<void> {
  return postAuth<void>("/push/unregister", { token: pushToken }, authToken);
}
