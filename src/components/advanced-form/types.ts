import type { ReactNode } from 'react'
import type { z } from 'zod'
import type { FieldPath, FieldValues } from 'react-hook-form'

import { Route } from '@/types'
import { Option } from './fields/select-input'

export interface Variable {
  value: string
  label: string
}

// Base field configuration that applies to all field types
export interface BaseFieldConfig<TFormValues extends FieldValues> {
  name: FieldPath<TFormValues>
  label: string
  description?: string
  width?: 'full' | 'half' | 'third' | number // Width of the field (1-12 grid columns or predefined sizes)
  hidden?: boolean | ((values: TFormValues) => boolean) // Conditionally hide field
  disabled?: boolean | ((values: TFormValues) => boolean) // Conditionally disable field
  body?: string | ((values: TFormValues) => string) // Body text for the field
  required?: boolean
  validation?: any // Additional Zod validation rules
  helpText?: string
  className?: string
  variables?: Variable[] | ((values: TFormValues) => Variable[])
}

// Text input field configuration
export interface TextFieldConfig<TFormValues extends FieldValues> extends BaseFieldConfig<TFormValues> {
  type: 'text'
  placeholder?: string
  prefix?: ReactNode
  suffix?: ReactNode
}

// Text with addon field configuration
export interface TextWithAddonFieldConfig<TFormValues extends FieldValues> extends BaseFieldConfig<TFormValues> {
  type: 'text-addon'
  placeholder?: string
  addons: Array<{ label: string; value: string }>
  value?: { value: string; addon: string }
}

// Phone input field configuration
export interface PhoneFieldConfig<TFormValues extends FieldValues> extends BaseFieldConfig<TFormValues> {
  type: 'phone'
  placeholder?: string
  prefix?: ReactNode
  suffix?: ReactNode
}

// Number input field configuration
export interface NumberFieldConfig<TFormValues extends FieldValues> extends BaseFieldConfig<TFormValues> {
  type: 'number'
  placeholder?: string
  min?: number
  max?: number
  step?: number
  prefix?: ReactNode
  suffix?: ReactNode
}

// Email input field configuration
export interface EmailFieldConfig<TFormValues extends FieldValues> extends BaseFieldConfig<TFormValues> {
  type: 'email'
  placeholder?: string
}

// Password input field configuration
export interface PasswordFieldConfig<TFormValues extends FieldValues> extends BaseFieldConfig<TFormValues> {
  type: 'password'
  placeholder?: string
}

// Textarea field configuration
export interface TextareaFieldConfig<TFormValues extends FieldValues> extends BaseFieldConfig<TFormValues> {
  type: 'textarea'
  placeholder?: string
  rows?: number
}

// Textarea pattern field configuration
export interface TextareaPatternFieldConfig<TFormValues extends FieldValues> extends BaseFieldConfig<TFormValues> {
  type: 'textarea-pattern'
  placeholder?: string
  rows?: number
  body?: string | ((values: TFormValues) => string)
}

// Select field configuration
export interface SelectFieldConfig<TFormValues extends FieldValues> extends BaseFieldConfig<TFormValues> {
  type: 'select'
  placeholder?: string
  options: Option[] | ((values: any) => Option[])
  isMulti?: boolean
  customLabel?: boolean
  isLoading?: boolean
}

// Switch field configuration
export interface SwitchFieldConfig<TFormValues extends FieldValues> extends BaseFieldConfig<TFormValues> {
  type: 'switch'
  layout?: 'default' | 'card' // default is regular layout, card is the card-style layout
  pluginPath?: string
  settingsRoute?: string
  helpUrl?: string
}

// Checkbox field configuration
export interface CheckboxFieldConfig<TFormValues extends FieldValues> extends BaseFieldConfig<TFormValues> {
  type: 'checkbox'
  layout?: 'default' | 'card' // default is regular layout, card is the card-style layout
}

// Radio group field configuration
export interface RadioGroupFieldConfig<TFormValues extends FieldValues> extends BaseFieldConfig<TFormValues> {
  type: 'radio'
  options: Array<{ label: string; value: string }>
  layout?: 'horizontal' | 'vertical' // default is vertical
}

// Checkbox group field configuration
export interface CheckboxGroupFieldConfig<TFormValues extends FieldValues> extends BaseFieldConfig<TFormValues> {
  type: 'checkbox-group'
  options: Array<{ label: string; value: string }>
  layout?: 'horizontal' | 'vertical' | 'grid' // default is vertical
}

// Date picker field configuration
export interface DateFieldConfig<TFormValues extends FieldValues> extends BaseFieldConfig<TFormValues> {
  type: 'date'
  placeholder?: string
}

// Time picker field configuration
export interface TimeFieldConfig<TFormValues extends FieldValues> extends BaseFieldConfig<TFormValues> {
  type: 'time'
  placeholder?: string
}

// Hidden field configuration (for hidden inputs)
export interface HiddenFieldConfig<TFormValues extends FieldValues> extends BaseFieldConfig<TFormValues> {
  type: 'hidden'
}

// Section divider configuration
export interface SectionConfig<TFormValues extends FieldValues> extends BaseFieldConfig<TFormValues> {
  type: 'section'
  title: string
  description?: string
  collapsible?: boolean
  defaultCollapsed?: boolean
  fields: FieldConfig<TFormValues>[]
}

export interface PhoneNumberConfig<TFormValues extends FieldValues> extends BaseFieldConfig<TFormValues> {
  type: 'phone_number'
  placeholder?: string
  prefix?: ReactNode
  suffix?: ReactNode
}

// Union type of all field configurations
export type FieldConfig<TFormValues extends FieldValues> = TextFieldConfig<TFormValues> | PhoneFieldConfig<TFormValues> | NumberFieldConfig<TFormValues> | EmailFieldConfig<TFormValues> | PasswordFieldConfig<TFormValues> | TextareaFieldConfig<TFormValues> | TextareaPatternFieldConfig<TFormValues> | SelectFieldConfig<TFormValues> | SwitchFieldConfig<TFormValues> | CheckboxFieldConfig<TFormValues> | RadioGroupFieldConfig<TFormValues> | CheckboxGroupFieldConfig<TFormValues> | DateFieldConfig<TFormValues> | TimeFieldConfig<TFormValues> | SectionConfig<TFormValues> | HiddenFieldConfig<TFormValues> | TextWithAddonFieldConfig<TFormValues> | PhoneNumberConfig<TFormValues>

// Form configuration
export interface FormConfig<TFormValues extends FieldValues> {
  fields: FieldConfig<TFormValues>[]
  defaultValues: Partial<TFormValues>
  schema?: z.ZodType<any, any>
  successMessage?: string
  successDescription?: string
  submitButtonText?: string
  resetButtonText?: string
  hideResetButton?: boolean
  className?: string
  renderButtons?: (values: TFormValues, reset: () => void) => ReactNode
  isFetching?: boolean
  restRoute?: string
  route?: Route
  children?: ReactNode
  hasAccess?: boolean
}
