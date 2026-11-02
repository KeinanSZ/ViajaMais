import axios from 'axios'

const TOKEN_KEY = 'flynow.token'
let aoExpirar: (() => void) | null = null

export function registrarAoExpirar(callback: (() => void) | null) {
  aoExpirar = callback
}

export const wiki = axios.create({
  baseURL: import.meta.env.VITE_WIKI_URL ?? 'https://en.wikipedia.org/api/rest_v1',
  timeout: 10000,
})

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'https://dummyjson.com',
  timeout: 10000,
})

// O token é anexado em um único lugar, evitando repetir o header em cada service.
api.interceptors.request.use((config) => {
  const url = String(config.url ?? '')
  const ehLogin = url.includes('/auth/login')
  const token = localStorage.getItem(TOKEN_KEY)

  if (token && !ehLogin) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// Um 401 em uma rota protegida encerra a sessão. O 401 do próprio login
// é ignorado porque nesse caso significa, normalmente, credenciais inválidas.
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const ehLogin = String(error.config?.url ?? '').includes('/auth/login')
      if (error.response?.status === 401 && !ehLogin) {
        aoExpirar?.()
      }
    }

    return Promise.reject(error)
  },
)
