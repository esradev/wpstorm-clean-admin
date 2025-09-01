export interface Route {
  title?: string
  url?: string
  restRoute?: string
  isVisiable?: boolean
  component?: React.ComponentType
  icon?: React.ComponentType
  infoDetails?: string
  infoLink?: {
    url: string
    title: string
  }
  linkTo?: string
  linkText?: string
  linkIcon?: React.ComponentType
}

export interface Dispatch {
  (action: { type: string; payload: any }): void
}

export interface Variable {
  label: string
  value: string
}

export interface InputProps {
  name: string
  label: string
  type: string
  value: string
  onChange: string
  rules?: string
  placeholder?: string
  required?: boolean
  desc?: string
  hasError?: boolean
  errorMessage?: string
  variables?: Variable[]
}
