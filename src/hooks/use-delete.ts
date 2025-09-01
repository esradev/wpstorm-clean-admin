import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { useState } from '@wordpress/element'
import { axiosInstance } from '@/hooks/axios-instance'

interface UseDeleteOptions extends Omit<AxiosRequestConfig, 'url' | 'method' | 'data'> {
  onSuccess?: (data: any, context?: any) => void
  onError?: (error: Error | AxiosError, context?: any) => void
  onFinally?: (context?: any) => void
}

interface UseDeleteResult<T> {
  data: T | null
  error: Error | AxiosError | null
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  deleteItem: (id: number | string, context?: any) => Promise<void>
  deleteItems: (ids: (number | string)[], context?: any) => Promise<void>
  reset: () => void
}

export function useDelete<T = any>(endpoint: string, options: UseDeleteOptions = {}): UseDeleteResult<T> {
  const { onSuccess, onError, onFinally, ...axiosOptions } = options

  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | AxiosError | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)

  const deleteItem = async (id: number | string, context?: any): Promise<void> => {
    setIsLoading(true)
    setIsError(false)
    setError(null)

    try {
      const response: AxiosResponse<T> = await axiosInstance.delete(endpoint, { data: id })

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
      if (onFinally) {
        onFinally(context)
      }
      setIsLoading(false)
    }
  }

  const deleteItems = async (ids: (number | string)[], context?: any): Promise<void> => {
    setIsLoading(true)
    setIsError(false)
    setError(null)

    try {
      const response: AxiosResponse<T> = await axiosInstance.delete(endpoint, { data: ids })

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
      if (onFinally) {
        onFinally(context)
      }
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
    deleteItem,
    deleteItems,
    reset
  }
}
