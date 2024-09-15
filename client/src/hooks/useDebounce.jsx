import { useEffect, useState } from "react";

export default function useDebounce(value, delay = 300) {
  const [debouncedVal, setDebouncedVal] = useState(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedVal(value), delay);

    return () => clearTimeout(timeoutId);
  }, [value, delay]);

  return debouncedVal;
}
