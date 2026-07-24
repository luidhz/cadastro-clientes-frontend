import { useEffect, useState } from 'react'
import './App.css'
import { SECTIONS } from './constants/sections'
import { ComprasPage } from './pages/ComprasPage'
import { LoginPage } from './pages/LoginPage'
import { ProdutosPage } from './pages/ProdutosPage'
import { UsuariosPage } from './pages/UsuariosPage'

const PAGES = {
  usuarios: UsuariosPage,
  produtos: ProdutosPage,
  compras: ComprasPage,
}

const COMPRAS_NAV_ITEM = ['compras', { title: 'Compras' }]

function App() {
  const [activePage, setActivePage] = useState('compras')
  const [usuarioLogado, setUsuarioLogado] = useState(() => {
    const salvo = localStorage.getItem('usuarioLogado')
    return salvo ? JSON.parse(salvo) : null
  })

  const isAdmin = usuarioLogado?.role === 'ADMIN'

  // Cadastros (usuarios/produtos) sao administrativos: so o admin ve no menu.
  const cadastroSections = isAdmin ? Object.entries(SECTIONS) : []
  const visibleSections = [...cadastroSections, COMPRAS_NAV_ITEM]

  useEffect(() => {
    if (!usuarioLogado) {
      return
    }

    const canSeeActivePage = visibleSections.some(([sectionKey]) => sectionKey === activePage)

    if (!canSeeActivePage) {
      setActivePage('compras')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePage, usuarioLogado])

  const CurrentPage = PAGES[activePage]

  function handleLogin(usuario) {
    localStorage.setItem('usuarioLogado', JSON.stringify(usuario))
    setUsuarioLogado(usuario)
    setActivePage('compras')
  }

  function handleLogout() {
    localStorage.removeItem('usuarioLogado')
    setUsuarioLogado(null)
    setActivePage('compras')
  }

  if (!usuarioLogado) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div>
          <h1>Sistema de Cadastros</h1>
          <p className="logged-user">
            {usuarioLogado.nome || usuarioLogado.email} - {usuarioLogado.role}
          </p>
        </div>

        <nav className="page-nav">
          {visibleSections.map(([sectionKey, section]) => (
            <button
              className={activePage === sectionKey ? 'nav-button active' : 'nav-button'}
              key={sectionKey}
              onClick={() => setActivePage(sectionKey)}
              type="button"
            >
              {section.title}
            </button>
          ))}
        </nav>

        <button className="logout-button" onClick={handleLogout} type="button">
          Sair
        </button>
      </aside>

      <CurrentPage canManage={isAdmin} usuarioLogado={usuarioLogado} />
    </main>
  )
}

export default App
