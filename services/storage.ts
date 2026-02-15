
import { AppState, AppStore } from "../types";

const STORAGE_KEY = "budgetTrackerData_v2";

/**
 * Validates the structure of the data to ensure it's safe to load
 */
function isValidAppState(data: any): data is AppState {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.monthsData === 'object' &&
    typeof data.currentMonth === 'string'
  );
}

/**
 * Persists application state to local storage.
 */
export function saveToLocalStorage(data: AppState): void {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, serializedData);
  } catch (error) {
    console.error("[Storage] Failed to save:", error);
  }
}

/**
 * Retrieves application state from local storage with safety checks.
 */
export function loadFromLocalStorage(): AppState | null {
  try {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    if (!serializedData) return null;
    
    const data = JSON.parse(serializedData);
    
    if (isValidAppState(data)) {
      return data;
    }
    
    console.warn("[Storage] Invalid data structure found in localStorage.");
    return null;
  } catch (error) {
    console.error("[Storage] Failed to parse data:", error);
    return null;
  }
}

/**
 * Handles the logic for exporting the current store to a JSON file
 */
export function exportDataAsJSON(store: AppStore): void {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(store, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", `budget_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}
