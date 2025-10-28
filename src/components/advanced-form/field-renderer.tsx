import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { format } from 'date-fns';
import { CalendarIcon, ExternalLink, Settings } from 'lucide-react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

import type { FieldConfig } from './types';
import { PhoneInput } from './fields/phone-input';
import { SelectInput } from './fields/select-input';
import { TextareaPattern } from './fields/textarea-pattern-input';
import { TextareaInput } from './fields/textarea-input';
import { Link } from 'react-router-dom';
import TextWithAddon from '@/components/advanced-form/fields/text-with-addon';

interface FieldRendererProps<TFormValues extends FieldValues> {
  field: FieldConfig<TFormValues>;
  form: UseFormReturn<TFormValues>;
}

export function FieldRenderer<TFormValues extends FieldValues>({
  field,
  form,
}: FieldRendererProps<TFormValues>) {
  const [isOpenState, setIsOpenState] = useState({
    [field.name]: !field.defaultCollapsed,
  });

  const isOpen = isOpenState[field.name] ?? !field.defaultCollapsed;

  // Handle conditional visibility
  if (field.hidden) {
    const isHidden =
      typeof field.hidden === 'function'
        ? field.hidden(form.getValues())
        : field.hidden;
    if (isHidden) return null;
  }

  // Handle conditional disabling
  const isDisabled = field.disabled
    ? typeof field.disabled === 'function'
      ? field.disabled(form.getValues())
      : field.disabled
    : false;

  // Handle width classes
  let widthClass = 'col-span-12'; // Default to full width
  if (field.width) {
    if (field.width === 'half') widthClass = 'col-span-12 md:col-span-6';
    else if (field.width === 'third') widthClass = 'col-span-12 md:col-span-4';
    else if (typeof field.width === 'number')
      widthClass = `col-span-12 md:col-span-${field.width}`;
  }

  // Section type has special rendering
  if (field.type === 'section') {
    const setIsOpen = (open: boolean) => {
      setIsOpenState((prevState) => ({
        ...prevState,
        [field.name]: open,
      }));
    };

    return (
      <div className={cn('col-span-12', field.className)}>
        {field.collapsible ? (
          <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="space-y-2 border shadow-sm rounded-md p-2"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium font-sans text-foreground">
                {field.title}
              </h3>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm" className="w-9 p-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={cn(
                      'h-4 w-4 transition-transform',
                      isOpen ? 'rotate-180' : '',
                    )}
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m6 9 6 6 6-6"
                    />
                  </svg>
                  <span className="sr-only">
                    {__('Toggle', 'storm-clean-admin')}
                  </span>
                </Button>
              </CollapsibleTrigger>
            </div>
            {field.description && (
              <p className="text-sm text-muted-foreground">
                {field.description}
              </p>
            )}
            <CollapsibleContent className="space-y-4 p-4 mr-2 mt-2 ">
              <div className="grid grid-cols-12 gap-4">
                {field.fields.map((nestedField, index) => (
                  <FieldRenderer
                    key={`${nestedField.name}-${index}`}
                    field={nestedField}
                    form={form}
                  />
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">{field.title}</h3>
              {field.description && (
                <p className="text-sm text-muted-foreground">
                  {field.description}
                </p>
              )}
            </div>
            <div className="grid grid-cols-12 gap-4">
              {field.fields.map((nestedField, index) => (
                <FieldRenderer
                  key={`${nestedField.name}-${index}`}
                  field={nestedField}
                  form={form}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <FormField
      control={form.control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem className={widthClass}>
          {/* Render different field types */}
          {(() => {
            switch (field.type) {
              case 'text':
              case 'email':
              case 'password':
                return (
                  <>
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                      <Input
                        type={field.type}
                        placeholder={field.placeholder}
                        {...formField}
                        disabled={isDisabled}
                      />
                    </FormControl>
                    {field.description && (
                      <FormDescription>{field.description}</FormDescription>
                    )}
                    <FormMessage />
                  </>
                );
              case 'phone_number':
                return (
                  <>
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={field.placeholder}
                        {...formField}
                        disabled={isDisabled}
                      />
                    </FormControl>
                    {field.description && (
                      <FormDescription>{field.description}</FormDescription>
                    )}
                    <FormMessage />
                  </>
                );

              case 'phone':
                return <PhoneInput field={field} formField={formField} />;

              case 'number':
                return (
                  <>
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={field.placeholder}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        {...formField}
                        onChange={(e) =>
                          formField.onChange(Number.parseFloat(e.target.value))
                        }
                        disabled={isDisabled}
                      />
                    </FormControl>
                    {field.description && (
                      <FormDescription>{field.description}</FormDescription>
                    )}
                    <FormMessage />
                  </>
                );

              case 'textarea':
                return (
                  <TextareaInput
                    field={field}
                    formField={formField}
                    isDisabled={isDisabled}
                  />
                );

              case 'textarea-pattern':
                return (
                  <TextareaPattern
                    field={field}
                    formField={formField}
                    values={form.getValues()}
                  />
                );

              case 'text-addon':
                return (
                  <TextWithAddon
                    input={{
                      name: field.name,
                      label: field.label,
                      placeholder: field.placeholder,
                      required: field.required,
                      desc: field.description,
                      addons: field.addons,
                      value: formField.value,
                      onChange: formField.onChange.name,
                      rules: undefined, // Add validation if needed
                    }}
                    onValueChange={formField.onChange}
                  />
                );

              case 'select':
                return (
                  <SelectInput
                    field={field}
                    formField={formField}
                    isDisabled={isDisabled}
                    values={form.getValues()}
                  />
                );

              case 'switch':
                return field.layout === 'card' ? (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">{field.label}</FormLabel>
                      {field.description && (
                        <FormDescription>{field.description}</FormDescription>
                      )}
                      {formField.value && field?.settingsRoute && (
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Link to={field?.settingsRoute}>
                            <Settings className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      {field?.helpUrl && (
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Link
                            to={field?.helpUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                    <FormControl>
                      <Switch
                        checked={formField.value}
                        onCheckedChange={formField.onChange}
                        disabled={isDisabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <FormLabel>{field.label}</FormLabel>
                      <FormControl>
                        <Switch
                          checked={formField.value}
                          onCheckedChange={formField.onChange}
                          disabled={isDisabled}
                        />
                      </FormControl>
                    </div>
                    {field.description && (
                      <FormDescription>{field.description}</FormDescription>
                    )}
                    <FormMessage />
                  </>
                );

              case 'checkbox':
                return field.layout === 'card' ? (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={formField.value}
                        onCheckedChange={formField.onChange}
                        disabled={isDisabled}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>{field.label}</FormLabel>
                      {field.description && (
                        <FormDescription>{field.description}</FormDescription>
                      )}
                    </div>
                  </FormItem>
                ) : (
                  <div className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={formField.value}
                        onCheckedChange={formField.onChange}
                        disabled={isDisabled}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>{field.label}</FormLabel>
                      {field.description && (
                        <FormDescription>{field.description}</FormDescription>
                      )}
                      <FormMessage />
                    </div>
                  </div>
                );

              case 'radio':
                return (
                  <>
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={formField.onChange}
                        defaultValue={formField.value}
                        className={
                          field.layout === 'horizontal'
                            ? 'flex flex-row space-x-4'
                            : 'flex flex-col space-y-2'
                        }
                        disabled={isDisabled}
                      >
                        {field.options.map((option) => (
                          <FormItem
                            key={option.value}
                            className="flex items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem value={option.value} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {option.label}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    {field.description && (
                      <FormDescription>{field.description}</FormDescription>
                    )}
                    <FormMessage />
                  </>
                );

              case 'checkbox-group':
                return (
                  <>
                    <FormLabel>{field.label}</FormLabel>
                    <div
                      className={
                        field.layout === 'horizontal'
                          ? 'flex flex-row flex-wrap gap-4'
                          : field.layout === 'grid'
                          ? 'grid grid-cols-2 md:grid-cols-3 gap-4'
                          : 'flex flex-col space-y-2'
                      }
                    >
                      {field.options.map((option) => (
                        <FormItem
                          key={option.value}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={formField.value?.includes(option.value)}
                              onCheckedChange={(checked) => {
                                const currentValue = formField.value || [];
                                const newValue = checked
                                  ? [...currentValue, option.value]
                                  : currentValue.filter(
                                      (value: string) => value !== option.value,
                                    );
                                formField.onChange(newValue);
                              }}
                              disabled={isDisabled}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {option.label}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </div>
                    {field.description && (
                      <FormDescription>{field.description}</FormDescription>
                    )}
                    <FormMessage />
                  </>
                );

              case 'date':
                return (
                  <>
                    <FormLabel>{field.label}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !formField.value && 'text-muted-foreground',
                            )}
                            disabled={isDisabled}
                          >
                            {formField.value ? (
                              format(formField.value, 'PPP')
                            ) : (
                              <span>
                                {field.placeholder ||
                                  __('Pick a date', 'storm-clean-admin')}
                              </span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formField.value}
                          onSelect={formField.onChange}
                          initialFocus
                          disabled={isDisabled}
                        />
                      </PopoverContent>
                    </Popover>
                    {field.description && (
                      <FormDescription>{field.description}</FormDescription>
                    )}
                    <FormMessage />
                  </>
                );

              case 'time':
                return (
                  <>
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        placeholder={field.placeholder}
                        {...formField}
                        disabled={isDisabled}
                      />
                    </FormControl>
                    {field.description && (
                      <FormDescription>{field.description}</FormDescription>
                    )}
                    <FormMessage />
                  </>
                );

              case 'hidden':
                return (
                  <Input type="hidden" {...formField} disabled={isDisabled} />
                );

              default:
                return null;
            }
          })()}
        </FormItem>
      )}
    />
  );
}
