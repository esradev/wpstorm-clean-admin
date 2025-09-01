import React, { ReactNode } from 'react'
import { useEffect, useState } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { TextareaPatternFieldConfig } from '../types'
import type { Variable } from '../types'
import { FormControl, FormDescription, FormLabel, FormMessage } from '@/components/ui/form'

interface Placeholder {
  value: string
  label: string
}

interface TextareaPatternProps {
  field: TextareaPatternFieldConfig<any>
  formField: {
    value: Record<string, Placeholder>
    onChange: (value: Record<string, Placeholder>) => void
  }
  values: any
}

export function TextareaPattern({ field, formField, values }: TextareaPatternProps) {
  const [text, setText] = useState('')
  const [placeholders, setPlaceholders] = useState<Record<string, Placeholder>>({})
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0)

  useEffect(() => {
    const fetchedText = typeof field.body === 'function' ? field.body(values) : field.body || ''

    setText(fetchedText)

    const regex = /\{(\d+)\}/g
    let match
    const initialPlaceholders: Record<string, Placeholder> = {}
    const fetchedPlaceholders = formField.value || {}

    while ((match = regex.exec(fetchedText)) !== null) {
      const placeholderIndex = match[1]
      initialPlaceholders[placeholderIndex] = {
        value: fetchedPlaceholders[placeholderIndex]?.value || `{${placeholderIndex}}`,
        label: fetchedPlaceholders[placeholderIndex]?.label || `{${placeholderIndex}}`
      }
    }

    setPlaceholders(initialPlaceholders)

    return () => {
      setText('')
      setPlaceholders({})
    }
  }, [field.body, formField.value, values])

  const handleRemovePlaceholder = (index: string) => {
    setPlaceholders((prev) => ({
      ...prev,
      [index]: {
        value: `{${index}}`,
        label: `{${index}}`
      }
    }))
    setCurrentPlaceholderIndex(parseInt(index, 10))
  }

  const onAddVariable = (variable: Variable) => {
    if (variable && currentPlaceholderIndex !== null) {
      const newPlaceholders = {
        ...placeholders,
        [currentPlaceholderIndex]: {
          value: variable.value,
          label: variable.label
        }
      }
      setPlaceholders(newPlaceholders)
      formField.onChange(newPlaceholders)
      setCurrentPlaceholderIndex((prev) => {
        if (prev < Object.keys(placeholders).length - 1) {
          return prev + 1
        }
        return 0
      })
    }
  }

  const renderText = () => {
    const regex = /\{(\d+)\}/g
    let parts: ReactNode[] = []
    let lastIndex = 0
    let match

    while ((match = regex.exec(text)) !== null) {
      parts.push(text.substring(lastIndex, match.index))
      const placeholderIndex = match[1]

      const isSelected = placeholders[placeholderIndex]?.value !== `{${placeholderIndex}}`
      const isCurrent = currentPlaceholderIndex === parseInt(placeholderIndex, 10)

      parts.push(
        <span key={placeholderIndex} onClick={() => handleRemovePlaceholder(placeholderIndex)} className={`relative inline-block px-2 py-1 mx-1 border rounded-md ${isSelected ? 'bg-primary/20' : 'bg-muted'} ${isCurrent && !isSelected ? 'animate-pulse' : 'cursor-pointer hover:bg-muted/80'}`}>
          <span className="inline-block">{placeholders[placeholderIndex]?.label}</span>
          {isSelected && (
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 ml-1"
              onClick={(e) => {
                e.stopPropagation()
                handleRemovePlaceholder(placeholderIndex)
              }}>
              <X className="h-3 w-3" />
            </Button>
          )}
        </span>
      )
      lastIndex = regex.lastIndex
    }
    parts.push(text.substring(lastIndex))
    return parts
  }

  if (!field.body) return null

  return (
    <>
      <FormLabel htmlFor={field.name}>{field.label}</FormLabel>
      <FormControl>
        <Card>
          <CardContent className="p-4">
            <div>
              {renderText().map((part, index) => (
                <React.Fragment key={index}>{part}</React.Fragment>
              ))}
            </div>
          </CardContent>
        </Card>
      </FormControl>

      {field.variables && (
        <div className="space-y-2">
          <Label>{__('Variables:', 'wpstorm-clean-admin')}</Label>
          <div className="flex flex-wrap gap-2">
            {(typeof field.variables === 'function'
              ? field.variables(values)
              : field.variables
            )?.map((variable) => (
              <Button key={variable.value} type="button" variant="outline" size="sm" onClick={() => onAddVariable(variable)}>
                {variable.label}
              </Button>
            ))}
          </div>
        </div>
      )}
      {field.description && <FormDescription>{field.description}</FormDescription>}
      <FormMessage />
    </>
  )
}
