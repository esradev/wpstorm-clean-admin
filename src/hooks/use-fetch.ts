import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/hooks/axios-instance'

interface useFetchOptions {
  axiosConfig?: object
  queryKey?: readonly unknown[]
  enabled?: boolean
}

interface useFetchReturn<T = any> {
  data: T | undefined
  error: unknown
  isFetching: boolean
  isSuccess: boolean
  refetch: () => void
}

/**
 * Custom hook to fetch data using axios + react-query.
 */
export const useFetch = <T = any>(url: string, { axiosConfig = {}, queryKey, enabled = true }: useFetchOptions & { enabled?: boolean } = {}): useFetchReturn<T> => {
  const query = useQuery<T>({
    queryKey: queryKey ?? [url],
    queryFn: async () => {
      const res = await axiosInstance.get(url, axiosConfig)
      return res.data
    },
    enabled
  })

  return {
    data: query.data,
    error: query.error,
    isFetching: query.isFetching,
    isSuccess: query.isSuccess,
    refetch: query.refetch
  }
}
