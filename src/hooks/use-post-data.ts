import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/hooks/axios-instance'
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

interface UsePostDataOptions extends Omit<AxiosRequestConfig, 'url' | 'method' | 'data'> {
  onSuccess?: (data: any, context?: any) => void
  onError?: (error: Error | AxiosError, context?: any) => void
  onFinally?: () => void
  queryKey?: string | any[]
}

interface UsePostDataResult<T, D = any> {
  data: T | null
  error: Error | AxiosError | null
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  postData: (data: D & { toastId?: string }, context?: any) => Promise<void>
  reset: () => void
}

export function usePostData<T = any, D = any>(endpoint: string, options: UsePostDataOptions = {}): UsePostDataResult<T, D> {
  const { onSuccess, onError, onFinally, queryKey, ...axiosOptions } = options
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (postData: D & { toastId?: string }) => {
      const { toastId, ...rest } = postData as any
      const response: AxiosResponse<T> = await axiosInstance.post(endpoint, rest, {
        ...axiosOptions
      })
      return response.data
    },
    onSuccess: (data: T, variables: D & { toastId?: string }, context: any) => {
      if (queryKey) {
        const key = Array.isArray(queryKey) ? queryKey : [queryKey]
        // ✅ cache the mutation response immediately
        queryClient.setQueryData(key, data)
        // ✅ also invalidate to ensure fresh refetch if needed
        // queryClient.invalidateQueries({ queryKey: key })
      }
      if (onSuccess) onSuccess(data, variables)
    },
    onError: (error: Error | AxiosError, variables: D & { toastId?: string }, context: any) => {
      if (onError) onError(error as Error | AxiosError, variables)
    },
    onSettled: () => {
      if (onFinally) onFinally()
    }
  })

  return {
    data: mutation.data ?? null,
    error: mutation.error ?? null,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    postData: async (data: D & { toastId?: string }) => {
      await mutation.mutateAsync(data)
    },
    reset: mutation.reset
  }
}
