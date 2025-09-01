import { __ } from '@wordpress/i18n'
import { Check, Info, Loader, Trash } from 'lucide-react'
import { Button } from './ui/button'

interface ToastProps {
  state: 'initial' | 'loading' | 'success' | 'error'
  onReset?: () => void
  submitButtonText?: string
  resetButtonText?: string
}

export default function FormSubmitButton({ state = 'initial', onReset, submitButtonText, resetButtonText }: ToastProps) {
  const commonClasses = 'h-12 bg-[#131316] dark:bg-gray-700 opacity-100 shadow-3xl rounded-[99px] justify-center items-center inline-flex overflow-hidden transition-all duration-300 ease-in-out'

  return (
    <div className={commonClasses}>
      <div className="flex items-center justify-between h-full flex-row-reverse p-3">
        <div className="flex items-center gap-2 transition-opacity duration-300 ease-in-out">
          {state === 'loading' && (
            <>
              <div className="text-white text-base font-normal leading-tight whitespace-nowrap">{__('Saving Settings, wait...', 'wpstorm-clean-admin')}</div>
              <Loader className="animate-spin w-5 h-5 text-white" />
            </>
          )}
          {state === 'success' && (
            <>
              <div className="text-white text-base font-normal leading-tight whitespace-nowrap">{__('Changes Saved', 'wpstorm-clean-admin')}</div>
              <div className="p-0.5 bg-green-600 rounded-[99px] border border-white/25 flex overflow-hidden">
                <Check className="w-3.5 h-3.5 text-white" />
              </div>
            </>
          )}
          {state === 'error' && (
            <>
              <div className="p-0.5 bg-white/25 rounded-[99px] border border-white/25 flex overflow-hidden">
                <Info className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="text-white text-base font-normal leading-tight whitespace-nowrap">{__('Error', 'wpstorm-clean-admin')}</div>
            </>
          )}
          {state === 'initial' && (
            <>
              <div className="text-white font-normal leading-tight whitespace-nowrap">{__('Save your changes', 'wpstorm-clean-admin')}</div>
              <Info className="text-white size-5" />
            </>
          )}
        </div>

        {state === 'initial' && (
          <div className="flex items-center gap-x-2 ml-2 transition-opacity duration-300 ease-in-out">
            <Button type="button" onClick={onReset} variant="ghost" size="icon" className="h-7 px-3 w-auto text-[13px] text-white hover:bg-white/10 hover:text-white rounded-[99px] transition-colors duration-200">
              <Trash className="w-4 h-4 text-white" />
              {resetButtonText}
            </Button>
            <Button type="submit" className="h-8 px-3 bg-gradient-to-b from-[#7c5aff] text-white text-base font-medium leading-tight to-[#6c47ff] rounded-[99px] shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.16),0px_1px_2px_0px_rgba(0,0,0,0.20)] justify-center items-center inline-flex overflow-hidden cursor-pointer hover:from-[#8f71ff] hover:to-[#7c5aff] active:from-[#6c47ff] active:to-[#5835ff] transition-all duration-200">
              {submitButtonText}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
