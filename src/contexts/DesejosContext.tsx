import { useState, type ReactNode } from 'react'
import { DesejosContext } from './desejosContextValue'
import type { Destino } from '../pages/Destinos'

export function DesejosProvider({ children }: { children: ReactNode }) {
  const [favoritos, setFavoritos] = useState<Destino[]>([])

  const alternar = (destino: Destino) => {
    setFavoritos((atuais) => atuais.some((item) => item.id === destino.id)
      ? atuais.filter((item) => item.id !== destino.id)
      : [...atuais, destino])
  }

  return <DesejosContext.Provider value={{ favoritos, alternar }}>{children}</DesejosContext.Provider>
}
