import { Skeleton } from '@/components/ui/skeleton'

interface Input {
  type: string
  show?: boolean
}

interface LoadingSkeletonProps {
  inputs: Input[]
}

const LoadingSkeleton = ({ inputs }: LoadingSkeletonProps) => {
  return (
    <div className="space-y-10 relative sm:p-6 p-2">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto mb-2 flex-row flex gap-5 items-center">
          <Skeleton className="rounded-lg flex leading-6 h-5 w-28" />
          <Skeleton className="flex rounded-lg h-5 w-60" />
        </div>
        <Skeleton className="sm:flex-none w-32 h-10 rounded-lg" />
      </div>
      <div>
        <div>
          <div className="grid max-w-full grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
            {inputs
              .filter((input) => input.type !== 'hidden')
              .filter((input) => input.show !== false)
              .map((input, index) => (
                <div className="col-span-full" key={index}>
                  <Skeleton className="h-6 rounded mb-2 w-1/6" />
                  <Skeleton className="h-8 rounded mb-2 w-6/6" />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingSkeleton
