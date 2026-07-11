import { useState, useCallback } from "react";
export function useLocalStorage(key, defaultValue) {
    const [value, setValue] =useState(() => {
        try{
            const stored = window.localStorage.getItem(key);
            return stored !== null ? JSON.parse(stored) : defaultValue;
        }   catch {
            return defaultValue;
        }
    });
    const setAndPresist = useCallback(
        (next) => {
            setValue((prev) => {
                const resolved = typeof next === "function" ? next(prev) : next;
                try{
                    window.localStorage.setItem(key, JSON.stringify(resolved));
                }   catch {
                }
                return resolved;
            });
        },
        [key]
    );
    return [value, setAndPresist];
}