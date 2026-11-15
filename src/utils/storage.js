import { INITIAL_SERIES, INITIAL_GLASSES, FINISHES } from '../data/carpentryCatalog';

const SERIES_KEY = 'arlia_cad_series_v1';
const GLASSES_KEY = 'arlia_cad_glasses_v1';
const FINISHES_KEY = 'arlia_cad_finishes_v1';
const PLIEGO_KEY = 'arlia_cad_pliego_v1';
const INQUIRIES_KEY = 'arlia_cad_inquiries_v1';

export function getStoredSeries() {
  try {
    const raw = localStorage.getItem(SERIES_KEY);
    if (!raw) return INITIAL_SERIES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SERIES;
  } catch (err) {
    console.error('Error reading series from storage', err);
    return INITIAL_SERIES;
  }
}

export function saveStoredSeries(series) {
  try {
    localStorage.setItem(SERIES_KEY, JSON.stringify(series));
  } catch (err) {
    console.error('Error saving series to storage', err);
  }
}

export function getStoredGlasses() {
  try {
    const raw = localStorage.getItem(GLASSES_KEY);
    if (!raw) return INITIAL_GLASSES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_GLASSES;
  } catch (err) {
    console.error('Error reading glasses from storage', err);
    return INITIAL_GLASSES;
  }
}

export function saveStoredGlasses(glasses) {
  try {
    localStorage.setItem(GLASSES_KEY, JSON.stringify(glasses));
  } catch (err) {
    console.error('Error saving glasses to storage', err);
  }
}

export function getStoredFinishes() {
  try {
    const raw = localStorage.getItem(FINISHES_KEY);
    if (!raw) return FINISHES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : FINISHES;
  } catch (err) {
    console.error('Error reading finishes from storage', err);
    return FINISHES;
  }
}

export function saveStoredFinishes(finishes) {
  try {
    localStorage.setItem(FINISHES_KEY, JSON.stringify(finishes));
  } catch (err) {
    console.error('Error saving finishes to storage', err);
  }
}

export function getStoredPliego() {
  try {
    const raw = localStorage.getItem(PLIEGO_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error reading pliego from storage', err);
    return [];
  }
}

export function saveStoredPliego(pliego) {
  try {
    localStorage.setItem(PLIEGO_KEY, JSON.stringify(pliego));
  } catch (err) {
    console.error('Error saving pliego to storage', err);
  }
}

export function getStoredInquiries() {
  try {
    const raw = localStorage.getItem(INQUIRIES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error reading inquiries from storage', err);
    return [];
  }
}

export function saveStoredInquiries(inquiries) {
  try {
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(inquiries));
  } catch (err) {
    console.error('Error saving inquiries to storage', err);
  }
}

export function resetCatalogToDefault() {
  try {
    localStorage.removeItem(SERIES_KEY);
    localStorage.removeItem(GLASSES_KEY);
    localStorage.removeItem(FINISHES_KEY);
    return {
      series: INITIAL_SERIES,
      glasses: INITIAL_GLASSES,
      finishes: FINISHES
    };
  } catch (err) {
    console.error('Error resetting catalog', err);
    return {
      series: INITIAL_SERIES,
      glasses: INITIAL_GLASSES,
      finishes: FINISHES
    };
  }
}
