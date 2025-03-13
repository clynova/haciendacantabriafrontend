import { useState, useEffect } from 'react';

/**
 * Hook para debounce de valores
 * @param {any} value - El valor a debounce
 * @param {number} delay - El delay en milisegundos
 * @returns {any} - El valor debounced
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Configurar un timer para actualizar el valor debounced después del delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpiar el timer si el valor cambia antes del delay
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};
