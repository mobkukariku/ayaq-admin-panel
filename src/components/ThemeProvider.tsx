import { type ReactNode } from 'react'
import { ThemeContext } from '../hooks/useThemeContext'
import { useTheme } from '../hooks/useTheme'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useTheme()
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}
