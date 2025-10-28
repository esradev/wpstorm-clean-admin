import { __ } from '@wordpress/i18n';
import { Check, Info, Loader, Trash } from 'lucide-react';
import { Button } from './ui/button';

interface FormSubmitButtonProps {
  state: 'initial' | 'loading' | 'success' | 'error';
  onReset?: () => void;
  submitButtonText?: string;
  resetButtonText?: string;
}

export default function FormSubmitButton({
  state = 'initial',
  onReset,
  submitButtonText = __('Save Changes', 'storm-clean-admin'),
  resetButtonText = __('Reset', 'storm-clean-admin'),
}: FormSubmitButtonProps) {
  return (
    <div className="w-full flex items-center justify-between gap-3 p-3 rounded-2xl bg-bunker-900 shadow-md border border-bunker-700">
      {/* Left: Status Messages */}
      <div className="flex items-center gap-2">
        {state === 'loading' && (
          <>
            <Loader className="animate-spin w-5 h-5 text-cream-400" />
            <span className="text-cream-100 text-sm font-medium">
              {__('Saving Settings, wait...', 'storm-clean-admin')}
            </span>
          </>
        )}
        {state === 'success' && (
          <>
            <div className="p-1 bg-cream-500 rounded-full shadow-sm">
              <Check className="w-4 h-4 text-white" />
            </div>
            <span className="text-cream-200 text-sm font-medium">
              {__('Changes Saved', 'storm-clean-admin')}
            </span>
          </>
        )}
        {state === 'error' && (
          <>
            <div className="p-1 bg-cream-700 rounded-full shadow-sm">
              <Info className="w-4 h-4 text-white" />
            </div>
            <span className="text-cream-100 text-sm font-medium">
              {__('Error saving changes', 'storm-clean-admin')}
            </span>
          </>
        )}
        {state === 'initial' && (
          <>
            <Info className="w-5 h-5 text-cream-400" />
            <span className="text-cream-100 text-sm font-medium">
              {__('Save your changes', 'storm-clean-admin')}
            </span>
          </>
        )}
      </div>

      {/* Right: Buttons */}
      {state === 'initial' && (
        <div className="flex items-center gap-2">
          {/* Reset Button */}
          <Button
            type="button"
            onClick={onReset}
            variant="ghost"
            className="
              h-9 px-4 text-xs font-medium rounded-[99px]
              text-cream-100 border border-bunker-600
              bg-bunker-800/50
              hover:bg-bunker-700
              hover:text-cream-100
              focus:ring-2 focus:ring-cream-300 focus:ring-offset-1 focus:ring-offset-bunker-900
              transition-all duration-200
            "
          >
            <Trash className="w-4 h-4 mr-1" />
            {resetButtonText}
          </Button>

          {/* Submit Button */}
          <Button
            type="submit"
            className="
              h-9 px-5 text-sm font-semibold rounded-[99px]
              text-white
              bg-gradient-to-r from-cream-400 to-cream-600
              shadow-[inset_0px_1px_0px_rgba(255,255,255,0.25),0px_2px_6px_rgba(0,0,0,0.25)]
              hover:from-cream-300 hover:to-cream-500
              active:from-cream-600 active:to-cream-700
              focus:ring-2 focus:ring-cream-200 focus:ring-offset-1 focus:ring-offset-bunker-900
              transition-all duration-200
            "
          >
            {submitButtonText}
          </Button>
        </div>
      )}
    </div>
  );
}
