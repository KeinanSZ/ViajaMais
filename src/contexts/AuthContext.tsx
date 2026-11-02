import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { AuthContext } from './authContextValue'
import { login as loginApi, me, type Usuario } from '../services/auth'
import { registrarAoExpirar } from '../services/http'

const TOKEN_KEY = 'flynow.token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [carregando, setCarregando] = useState(() => localStorage.getItem(TOKEN_KEY) !== null)

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUsuario(null)
    setCarregando(false)
  }, [])

  useEffect(() => {
    let ativo = true
    registrarAoExpirar(logout)

    const tokenSalvo = localStorage.getItem(TOKEN_KEY)
    if (!tokenSalvo) {
      return () => {
        ativo = false
        registrarAoExpirar(null)
      }
    }

    me(tokenSalvo)
      .then((dados) => {
        if (ativo) setUsuario(dados)
      })
      .catch(() => {
        // Sem uma sessão validada não liberamos as rotas protegidas.
        if (ativo) logout()
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
      registrarAoExpirar(null)
    }
  }, [logout])

  const login = async (username: string, password: string) => {
    const { accessToken, ...dados } = await loginApi(username, password)
    localStorage.setItem(TOKEN_KEY, accessToken)
    setToken(accessToken)
    setUsuario(dados)
  }

  return (
    <AuthContext.Provider value={{ usuario, token, carregando, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
