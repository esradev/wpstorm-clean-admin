import { __ } from '@wordpress/i18n';
import { Textarea as ShadcnTextarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { TextareaFieldConfig } from '../types';

interface Variable {
  label: string;
  value: string;
}

interface TextareaInputProps {
  field: TextareaFieldConfig<any>;
  formField: ControllerRenderProps<any, string>;
  isDisabled?: boolean;
}

export function TextareaInput({
  field,
  formField,
  isDisabled,
}: TextareaInputProps) {
  const onAddVariable = (variable: Variable) => {
    const textarea = document.getElementById(field.name) as HTMLTextAreaElement;
    if (!textarea) return;

    const value = textarea.value;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue =
      value.substring(0, start) + variable.value + value.substring(end);

    formField.onChange(newValue);

    // We need to wait for the next tick to set the selection
    setTimeout(() => {
      textarea.selectionStart = start + variable.value.length;
      textarea.selectionEnd = start + variable.value.length;
      textarea.focus();
    }, 0);
  };

  return (
    <>
      <FormLabel htmlFor={field.name}>{field.label}</FormLabel>
      <FormControl>
        <ShadcnTextarea
          id={field.name}
          {...formField}
          placeholder={field.placeholder}
          rows={field.rows}
          {...formField}
          disabled={isDisabled}
        />
      </FormControl>
      {field.variables && (
        <>
          <div className="space-y-2">
            <Label>{__('Variables:', 'storm-clean-admin')}</Label>
            <div className="flex flex-wrap gap-2">
              {field.variables.map((variable) => (
                <Button
                  key={variable.value}
                  variant="outline"
                  type="button"
                  size="sm"
                  onClick={() => onAddVariable(variable)}
                >
                  {variable.label}
                </Button>
              ))}
            </div>
          </div>
          <Separator className="my-4" />
        </>
      )}
      {field.description && (
        <FormDescription> {field.description}</FormDescription>
      )}
      <FormMessage />
    </>
  );
}
