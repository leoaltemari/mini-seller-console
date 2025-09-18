import { act, renderHook } from '@testing-library/react';

import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    // Reset localStorage before each test
    localStorage.clear();
  });

  it('should initialize state with initial value if localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('key1', 'initial'));
    const [state] = result.current;
    expect(state).toBe('initial');
  });

  it('should initialize state from localStorage if value exists', () => {
    localStorage.setItem('key2', JSON.stringify('stored value'));
    const { result } = renderHook(() => useLocalStorage('key2', 'initial'));
    const [state] = result.current;
    expect(state).toBe('stored value');
  });

  it('should update state and persist to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('key3', 'initial'));

    act(() => {
      const [, setState] = result.current;
      setState('new value');
    });

    const [state] = result.current;
    expect(state).toBe('new value');
    expect(localStorage.getItem('key3')).toBe(JSON.stringify('new value'));
  });
});
