import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'

function Header() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  const sair = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <nav className="barra-navegacao" aria-label="Navegação principal">
      <Link className="marca" to="/" aria-label="ViajaMais início">
        Viaja<span>Mais</span>
      </Link>

      <div className="barra-navegacao__links">
        <NavLink to="/" end>Destinos</NavLink>
        <NavLink to="/desejos">Desejos</NavLink>
      </div>

      <div className="barra-navegacao__acoes">
        {usuario ? <span>Olá, {usuario.firstName}</span> : null}
        <button type="button" onClick={sair}>Sair</button>
      </div>
    </nav>
  )
}

export default Header
