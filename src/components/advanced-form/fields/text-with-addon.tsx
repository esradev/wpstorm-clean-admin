import { useEffect, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { __ } from '@wordpress/i18n';

interface AddonOption {
  value: string;
  label: string;
}

interface TextWithAddonValue {
  value: string;
  addon: string;
}

interface TextWithAddonProps {
  input: {
    name: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    desc?: string;
    addons?: AddonOption[];
    value?: TextWithAddonValue;
    onChange: string;
    rules?: string;
  };
  onValueChange: (value: TextWithAddonValue) => void;
}

const TextWithAddon = ({ input, onValueChange }: TextWithAddonProps) => {
  const addons = input?.addons || [];
  // Use refs to avoid dispatching on initial mount
  const isFirstRender = useRef(true);

  // Use value and addon from props (controlled)
  const value = input?.value?.value || '';
  const addon = input?.value?.addon || (addons[0]?.value ?? '');

  // When value or addon changes (from user), dispatch the new value
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange({ value: e.target.value, addon });
  };

  const handleAddonChange = (newAddon: string) => {
    onValueChange({ value, addon: newAddon });
  };

  // If the value/addon changes from outside (form reset), do not dispatch again
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // No-op: controlled by parent
  }, [value, addon]);

  return (
    <div className="relative space-y-2">
      <div className="relative">
        <Label
          htmlFor={input?.name}
          className="absolute -top-2 right-2 bg-background px-1 text-xs font-medium"
        >
          {input?.label}
        </Label>
        <div className="flex rounded-md overflow-hidden">
          <Input
            type="text"
            name={input?.name}
            id={input?.name}
            value={value}
            required={input?.required}
            onChange={handleValueChange}
            className="rounded-l-none border-l-0"
            placeholder={input?.placeholder}
          />
          <Select value={addon} onValueChange={handleAddonChange}>
            <SelectTrigger className="w-[180px] rounded-r-none">
              <SelectValue
                placeholder={__('Select addon', 'storm-clean-admin')}
              />
            </SelectTrigger>
            <SelectContent>
              {addons.map((addonOption, index) => (
                <SelectItem key={index} value={addonOption.value}>
                  {addonOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {input?.desc && (
        <p
          className="text-sm text-muted-foreground"
          id={`${input?.name}-description`}
        >
          {input?.desc}
        </p>
      )}
    </div>
  );
};

export default TextWithAddon;
