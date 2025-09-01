import { useState, useRef, useEffect } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from '@/components/theme-provider'

export function ModeToggle() {
  const { setTheme, theme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleDropdown = () => setIsOpen(!isOpen)

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setTheme(theme)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={toggleDropdown} className="p-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground" aria-label="Toggle theme">
        <div className="relative w-[1.2rem] h-[1.2rem]">
          <Sun className="h-full w-full rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 absolute top-0 left-0" />
          <Moon className="h-full w-full rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 absolute top-0 left-0" />
        </div>
        <span className="sr-only">{__('Toggle theme', 'wpstorm-clean-admin')}</span>
      </button>
      {isOpen && (
        <div className="absolute left-0 mt-2 w-36 rounded-md shadow-lg bg-popover text-popover-foreground z-50">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <button onClick={() => handleThemeChange('light')} className={`flex justify-between w-full text-right px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground ${theme === 'light' ? 'bg-accent text-green-600' : ''}`} role="menuitem">
              {__('Light', 'wpstorm-clean-admin')}
              <Sun className="h-4 w-4" />
            </button>
            <button onClick={() => handleThemeChange('dark')} className={`flex justify-between w-full text-right px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground ${theme === 'dark' ? 'bg-accent text-green-600' : ''}`} role="menuitem">
              {__('Dark', 'wpstorm-clean-admin')}
              <Moon className="h-4 w-4" />
            </button>
            <button onClick={() => handleThemeChange('system')} className={`flex justify-between w-full text-right px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground ${theme === 'system' ? 'bg-accent text-green-600' : ''}`} role="menuitem">
              {__('System', 'wpstorm-clean-admin')}
              <Monitor className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
