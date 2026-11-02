export type Desejo = {
  id: number
  todo: string
  completed: boolean
  userId: number
}

export type ListaDesejosResposta = {
  todos: Desejo[]
  total: number
  skip: number
  limit: number
}
