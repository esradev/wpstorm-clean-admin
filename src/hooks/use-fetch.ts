import axios from 'axios';
import { useEffect, useState } from '@wordpress/element';
import { axiosInstance } from '@/hooks/axios-instance';

interface useFetchOptions {
  immediate?: boolean;
  axiosConfig?: object;
}

interface useFetchReturn {
  data: any;
  error: any;
  isFetching: boolean;
  isSuccess: boolean;
  setFetchCount: (count: number) => void;
}

/**
 * Custom hook to fetch data using axios.
 * @param {string} url - The API endpoint.
 * @param {object} options - Additional options (immediate: boolean, axiosConfig: object).
 * @returns {object} { data, error, isFetching, isSuccess, setFetchCount }
 */
export const useFetch = (
  url: string,
  { immediate = true, axiosConfig = {} }: useFetchOptions = {},
): useFetchReturn => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [fetchCount, setFetchCount] = useState<number>(0);

  useEffect(() => {
    if (immediate) {
      setIsFetching(true);
      setData(null);
      setError(null);
      const source = axios.CancelToken.source();
      axiosInstance
        .get(url, { cancelToken: source.token })
        .then((res) => {
          res.data && setData(res.data);
          setIsSuccess(true);
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setIsFetching(false);
        });
      return () => {
        source.cancel();
      };
    }
  }, [url, fetchCount]);

  return { data, error, isFetching, isSuccess, setFetchCount };
};
