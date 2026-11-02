import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'
import { mensagemDeErro } from '../utils/erros'

function Login() {
  const { usuario, carregando, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')

  const destino = (location.state as { from?: string } | null)?.from ?? '/'

  if (!carregando && usuario) {
    return <Navigate to={destino} replace />
  }

  const enviar = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErro('')
    setEnviando(true)

    try {
      await login(username.trim(), password)
      navigate(destino, { replace: true })
    } catch (error) {
      setErro(mensagemDeErro(error, 'login'))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main className="login-pagina">
      <section className="login-card" aria-labelledby="titulo-login">
        <p className="login-card__marca">Viaja<span>Mais</span></p>
        <h1 id="titulo-login">Entrar na sua conta</h1>
        <p className="login-card__texto">Acesse seus destinos e sua lista de desejos.</p>

        <form className="login-card__form" onSubmit={enviar} noValidate>
          <label htmlFor="login-usuario">Usuário
            <input
              id="login-usuario"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              placeholder="emilys"
              required
              disabled={enviando}
            />
          </label>
          <label htmlFor="login-senha">Senha
            <input
              id="login-senha"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="emilyspass"
              required
              disabled={enviando}
            />
          </label>
          <button type="submit" disabled={enviando || !username.trim() || !password}>
            {enviando ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        {erro ? <p className="erro-api" role="alert">{erro}</p> : null}
      </section>
    </main>
  )
}

export default Login
