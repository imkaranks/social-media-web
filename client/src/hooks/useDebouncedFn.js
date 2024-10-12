import { useCallback, useRef } from "react";

const useDebouncedFn = (callback, delay) => {
  const timerRef = useRef();

  const debouncedCallback = useCallback(
    (...args) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  );

  return debouncedCallback;
};

export default useDebouncedFn;
