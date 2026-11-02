import { createContext } from 'react'
import type { Destino } from '../pages/Destinos'

export type DesejosContextValue = {
  favoritos: Destino[]
  alternar: (destino: Destino) => void
}

export const DesejosContext = createContext<DesejosContextValue | null>(null)
