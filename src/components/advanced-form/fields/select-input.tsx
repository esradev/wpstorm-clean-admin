import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import Select, { MultiValue, SingleValue } from 'react-select';
import { ControllerRenderProps } from 'react-hook-form';
import { SelectFieldConfig } from '../types';
import {
  FormControl,
  FormDescription,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface SelectInputProps {
  field: SelectFieldConfig<any>;
  formField: ControllerRenderProps<any, string>;
  isDisabled?: boolean;
  values: any;
}

export interface Option {
  value: string;
  label: string;
  status?: string;
  body?: string;
  fields?: any;
}

export function SelectInput({
  field,
  formField,
  isDisabled,
  values,
}: SelectInputProps) {
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    if (field.options) {
      let options: Option[] | ((values: any) => Option[]);
      if (Array.isArray(field.options)) {
        options = field.options.map((option) => ({
          value: option.value,
          label: option.label,
          status: option?.status,
          body: option?.body,
          fields: option?.fields,
        }));
      } else {
        options = field.options(values);
      }
      setOptions(options);
    }

    return () => {
      setOptions([]);
    };
  }, [field.options, values]);

  const handleChange = (newValue: MultiValue<Option> | SingleValue<Option>) => {
    if (Array.isArray(newValue)) {
      formField.onChange(newValue);
    } else {
      formField.onChange(
        newValue && !Array.isArray(newValue) && newValue !== null
          ? newValue
          : null,
      );
    }
  };

  const value =
    field.isMulti && Array.isArray(formField.value)
      ? options.filter((option) =>
          formField.value.some((val: Option) => val.value === option.value),
        )
      : options.find((option) => option.value === formField.value?.value) ||
        null;

  return (
    <>
      <FormLabel>{field.label}</FormLabel>
      <FormControl>
        <Select
          id={field.name}
          options={options}
          value={value}
          isClearable
          isMulti={field.isMulti}
          isLoading={field.isLoading}
          onChange={handleChange}
          placeholder={
            field.placeholder || __('Select an option', 'wpstorm-clean-admin')
          }
          isDisabled={isDisabled}
          className="react-select-container"
          classNamePrefix="react-select"
          getOptionLabel={
            field?.customLabel
              ? (option) => (
                  <span>
                    <span
                      className={`inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium  ${
                        option.status === '1'
                          ? ' text-green-600 bg-green-100'
                          : ' text-wpstorm-clean-admin-600 bg-wpstorm-clean-admin-100'
                      }`}
                    >
                      {option?.value}
                    </span>{' '}
                    {option?.label}
                  </span>
                )
              : undefined
          }
          styles={{
            control: (provided) => ({
              ...provided,
              borderColor: 'hsl(var(--input))',
              '&:hover': {
                borderColor: 'hsl(var(--input-hover))',
              },
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isSelected
                ? 'hsl(var(--primary))'
                : state.isFocused
                ? 'hsl(var(--accent))'
                : 'transparent',
              color: state.isSelected
                ? 'hsl(var(--primary-foreground))'
                : 'inherit',
            }),
          }}
        />
      </FormControl>
      {field.description && (
        <FormDescription className="text-sm text-muted-foreground">
          {field.description}
        </FormDescription>
      )}
      <FormMessage />
    </>
  );
}
