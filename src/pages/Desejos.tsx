import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'
import { useDesejos } from '../contexts/useDesejos'
import DesejoItem from '../components/DesejoItem'
import { atualizarDesejo, criarDesejo, excluirDesejo, listarDesejos } from '../services/desejos'
import { mensagemDeErro } from '../utils/erros'
import type { Desejo } from '../types'

function Desejos() {
  const { usuario } = useAuth()
  const { favoritos, alternar } = useDesejos()
  const userId = usuario?.id

  const [desejos, setDesejos] = useState<Desejo[]>([])
  const [loading, setLoading] = useState(true)
  const [erroLista, setErroLista] = useState<string | null>(null)
  const [texto, setTexto] = useState('')
  const [erroForm, setErroForm] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [ocupado, setOcupado] = useState<number | null>(null)
  const [erroAcao, setErroAcao] = useState<string | null>(null)
  const [repetirForm, setRepetirForm] = useState<(() => void) | null>(null)
  const [repetirAcao, setRepetirAcao] = useState<(() => void) | null>(null)
  const [busca, setBusca] = useState('')
  const idsLocais = useRef(new Set<number>())

  const carregar = useCallback(async () => {
    if (userId === undefined) return

    try {
      const dados = await listarDesejos(userId)
      setDesejos((atuais) => {
        const criadosNestaSessao = atuais.filter((item) => idsLocais.current.has(item.id))
        return [...dados, ...criadosNestaSessao]
      })
      setErroLista(null)
    } catch (error) {
      setErroLista(mensagemDeErro(error))
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    void carregar()
  }, [carregar])

  function tentarCarregar() {
    setLoading(true)
    setErroLista(null)
    void carregar()
  }

  async function salvarDesejo(valor: string) {
    if (userId === undefined) return

    setEnviando(true)
    setErroForm(null)
    setRepetirForm(null)

    try {
      const novo = await criarDesejo(valor, userId)
      // O DummyJSON simula o POST: o item existe no estado local, mas não no servidor.
      // Guardamos o id para não enviar PATCH/DELETE de um item que a API não conhece.
      idsLocais.current.add(novo.id)
      setErroLista(null)
      setDesejos((lista) => [...lista, novo])
      setTexto('')
    } catch (error) {
      setErroForm(mensagemDeErro(error))
      setRepetirForm(() => () => { void salvarDesejo(valor) })
    } finally {
      setEnviando(false)
    }
  }

  function aoEnviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const limpo = texto.trim()

    if (limpo.length < 3) {
      setErroForm('Escreva pelo menos 3 caracteres.')
      setRepetirForm(null)
      return
    }
    if (limpo.length > 80) {
      setErroForm('O desejo deve ter no máximo 80 caracteres.')
      setRepetirForm(null)
      return
    }
    if (userId === undefined) {
      setErroForm('Não foi possível identificar sua conta. Entre novamente.')
      return
    }

    void salvarDesejo(limpo)
  }

  async function alternarConcluido(desejo: Desejo) {
    setErroAcao(null)
    setRepetirAcao(null)
    setOcupado(desejo.id)
    const completed = !desejo.completed

    try {
      if (!idsLocais.current.has(desejo.id)) {
        await atualizarDesejo(desejo.id, { completed })
      }

      setDesejos((lista) => lista.map((item) =>
        item.id === desejo.id ? { ...item, completed } : item,
      ))
    } catch (error) {
      setErroAcao(mensagemDeErro(error))
      setRepetirAcao(() => () => { void alternarConcluido(desejo) })
    } finally {
      setOcupado(null)
    }
  }

  async function removerDesejo(desejo: Desejo, confirmar = true) {
    if (confirmar && !window.confirm(`Excluir “${desejo.todo}” da sua lista?`)) return

    setErroAcao(null)
    setRepetirAcao(null)
    setOcupado(desejo.id)

    try {
      if (!idsLocais.current.has(desejo.id)) {
        await excluirDesejo(desejo.id)
      } else {
        idsLocais.current.delete(desejo.id)
      }

      setDesejos((lista) => lista.filter((item) => item.id !== desejo.id))
    } catch (error) {
      setErroAcao(mensagemDeErro(error))
      setRepetirAcao(() => () => { void removerDesejo(desejo, false) })
    } finally {
      setOcupado(null)
    }
  }

  const termo = busca.trim().toLocaleLowerCase('pt-BR')
  const desejosFiltrados = desejos.filter((desejo) =>
    desejo.todo.toLocaleLowerCase('pt-BR').includes(termo),
  )

  return (
    <main className="conteudo conteudo--desejos">
      <section className="painel painel--lista desejos-crud" aria-labelledby="titulo-desejos">
        <div className="desejos-cabecalho">
          <div>
            <p className="desejos-eyebrow">Sua próxima aventura começa aqui</p>
            <h1 id="titulo-desejos">Meus desejos de viagem</h1>
            <p className="desejos-descricao">
              Organize lugares que quer conhecer e marque cada experiência quando ela acontecer.
            </p>
          </div>
          <span className="desejos-contador">{desejos.length} {desejos.length === 1 ? 'desejo' : 'desejos'}</span>
        </div>

        <form className="form-desejo" onSubmit={aoEnviar} noValidate>
          <label htmlFor="novo-desejo">Adicionar um novo desejo</label>
          <div className="form-desejo__linha">
            <input
              id="novo-desejo"
              type="text"
              value={texto}
              onChange={(event) => {
                setTexto(event.target.value)
                if (erroForm) setErroForm(null)
                if (repetirForm) setRepetirForm(null)
              }}
              minLength={3}
              maxLength={80}
              placeholder="Ex.: Conhecer Lisboa"
              disabled={enviando}
              aria-invalid={erroForm !== null}
              aria-describedby={erroForm ? 'erro-form-desejo' : 'ajuda-form-desejo'}
            />
            <button type="submit" disabled={enviando}>
              {enviando ? 'Salvando…' : 'Adicionar desejo'}
            </button>
          </div>
          <small id="ajuda-form-desejo">De 3 a 80 caracteres. Use um desejo por vez.</small>
          {erroForm && (
            <div className="desejos-mensagem desejos-mensagem--erro">
              <p id="erro-form-desejo" role="alert">{erroForm}</p>
              {repetirForm && <button type="button" onClick={() => repetirForm()}>Tentar novamente</button>}
            </div>
          )}
        </form>

        <div className="desejos-lista-cabecalho">
          <div>
            <h2>Lista de desejos</h2>
            <p>Marque os lugares que você já visitou.</p>
          </div>
          <label className="desejos-busca" htmlFor="buscar-desejo">
            <span>Buscar</span>
            <input
              id="buscar-desejo"
              type="search"
              placeholder="Filtrar desejos…"
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
            />
          </label>
        </div>

        {loading ? (
          <p className="desejos-estado" role="status" aria-live="polite">Carregando seus desejos…</p>
        ) : erroLista ? (
          <div className="desejos-mensagem desejos-mensagem--erro">
            <p role="alert">{erroLista}</p>
            <button type="button" onClick={tentarCarregar}>Tentar novamente</button>
          </div>
        ) : desejos.length === 0 ? (
          <div className="desejos-estado desejos-estado--vazio">
            <span aria-hidden="true">✈</span>
            <h3>Nenhum desejo por enquanto</h3>
            <p>Adicione o primeiro lugar que você quer conhecer.</p>
          </div>
        ) : desejosFiltrados.length === 0 ? (
          <p className="desejos-estado">Nenhum desejo corresponde à busca “{busca}”.</p>
        ) : (
          <ul className="desejos-lista">
            {desejosFiltrados.map((desejo) => (
              <DesejoItem
                key={desejo.id}
                desejo={desejo}
                ocupado={ocupado === desejo.id}
                aoAlternar={alternarConcluido}
                aoExcluir={removerDesejo}
              />
            ))}
          </ul>
        )}

        {erroAcao && (
          <div className="desejos-mensagem desejos-mensagem--erro">
            <p role="alert">{erroAcao}</p>
            {repetirAcao && <button type="button" onClick={() => repetirAcao()}>Tentar novamente</button>}
          </div>
        )}

        <p className="nota-demonstracao">
          A API DummyJSON simula as operações de escrita. Os itens criados nesta sessão são mantidos no estado local e podem desaparecer após atualizar a página.
        </p>
      </section>

      {favoritos.length > 0 && (
        <section className="painel painel--lista desejos-salvos" aria-labelledby="titulo-destinos-salvos">
          <div className="painel__header">
            <div>
              <h2 id="titulo-destinos-salvos">Destinos salvos</h2>
              <p>Favoritos selecionados na página de destinos.</p>
            </div>
            <span>{favoritos.length}</span>
          </div>
          <ul className="lista-destinos">
            {favoritos.map((destino) => (
              <li key={destino.id} className="card">
                {destino.imagem && (
                  <div className="card__imagem-wrap">
                    <img
                      src={destino.imagem}
                      alt={`Paisagem de ${destino.nome}`}
                      className="card__imagem"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="card__conteudo">
                  <h3>{destino.nome}</h3>
                  <p>{destino.descricao}</p>
                  <strong>{destino.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                  <p><button type="button" className="botao-remover-desejo" onClick={() => alternar(destino)}>Remover dos salvos</button></p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="desejos-voltar"><Link to="/">← Explorar destinos</Link></p>
    </main>
  )
}

export default Desejos
