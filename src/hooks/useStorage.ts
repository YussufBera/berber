import { useState, useEffect } from 'react';

// Custom event name for same-tab synchronization
const LOCAL_STORAGE_EVENT = 'local-storage-update';

export function useStorage<T>(key: string, initialValue: T) {
    // Always start with initialValue to match server-side rendering (prevent hydration mismatch)
    const [storedValue, setStoredValue] = useState<T>(initialValue);

    // Helper to read safe value
    const readFromStorage = (): T => {
        if (typeof window === 'undefined') return initialValue;
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    };

    // Sync with localStorage on mount
    useEffect(() => {
        setStoredValue(readFromStorage());
    }, []); // Run once on mount to hydrate

    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = (value: T | ((val: T) => T)) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore = value instanceof Function ? value(storedValue) : value;

            // Save state
            setStoredValue(valueToStore);

            // Save to local storage
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));

                // Dispatch custom event for same-tab sync
                window.dispatchEvent(new Event(LOCAL_STORAGE_EVENT));
            }
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    };

    useEffect(() => {
        const handleStorageChange = () => {
            setStoredValue(readFromStorage());
        };

        // Listen for changes from other tabs
        window.addEventListener('storage', handleStorageChange);

        // Listen for changes from the same tab (our custom event)
        window.addEventListener(LOCAL_STORAGE_EVENT, handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener(LOCAL_STORAGE_EVENT, handleStorageChange);
        };
    }, [key]);

    return [storedValue, setValue] as const;
}
