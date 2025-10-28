import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { ControllerRenderProps } from 'react-hook-form';
import { PlusCircle, X } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PhoneFieldConfig } from '../types';
import {
  FormControl,
  FormDescription,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface PhonesListProps {
  numbers: string[];
  onRemove: (index: number) => void;
}

function PhonesList({ numbers, onRemove }: PhonesListProps) {
  return numbers.map((number, index) => (
    <div
      key={index}
      className="flex items-center justify-between bg-muted px-3 py-2 rounded-md"
    >
      <span className="text-sm">{number}</span>
      <Button
        type="button"
        onClick={() => onRemove(index)}
        variant="ghost"
        size="icon"
        className="h-6 w-6"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  ));
}

interface PhoneInputProps {
  field: PhoneFieldConfig<any>;
  formField: ControllerRenderProps<any, string>;
}

export function PhoneInput({ field, formField }: PhoneInputProps) {
  const [newNumber, setNewNumber] = useState('');
  const [error, setError] = useState('');

  const value: string[] = Array.isArray(formField.value) ? formField.value : [];

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewNumber(value);
    setError('');

    const regex = /^09\d{9}$/;
    if (value && !regex.test(value)) {
      setError(__('Invalid phone number format.', 'storm-clean-admin'));
    }
  };

  const addNumber = () => {
    if (newNumber && !error) {
      if (value.includes(newNumber)) {
        setError(__('Phone number already exists', 'storm-clean-admin'));
        return;
      }

      formField.onChange([...value, newNumber]);
      setNewNumber('');
    }
  };

  const removeNumber = (index: number) => {
    const updatedNumbers = [...value];
    updatedNumbers.splice(index, 1);
    formField.onChange(updatedNumbers);
  };

  return (
    <>
      <FormLabel>{field.label}</FormLabel>
      <div className="flex items-center gap-2">
        <FormControl>
          <Input
            id={field.name}
            placeholder={field.placeholder}
            value={newNumber}
            onChange={handleNumberChange}
            className="text-right dark:border-gray-300"
          />
        </FormControl>
        <Button
          type="button"
          onClick={addNumber}
          disabled={!newNumber || !!error}
          variant="outline"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          {__('Add Number', 'storm-clean-admin')}
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {field.helpText && (
        <p className="text-sm text-muted-foreground">{field.helpText}</p>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <PhonesList numbers={value} onRemove={removeNumber} />
      </div>
      {field.description && (
        <FormDescription>{field.description}</FormDescription>
      )}
      <FormMessage />
    </>
  );
}
