import { useState, useCallback, useRef } from 'react';

/**
 * Custom hook for managing async API calls with loading, error and data state.
 * @param {Function} asyncFn - The async function to execute
 * @param {*} initialData - Initial data state
 */
export const useAsyncFetch = (asyncFn, initialData = null) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFn(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [asyncFn]);

  const reset = () => {
    setData(initialData);
    setError(null);
    setLoading(false);
  };

  return { data, loading, error, execute, reset };
};
