import { useContext } from 'react'
import { DesejosContext } from './desejosContextValue'

export function useDesejos() {
  const contexto = useContext(DesejosContext)
  if (!contexto) throw new Error('useDesejos precisa estar dentro de DesejosProvider')
  return contexto
}
