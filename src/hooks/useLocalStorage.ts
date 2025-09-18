import { useEffect, useState } from 'react';

/**
 * A custom React hook for managing state that is synchronized with localStorage.
 * This hook allows you to persist state across page reloads by saving it to the browser's localStorage.
 *
 * @template T - The type of the state value.
 * @param {string} key - The key under which the state value will be stored in localStorage.
 * @param {T} initialValue - The initial value of the state, used if no value is found in localStorage.
 * @returns {readonly [T, React.Dispatch<React.SetStateAction<T>>]} A tuple containing:
 * - The current state value.
 * - A function to update the state value.
 *
 * @example
 * ```tsx
 * const [name, setName] = useLocalStorage<string>('name', 'John Doe');
 *
 * // Update the state and persist it to localStorage
 * setName('Jane Doe');
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): readonly [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
      console.error(e);
    }
  }, [key, state]);

  return [state, setState] as const;
}
