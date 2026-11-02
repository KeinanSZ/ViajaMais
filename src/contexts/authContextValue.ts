import { createContext } from 'react'
import type { Usuario } from '../services/auth'

export type AuthContextValue = {
  usuario: Usuario | null
  token: string | null
  carregando: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
