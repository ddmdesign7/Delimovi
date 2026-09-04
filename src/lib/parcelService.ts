import { Parcel } from '../types';
import { INITIAL_PARCELS } from '../data/mockParcels';

const STORAGE_KEY = 'delimovi_local_parcels_v1';

/**
 * Load parcels from local storage, falling back to mock parcels
 */
export function loadParcels(): Record<string, Parcel> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not load parcels from storage:', err);
  }
  return INITIAL_PARCELS;
}

/**
 * Save updated parcels to local storage
 */
export function saveParcels(parcels: Record<string, Parcel>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parcels));
  } catch (err) {
    console.warn('Could not save parcels to storage:', err);
  }
}
