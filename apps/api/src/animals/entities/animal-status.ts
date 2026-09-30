// Allowed animal statuses. Must stay in sync with the mobile app's
// STATUS_STYLE keys (apps/mobile/src/constants/data.ts).
export enum AnimalStatus {
    Aktivna = 'aktivna',
    Brejost = 'brejost',
    Presusena = 'presušena',
    Zdravljenje = 'zdravljenje',
}

export const ANIMAL_STATUSES: string[] = Object.values(AnimalStatus);
