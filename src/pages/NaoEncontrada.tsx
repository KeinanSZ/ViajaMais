import { Link } from 'react-router-dom'

function NaoEncontrada() {
  return (
    <main className="conteudo">
      <section className="painel">
        <div className="painel__header">
          <h2>404 · Página não encontrada</h2>
        </div>
        <p><Link to="/">Voltar para os destinos</Link></p>
      </section>
    </main>
  )
}

export default NaoEncontrada
