import { useState } from 'react'
import { axiosInstance } from '@/hooks/axios-instance'
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

interface UseUpdateDataOptions extends Omit<AxiosRequestConfig, 'url' | 'method' | 'data'> {
  onSuccess?: (data: any, context?: any) => void
  onError?: (error: Error | AxiosError, context?: any) => void
}

interface UseUpdateDataResult<T, D = any> {
  data: T | null
  error: Error | AxiosError | null
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  updateData: (data: D, context?: any) => Promise<void>
  reset: () => void
}

export function useUpdateData<T = any, D = any>(endpoint: string, options: UseUpdateDataOptions = {}): UseUpdateDataResult<T, D> {
  const { onSuccess, onError, ...axiosOptions } = options

  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | AxiosError | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)

  const updateData = async (updateData: D, context?: any): Promise<void> => {
    setIsLoading(true)
    setIsError(false)
    setError(null)

    try {
      const response: AxiosResponse<T> = await axiosInstance.put(endpoint, updateData, { ...axiosOptions })
      setData(response.data)
      setIsSuccess(true)

      if (onSuccess) {
        onSuccess(response.data, context)
      }
    } catch (err) {
      const error = err as Error | AxiosError
      setError(error)
      setIsError(true)
      setIsSuccess(false)

      if (onError) {
        onError(error, context)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const reset = () => {
    setData(null)
    setError(null)
    setIsLoading(false)
    setIsSuccess(false)
    setIsError(false)
  }

  return {
    data,
    error,
    isLoading,
    isSuccess,
    isError,
    updateData,
    reset
  }
}
