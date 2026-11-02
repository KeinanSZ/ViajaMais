import { api } from './http'

export type Usuario = {
  id: number
  username: string
  firstName: string
  lastName: string
  email: string
}

type LoginResposta = Usuario & {
  accessToken: string
  refreshToken: string
}

export async function login(username: string, password: string) {
  const { data } = await api.post<LoginResposta>('/auth/login', {
    username,
    password,
    expiresInMins: 30,
  })

  return data
}

export async function me(token: string) {
  const { data } = await api.get<Usuario>('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  })

  return data
}
