"use client";

import { useCallback, useState } from "react";

/**
 * Hook to toggle boolean state.
 * Returns value and helper functions.
 */
export function useToggle(
  initialValue: boolean = false
): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const setToggleValue = useCallback((val: boolean) => {
    setValue(val);
  }, []);

  return [value, toggle, setToggleValue];
}
