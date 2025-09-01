import { z } from 'zod'
import type { FieldConfig } from './types'
import type { FieldValues } from 'react-hook-form'

export function buildZodSchema<TFormValues extends FieldValues>(fields: FieldConfig<TFormValues>[]) {
  const schemaObject: Record<string, any> = {}

  // Helper function to process fields recursively
  function processFields(fieldsToProcess: FieldConfig<TFormValues>[]) {
    for (const field of fieldsToProcess) {
      // Skip section type as it's just a container
      if (field.type === 'section') {
        processFields(field.fields)
        continue
      }

      let fieldSchema: z.ZodTypeAny

      // Create base schema based on field type
      switch (field.type) {
        case 'hidden':
          fieldSchema = z.any().optional()
          break
        case 'text':
          fieldSchema = z.string()
          break
        case 'text-addon':
          fieldSchema = z.object({ value: z.string(), addon: z.string() })
          break
        case 'phone_number':
          fieldSchema = z.string().regex(/^(?:\+98|0)?9\d{9}$/, {
            message: 'Invalid phone number format.'
          })
          break
        case 'phone':
          fieldSchema = z.array(z.string())
          break
        case 'email':
          fieldSchema = z.string().email()
          break
        case 'password':
          fieldSchema = z.string().min(1)
          break
        case 'number':
          fieldSchema = z.number()
          if (field.min !== undefined) fieldSchema = fieldSchema.min(field.min)
          if (field.max !== undefined) fieldSchema = fieldSchema.max(field.max)
          break
        case 'textarea':
          fieldSchema = z.string()
          break
        // case 'select':
        // fieldSchema = z
        //   .union([
        //     z.string(),
        //     z.object({
        //       label: z.string(),
        //       value: z.string(),
        //       status: z.string().optional(),
        //       body: z.string().optional(),
        //       fields: z.any().optional()
        //     }),
        //     z.array(
        //       z.object({
        //         label: z.string(),
        //         value: z.string(),
        //         status: z.string().optional(),
        //         body: z.string().optional(),
        //         fields: z.any().optional()
        //       })
        //     )
        //   ])
        //   .nullable()
        //   .optional()
        // break
        case 'switch':
        case 'checkbox':
          fieldSchema = z.boolean().default(false)
          break
        case 'radio':
          fieldSchema = z.enum(field.options.map((o) => o.value) as [string, ...string[]])
          break
        case 'checkbox-group':
          fieldSchema = z.array(z.string()).default([])
          break
        case 'date':
          fieldSchema = z.date().optional()
          break
        case 'time':
          fieldSchema = z.string().optional()
          break
        default:
          fieldSchema = z.any()
      }

      // Apply required validation if specified
      if (field.required) {
        if (field.type === 'checkbox-group') {
          fieldSchema = fieldSchema.min(1, { message: 'At least one option must be selected' })
        } else if (field.type === 'text' || field.type === 'email' || field.type === 'password' || field.type === 'textarea') {
          fieldSchema = fieldSchema.min(1, { message: 'This field is required' })
        }
      } else {
        // Make field optional if not required
        if (field.type !== 'switch' && field.type !== 'checkbox' && field.type !== 'checkbox-group') {
          fieldSchema = fieldSchema.optional()
        }
      }

      // Apply custom validation if provided
      if (field.validation) {
        fieldSchema = field.validation(fieldSchema)
      }

      // Add to schema object
      schemaObject[field.name as string] = fieldSchema
    }
  }

  // Process all fields
  processFields(fields)

  // Create and return the Zod schema
  return z.object(schemaObject)
}
