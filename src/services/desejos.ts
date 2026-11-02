import { api } from './http'
import type { Desejo, ListaDesejosResposta } from '../types'

export async function listarDesejos(userId: number): Promise<Desejo[]> {
  const { data } = await api.get<ListaDesejosResposta>(`/todos/user/${userId}`)
  return data.todos
}

export async function criarDesejo(todo: string, userId: number): Promise<Desejo> {
  const { data } = await api.post<Desejo>('/todos/add', {
    todo,
    completed: false,
    userId,
  })
  return data
}

export async function atualizarDesejo(
  id: number,
  campos: Partial<Pick<Desejo, 'todo' | 'completed'>>,
): Promise<Desejo> {
  const { data } = await api.patch<Desejo>(`/todos/${id}`, campos)
  return data
}

export async function excluirDesejo(id: number): Promise<void> {
  await api.delete(`/todos/${id}`)
}
