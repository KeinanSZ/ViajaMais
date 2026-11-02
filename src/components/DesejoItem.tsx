import type { Desejo } from '../types'

type Props = {
  desejo: Desejo
  ocupado: boolean
  aoAlternar: (desejo: Desejo) => void
  aoExcluir: (desejo: Desejo) => void
}

export default function DesejoItem({ desejo, ocupado, aoAlternar, aoExcluir }: Props) {
  return (
    <li className={desejo.completed ? 'desejo-item desejo-item--feito' : 'desejo-item'}>
      <label className="desejo-item__texto">
        <input
          type="checkbox"
          checked={desejo.completed}
          disabled={ocupado}
          onChange={() => aoAlternar(desejo)}
          aria-label={`Marcar ${desejo.todo} como ${desejo.completed ? 'não realizado' : 'realizado'}`}
        />
        <span>{desejo.todo}</span>
      </label>
      <div className="desejo-item__acoes">
        <span className="desejo-item__estado">{desejo.completed ? 'Realizado' : 'Pendente'}</span>
        <button
          type="button"
          className="botao-remover-desejo"
          disabled={ocupado}
          onClick={() => aoExcluir(desejo)}
          aria-label={`Excluir ${desejo.todo}`}
        >
          {ocupado ? 'Aguarde…' : 'Excluir'}
        </button>
      </div>
    </li>
  )
}
