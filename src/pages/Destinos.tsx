import { useEffect, useMemo, useRef, useState } from 'react'
import { wiki } from '../services/http'
import { useDesejos } from '../contexts/useDesejos'

export type Destino = {
  id: number
  nome: string
  pais: string
  categoria: string
  descricao: string
  preco: number
  destaque: boolean
  nota: number
  imagem?: string
}

type HeaderProps = {
  titulo: string
  subtitulo: string
  totalDestinos: number
  melhorPreco: string
  filtroAtivo: string
  onFiltroChange: (filtro: string) => void
}

type OfertasViagemProps = {
  onOfertaClick: (destino: string) => void
}

function OfertasViagem({ onOfertaClick }: OfertasViagemProps) {
  const ofertas = [
    {
      destino: 'Maldivas',
      chamada: 'Verão inesquecível',
      detalhe: 'Praia, descanso e águas cristalinas',
      preco: 'A partir de R$ 3.260',
      imagem: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=900&q=85',
    },
    {
      destino: 'Lisboa',
      chamada: 'Descubra Portugal',
      detalhe: 'Cultura, gastronomia e ruas charmosas',
      preco: 'A partir de R$ 1.980',
      imagem: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=900&q=85',
    },
    {
      destino: 'Tóquio',
      chamada: 'Tradição e inovação',
      detalhe: 'Templos, tecnologia e sabores do Japão',
      preco: 'A partir de R$ 2.660',
      imagem: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=85',
    },
  ]

  return (
    <section className="ofertas-viagem" aria-labelledby="titulo-ofertas">
      <div className="ofertas-viagem__header">
        <div>
          <p className="ofertas-viagem__eyebrow">Inspire-se</p>
          <h2 id="titulo-ofertas">Ofertas para viajar</h2>
        </div>
        <span>Selecionadas para você</span>
      </div>

      <div className="ofertas-viagem__lista">
        {ofertas.map((oferta) => (
          <article className="oferta" key={oferta.destino}>
            <img src={oferta.imagem} alt={`Oferta de viagem para ${oferta.destino}`} loading="lazy" />
            <div className="oferta__conteudo">
              <p>{oferta.chamada}</p>
              <h3>{oferta.destino}</h3>
              <span>{oferta.detalhe}</span>
              <strong>{oferta.preco}</strong>
              <a href="#destinos" onClick={() => onOfertaClick(oferta.destino)}>
                Ver oferta
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

type BuscaViagemProps = {
  produtoAtivo: string
  destinoBusca: string
  dataIda: string
  dataVolta: string
  resultadoBusca: string
  onProdutoChange: (produto: string) => void
  onDestinoChange: (destino: string) => void
  onDataIdaChange: (data: string) => void
  onDataVoltaChange: (data: string) => void
  onBuscar: (event: React.FormEvent<HTMLFormElement>) => void
}

function BuscaViagem({
  produtoAtivo,
  destinoBusca,
  dataIda,
  dataVolta,
  resultadoBusca,
  onProdutoChange,
  onDestinoChange,
  onDataIdaChange,
  onDataVoltaChange,
  onBuscar,
}: BuscaViagemProps) {
  const produtos = ['Hospedagens', 'Passagens', 'Pacotes', 'Passeios']
  const detalhesProdutos: Record<string, { texto: string; destino: string; ida: string; volta: string; placeholder: string }> = {
    Hospedagens: {
      texto: 'Encontre hotéis, pousadas e acomodações para sua viagem.',
      destino: 'Destino ou hotel',
      ida: 'Check-in',
      volta: 'Check-out',
      placeholder: 'Ex.: Lisboa ou Hotel Atlântico',
    },
    Passagens: {
      texto: 'Compare opções de voos e encontre o melhor caminho.',
      destino: 'Para onde você vai?',
      ida: 'Ida',
      volta: 'Volta',
      placeholder: 'Ex.: Paris, Recife ou São Paulo',
    },
    Pacotes: {
      texto: 'Combine passagem e hospedagem em uma só oferta.',
      destino: 'Destino do pacote',
      ida: 'Data de ida',
      volta: 'Data de volta',
      placeholder: 'Ex.: Rio de Janeiro ou Maceió',
    },
    Passeios: {
      texto: 'Reserve experiências para aproveitar cada destino.',
      destino: 'Qual destino?',
      ida: 'Data do passeio',
      volta: 'Quantidade de pessoas',
      placeholder: 'Ex.: Tour em Roma ou trilha em Bali',
    },
  }
  const detalheAtual = detalhesProdutos[produtoAtivo]

  return (
    <section className="busca-viagem" aria-labelledby="titulo-busca">
      <div className="busca-viagem__intro">
        <p className="busca-viagem__eyebrow">Planeje sem complicação</p>
        <h2 id="titulo-busca">Para onde você quer viajar?</h2>
        <p>{detalheAtual.texto}</p>
      </div>

      <div className="busca-viagem__abas" role="tablist" aria-label="Tipo de viagem">
        {produtos.map((produto) => (
          <button
            key={produto}
            type="button"
            role="tab"
            aria-selected={produtoAtivo === produto}
            className={produtoAtivo === produto ? 'busca-viagem__aba busca-viagem__aba--ativa' : 'busca-viagem__aba'}
            onClick={() => onProdutoChange(produto)}
          >
            {produto}
          </button>
        ))}
      </div>

      <form className="busca-viagem__form" onSubmit={onBuscar}>
        <label htmlFor="busca-destino">
          <span>{detalheAtual.destino}</span>
          <input
            id="busca-destino"
            type="search"
            placeholder={detalheAtual.placeholder}
            value={destinoBusca}
            onChange={(event) => onDestinoChange(event.target.value)}
          />
        </label>
        <label htmlFor="busca-entrada">
          <span>{detalheAtual.ida}</span>
          <input id="busca-entrada" name="dataIda" type="date" value={dataIda} onChange={(event) => onDataIdaChange(event.target.value)} />
        </label>
        <label htmlFor="busca-volta">
          <span>{detalheAtual.volta}</span>
          <input
            id="busca-volta"
            name="dataVolta"
            type={produtoAtivo === 'Passeios' ? 'number' : 'date'}
            min={produtoAtivo === 'Passeios' ? 1 : undefined}
            placeholder={produtoAtivo === 'Passeios' ? '2' : undefined}
            value={dataVolta}
            onChange={(event) => onDataVoltaChange(event.target.value)}
          />
        </label>
        <button type="submit">Buscar ofertas</button>
      </form>
      {resultadoBusca ? <p className="busca-viagem__resultado" role="status">{resultadoBusca}</p> : null}
    </section>
  )
}

function Header({
  titulo,
  subtitulo,
  totalDestinos,
  melhorPreco,
  filtroAtivo,
  onFiltroChange,
}: HeaderProps) {
  const chips = [
    { label: 'Praias', value: 'Praia' },
    { label: 'Cidades', value: 'Cidade' },
    { label: 'Natureza', value: 'Natureza' },
    { label: 'Pacotes', value: 'Pacotes' },
  ]

  return (
    <header className="topo" id="inicio">
      <div className="topo__texto">
        <div className="topo__badge-row">
          <button
            type="button"
            className={`topo__badge ${filtroAtivo === 'Pacotes' ? 'topo__badge--ativo' : ''}`}
            onClick={() => onFiltroChange('Pacotes')}
          >
            Ofertas da semana
          </button>
          <button
            type="button"
            className={`topo__badge topo__badge--muted ${filtroAtivo === 'Todos' ? 'topo__badge--ativo' : ''}`}
            onClick={() => onFiltroChange('Todos')}
          >
            Sem taxa de embarque
          </button>
        </div>

        <p className="eyebrow">Sugestões exclusivas</p>
        <h1>{titulo}</h1>
        <p className="subtitulo">{subtitulo}</p>

        <div className="topo__chips" aria-label="Categorias de viagem">
          {chips.map((chip) => (
            <button
              key={chip.value}
              type="button"
              className={`topo__chip ${filtroAtivo === chip.value ? 'topo__chip--ativo' : ''}`}
              aria-pressed={filtroAtivo === chip.value}
              onClick={() => onFiltroChange(filtroAtivo === chip.value ? 'Todos' : chip.value)}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      <div className="topo__stats">
        <div>
          <span>{totalDestinos}</span>
          <small>Destinos</small>
        </div>
        <div>
          <span>{melhorPreco}</span>
          <small>Melhor valor</small>
        </div>
      </div>
    </header>
  )
}

type DestinoFormProps = {
  valor: string
  categoria: string
  onValorChange: (valor: string) => void
  onCategoriaChange: (categoria: string) => void
  onAdicionar: () => void
}

function DestinoForm({
  valor,
  categoria,
  onValorChange,
  onCategoriaChange,
  onAdicionar,
}: DestinoFormProps) {
  return (
    <section className="painel painel--form" id="ofertas">
      <div className="painel__header">
        <h2>Adicionar destino</h2>
      </div>

      <form
        className="formulario"
        onSubmit={(event) => {
          event.preventDefault()
          onAdicionar()
        }}
      >
        <label htmlFor="novo-destino">
          Nome do destino
          <input
            id="novo-destino"
            type="text"
            placeholder="Ex.: Santorini"
            value={valor}
            required
            minLength={2}
            maxLength={80}
            onChange={(event) => onValorChange(event.target.value)}
          />
        </label>

        <label htmlFor="categoria-destino">
          Categoria
          <select
            id="categoria-destino"
            value={categoria}
            onChange={(event) => onCategoriaChange(event.target.value)}
          >
            <option value="Praia">Praia</option>
            <option value="Cidade">Cidade</option>
            <option value="Natureza">Natureza</option>
            <option value="Aventura">Aventura</option>
          </select>
        </label>

        <button type="submit">
          + Adicionar
        </button>
      </form>
    </section>
  )
}

type DestinoListaProps = {
  destinos: Destino[]
  onFavorito: (destino: Destino) => void
  favoritos: number[]
}

function DestinoLista({ destinos, onFavorito, favoritos }: DestinoListaProps) {
  return (
    <section className="painel painel--lista" id="destinos">
      <div className="painel__header">
        <h2>Destinos em destaque</h2>
      </div>

      {destinos.length === 0 ? (
        <p className="lista-vazia">Nenhum destino encontrado nessa categoria.</p>
      ) : (
        <ul className="lista-destinos">
          {destinos.map((destino) => (
          <li key={destino.id} className="card">
            <div className="card__imagem-wrap">
              {destino.imagem ? (
                <img
                  src={destino.imagem}
                  alt={`Paisagem de ${destino.nome}`}
                  className="card__imagem"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(event) => {
                    event.currentTarget.onerror = null
                    event.currentTarget.src = IMAGENS_DESTINOS.Santorini
                  }}
                />
              ) : (
                <div className="card__imagem card__imagem--fallback">{destino.nome}</div>
              )}
            </div>

            <div className="card__conteudo">
              <div className="card__topo">
                <div>
                  <p className="card__categoria">{destino.categoria}</p>
                  <h3>{destino.nome}</h3>
                </div>
                <button type="button" className={favoritos.includes(destino.id) ? 'favorito favorito--ativo' : 'favorito'}
                  aria-label={favoritos.includes(destino.id) ? `Remover ${destino.nome} dos destinos salvos` : `Salvar ${destino.nome} nos destinos salvos`}
                  aria-pressed={favoritos.includes(destino.id)} onClick={() => onFavorito(destino)}>
                  {favoritos.includes(destino.id) ? '♥' : '♡'}
                </button>
              </div>

              <p className="card__pais">{destino.pais}</p>
              <p className="card__descricao">{destino.descricao}</p>

              <div className="card__rodape">
                <span className="nota">★ {destino.nota.toFixed(1)}</span>
                <strong>R$ {destino.preco.toLocaleString('pt-BR')}</strong>
              </div>
            </div>
          </li>
          ))}
        </ul>
      )}
    </section>
  )
}

type ContatoFormState = {
  nome: string
  email: string
  destinoInteresse: string
  mensagem: string
}

type ContatoFormProps = {
  form: ContatoFormState
  onFieldChange: (campo: keyof ContatoFormState, valor: string) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  mensagemEnviada: boolean
}

function ContatoForm({ form, onFieldChange, onSubmit, mensagemEnviada }: ContatoFormProps) {
  return (
    <section className="painel painel--contato" id="contato">
      <div className="painel__header">
        <h2>Área de contato</h2>
      </div>

      <form className="contato-form" onSubmit={onSubmit}>
        <label htmlFor="contato-nome">
          Nome
          <input
            id="contato-nome"
            type="text"
            value={form.nome}
            required
            maxLength={80}
            autoComplete="name"
            onChange={(event) => onFieldChange('nome', event.target.value)}
          />
        </label>

        <label htmlFor="contato-email">
          E-mail
          <input
            id="contato-email"
            type="email"
            value={form.email}
            required
            maxLength={120}
            autoComplete="email"
            onChange={(event) => onFieldChange('email', event.target.value)}
          />
        </label>

        <label htmlFor="contato-destino">
          Destino de interesse
          <input
            id="contato-destino"
            type="text"
            value={form.destinoInteresse}
            required
            maxLength={80}
            onChange={(event) => onFieldChange('destinoInteresse', event.target.value)}
          />
        </label>

        <label htmlFor="contato-mensagem">
          Mensagem
          <textarea
            id="contato-mensagem"
            rows={4}
            value={form.mensagem}
            required
            minLength={10}
            maxLength={500}
            onChange={(event) => onFieldChange('mensagem', event.target.value)}
          />
        </label>

        <p className="contato-form__orientacao">Preencha todos os campos. A mensagem deve ter pelo menos 10 caracteres.</p>
        <button type="submit">Enviar mensagem</button>
        {mensagemEnviada && (
          <p className="sucesso-form" role="status" aria-live="polite">
            Mensagem registrada com sucesso nesta demonstração! Os dados ficaram apenas no estado local e não foram enviados à internet.
          </p>
        )}
      </form>

      <div className="ajuda-contato" aria-label="Canais de ajuda">
        <div>
          <strong>Precisa de ajuda?</strong>
          <span>Fale com a equipe ViajaMais.</span>
        </div>
        <a href="mailto:ajuda@viajamais.com">ajuda@viajamais.com</a>
        <small>Respondemos de segunda a sexta, das 9h às 18h.</small>
        <details className="ajuda-contato__faq">
          <summary>Perguntas frequentes</summary>
          <p>O formulário é uma demonstração local e não envia dados para um servidor.</p>
          <p>As ofertas e preços são exemplos para apresentar a experiência de viagem.</p>
        </details>
      </div>
    </section>
  )
}

const DESTINOS_INICIAIS = ['Paris', 'Rome', 'Bali', 'Tokyo', 'Santorini']

const DADOS_LOCAIS: Record<string, { nome: string; pais: string; descricao: string }> = {
  Paris: {
    nome: 'Paris',
    pais: 'Capital da França',
    descricao: 'Conheça a cidade luz, seus museus, cafés charmosos e a famosa Torre Eiffel.',
  },
  Rome: {
    nome: 'Roma',
    pais: 'Capital da Itália',
    descricao: 'Explore ruínas históricas, praças encantadoras e a gastronomia tradicional italiana.',
  },
  Bali: {
    nome: 'Bali',
    pais: 'Ilha da Indonésia',
    descricao: 'Relaxe em praias paradisíacas e descubra templos, natureza e cultura local.',
  },
  Tokyo: {
    nome: 'Tóquio',
    pais: 'Capital do Japão',
    descricao: 'Viva uma experiência única entre tecnologia, tradição, sabores e muita energia.',
  },
  Santorini: {
    nome: 'Santorini',
    pais: 'Ilha da Grécia',
    descricao: 'Admire o mar azul, as casas brancas e o pôr do sol inesquecível do Mediterrâneo.',
  },
}

const IMAGENS_DESTINOS: Record<string, string> = {
  Paris:
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=85',
  Rome:
    'https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=900&q=85',
  Bali:
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=85',
  Tokyo:
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=85',
  Santorini:
    'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=85',
}

const IMAGENS_CATEGORIAS: Record<string, string> = {
  Praia: IMAGENS_DESTINOS.Santorini,
  Cidade: IMAGENS_DESTINOS.Tokyo,
  Natureza: IMAGENS_DESTINOS.Bali,
  Aventura: IMAGENS_DESTINOS.Rome,
}

const IMAGENS_LATERAIS = [
  'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
]

const DESTINOS_EXTRAS: Destino[] = [
  {
    id: 101,
    nome: 'Lisboa',
    pais: 'Capital de Portugal',
    categoria: 'Cidade',
    descricao: 'Caminhe por ruas charmosas, mirantes históricos e sabores autênticos de Portugal.',
    preco: 1980,
    destaque: true,
    nota: 4.8,
    imagem:
      'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 102,
    nome: 'Nova York',
    pais: 'Estados Unidos',
    categoria: 'Cidade',
    descricao: 'Descubra arranha-céus, parques famosos, musicais e experiências inesquecíveis.',
    preco: 2850,
    destaque: false,
    nota: 4.7,
    imagem:
      'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 103,
    nome: 'Maldivas',
    pais: 'Oceano Índico',
    categoria: 'Praia',
    descricao: 'Aproveite águas cristalinas, areia branca e dias de descanso em um cenário único.',
    preco: 3260,
    destaque: true,
    nota: 4.9,
    imagem:
      'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=900&q=85',
  },
]

function Destinos() {
  const { favoritos, alternar } = useDesejos()
  const carregamentoIniciado = useRef(false)
  const [destinos, setDestinos] = useState<Destino[]>([])
  const [loading, setLoading] = useState(true)
  const [erroApi, setErroApi] = useState('')
  const [novoDestino, setNovoDestino] = useState('')
  const [categoria, setCategoria] = useState('Praia')
  const [filtroAtivo, setFiltroAtivo] = useState('Todos')
  const [produtoAtivo, setProdutoAtivo] = useState('Hospedagens')
  const [destinoBusca, setDestinoBusca] = useState('')
  const [dataIda, setDataIda] = useState('')
  const [dataVolta, setDataVolta] = useState('')
  const [resultadoBusca, setResultadoBusca] = useState('')
  const [contato, setContato] = useState<ContatoFormState>({
    nome: '',
    email: '',
    destinoInteresse: '',
    mensagem: '',
  })
  const [mensagemEnviada, setMensagemEnviada] = useState(false)

  useEffect(() => {
    if (carregamentoIniciado.current) {
      return
    }

    carregamentoIniciado.current = true

    const carregarDestinos = async () => {
      let falhasApi = 0
      const lista = await Promise.all(
        DESTINOS_INICIAIS.map(async (titulo, index) => {
          try {
            // A P1 pede explicitamente fetch para consultar uma API pública.
            // O Axios permanece em services/http.ts e services/auth.ts para as aulas 8 e 9.
            const resposta = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(titulo)}`, {
              headers: { Accept: 'application/json' },
            })
            if (!resposta.ok) throw new Error(`Wikipedia HTTP ${resposta.status}`)
            const dados: { title?: string; description?: string; extract?: string; thumbnail?: { source?: string } } = await resposta.json()

            return {
              id: index + 1,
              nome: dados.title ?? DADOS_LOCAIS[titulo].nome,
              pais: DADOS_LOCAIS[titulo].pais,
              categoria: index % 2 === 0 ? 'Praia' : 'Cidade',
              descricao: dados.description ?? DADOS_LOCAIS[titulo].descricao,
              preco: 1400 + index * 420,
              destaque: index < 3,
              nota: 4.6 + (index % 4) * 0.1,
              imagem: IMAGENS_DESTINOS[titulo] ?? dados.thumbnail?.source,
            }
          } catch (error) {
            falhasApi += 1
            console.error(`Erro ao carregar ${titulo}:`, error)
            return {
              id: index + 1,
              nome: DADOS_LOCAIS[titulo].nome,
              pais: DADOS_LOCAIS[titulo].pais,
              categoria: index % 2 === 0 ? 'Praia' : 'Cidade',
              descricao: DADOS_LOCAIS[titulo].descricao,
              preco: 1400 + index * 420,
              destaque: index < 3,
              nota: 4.6 + (index % 4) * 0.1,
              imagem: IMAGENS_DESTINOS[titulo],
            }
          }
        }),
      )

      setDestinos([...lista, ...DESTINOS_EXTRAS])
      if (falhasApi > 0) {
        setErroApi('Não foi possível obter todos os destinos da Wikipedia. Exibindo informações locais de demonstração; confira as requisições na aba Network (HTTP 200 é exigido na P1).')
      }
      setLoading(false)
    }

    void carregarDestinos()
  }, [])

  useEffect(() => {
    const trocarImagensLaterais = () => {
      const imagens = [...IMAGENS_LATERAIS].sort(() => Math.random() - 0.5)
      document.body.style.backgroundImage = `linear-gradient(rgba(48, 44, 155, 0.38), rgba(48, 44, 155, 0.38)), url('${imagens[0]}'), url('${imagens[1]}')`

      const topo = document.querySelector<HTMLElement>('.topo')
      if (topo) {
        topo.style.backgroundImage = `linear-gradient(115deg, rgba(4, 74, 174, 0.6), rgba(76, 40, 167, 0.6)), url('${imagens[2]}')`
      }
    }

    trocarImagensLaterais()
    const intervalo = window.setInterval(trocarImagensLaterais, 12000)

    return () => {
      window.clearInterval(intervalo)
      document.body.style.removeProperty('background-image')
      document.querySelector<HTMLElement>('.topo')?.style.removeProperty('background-image')
    }
  }, [])

  const melhorPreco = useMemo(() => {
    if (destinos.length === 0) {
      return '—'
    }

    const menorValor = destinos.reduce((menor, destino) => Math.min(menor, destino.preco), Infinity)

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(menorValor)
  }, [destinos])

  const destinosVisiveis = useMemo(() => {
    const destinosFiltrados =
      filtroAtivo === 'Todos'
        ? destinos
        : filtroAtivo === 'Pacotes'
          ? destinos.filter((destino) => destino.destaque)
          : destinos.filter((destino) => destino.categoria === filtroAtivo)

    const buscaNormalizada = destinoBusca.trim().toLocaleLowerCase('pt-BR')

    if (!buscaNormalizada) {
      return destinosFiltrados
    }

    return destinosFiltrados.filter((destino) =>
      `${destino.nome} ${destino.pais}`.toLocaleLowerCase('pt-BR').includes(buscaNormalizada),
    )
  }, [destinos, destinoBusca, filtroAtivo])

  // HOF reduce: total dos preços dos destinos atualmente exibidos.
  const totalPrecosVisiveis = useMemo(
    () => destinosVisiveis.reduce((total, destino) => total + destino.preco, 0),
    [destinosVisiveis],
  )

  const [sincronizando, setSincronizando] = useState(false)
  const [retornoAxios, setRetornoAxios] = useState('')
  const atualizarComAxios = async () => {
    setSincronizando(true)
    setRetornoAxios('')
    try {
      const { data } = await wiki.get<{ title?: string; description?: string }>(
        '/page/summary/Paris',
      )
      setDestinos((atual) => atual.map((destino) =>
        destino.id === 1 ? { ...destino, nome: data.title ?? destino.nome, descricao: data.description ?? destino.descricao } : destino,
      ))
      setRetornoAxios('GET com Axios concluído: dados de Paris atualizados pela Wikipedia.')
    } catch (error) {
      setRetornoAxios('Falha na atualização com Axios. Confira o status HTTP em Network.')
      console.error('Falha no GET com Axios:', error)
    } finally {
      setSincronizando(false)
    }
  }

  const buscarOfertas = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFiltroAtivo('Todos')

    const destinoEncontrado = destinos.find((destino) =>
      `${destino.nome} ${destino.pais}`.toLocaleLowerCase('pt-BR').includes(destinoBusca.trim().toLocaleLowerCase('pt-BR')),
    )

    if (!destinoBusca.trim()) {
      setResultadoBusca('Digite um destino para calcular sua viagem.')
      return
    }

    if (dataIda && dataVolta && new Date(dataVolta) > new Date(dataIda)) {
      const noites = Math.round((new Date(dataVolta).getTime() - new Date(dataIda).getTime()) / 86400000)
      const precoBase = destinoEncontrado?.preco ?? 1800
      const estimativa = precoBase + Math.max(noites - 1, 0) * 180
      setResultadoBusca(`${destinoEncontrado?.nome ?? destinoBusca} por ${noites} dias. Estimativa a partir de R$ ${estimativa.toLocaleString('pt-BR')}.`)
      return
    }

    setResultadoBusca('Selecione uma data de ida e uma data de volta válidas.')
  }

  const adicionarDestino = () => {
    const nomeTrim = novoDestino.trim()

    if (!nomeTrim) {
      return
    }

    const novoItem: Destino = {
      id: Date.now(),
      nome: nomeTrim,
      pais: 'Nova sugestão do usuário',
      categoria,
      descricao: 'Destino adicionado localmente para demonstrar controle de estado no front-end.',
      preco: 1800 + Math.floor(Math.random() * 1400),
      destaque: true,
      nota: 4.8,
      imagem: IMAGENS_CATEGORIAS[categoria],
    }

    setDestinos((atual) => [novoItem, ...atual])
    setNovoDestino('')
    setCategoria('Praia')
  }

  const handleFieldChange = (campo: keyof ContatoFormState, valor: string) => {
    setMensagemEnviada(false)
    setContato((estadoAtual) => ({
      ...estadoAtual,
      [campo]: valor,
    }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMensagemEnviada(true)
  }

  return (
    <>
      <Header
        titulo="Sua próxima aventura começa aqui"
        subtitulo="Explore destinos incríveis e envie sua mensagem para receber uma sugestão personalizada."
        totalDestinos={destinos.length}
        melhorPreco={melhorPreco}
        filtroAtivo={filtroAtivo}
        onFiltroChange={setFiltroAtivo}
      />

      <BuscaViagem
        produtoAtivo={produtoAtivo}
        destinoBusca={destinoBusca}
        dataIda={dataIda}
        dataVolta={dataVolta}
        resultadoBusca={resultadoBusca}
        onProdutoChange={setProdutoAtivo}
        onDestinoChange={setDestinoBusca}
        onDataIdaChange={setDataIda}
        onDataVoltaChange={setDataVolta}
        onBuscar={buscarOfertas}
      />

      <main className="conteudo">
        <div className="coluna-esquerda">
          <DestinoForm
            valor={novoDestino}
            categoria={categoria}
            onValorChange={setNovoDestino}
            onCategoriaChange={setCategoria}
            onAdicionar={adicionarDestino}
          />

          <ContatoForm
            form={contato}
            onFieldChange={handleFieldChange}
            onSubmit={handleSubmit}
            mensagemEnviada={mensagemEnviada}
          />

          <OfertasViagem
            onOfertaClick={(destino) => {
              setDestinoBusca(destino)
              setFiltroAtivo('Todos')
            }}
          />
        </div>

        <div className="coluna-direita">
          {loading ? (
            <section className="painel painel--lista">
              <div className="painel__header">
                <h2 role="status" aria-live="polite">Carregando destinos...</h2>
              </div>
            </section>
          ) : (
            <>
              <div className="resumo-aula8" aria-live="polite">
                <span>{destinosVisiveis.length} destino(s) na seleção</span>
                <span>Total dos preços exibidos (reduce): {totalPrecosVisiveis.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                <button type="button" disabled={sincronizando} onClick={() => void atualizarComAxios()}>
                  {sincronizando ? 'Atualizando...' : 'Atualizar Paris com Axios GET'}
                </button>
                {retornoAxios && <small role="status">{retornoAxios}</small>}
              </div>
              <DestinoLista destinos={destinosVisiveis} favoritos={favoritos.map((item) => item.id)} onFavorito={alternar} />
            </>
          )}

          {erroApi ? <p className="erro-api" role="status" aria-live="polite">{erroApi}</p> : null}
        </div>
      </main>
    </>
  )
}

export default Destinos
