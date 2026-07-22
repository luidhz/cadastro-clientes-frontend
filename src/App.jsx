import { useEffect, useState } from 'react'
import './App.css'
import { SECTIONS } from './constants/sections'
import { ComprasPage } from './pages/ComprasPage'
import { ItensCompraPage } from './pages/ItensCompraPage'
import { LoginPage } from './pages/LoginPage'
import { ProdutosPage } from './pages/ProdutosPage'
import { UsuariosPage } from './pages/UsuariosPage'

const PAGES = {
  usuarios: UsuariosPage,
  produtos: ProdutosPage,
  compras: ComprasPage,
  itensCompra: ItensCompraPage,
}

function App() {
  const [activePage, setActivePage] = useState('usuarios')
  const [usuarioLogado, setUsuarioLogado] = useState(() => {
    const salvo = localStorage.getItem('usuarioLogado')
    return salvo ? JSON.parse(salvo) : null
  })

  const isAdmin = usuarioLogado?.role === 'ADMIN'
  const visibleSections = Object.entries(SECTIONS).filter(([sectionKey]) => {
    if (isAdmin) {
      return true
    }

    return sectionKey === 'compras' || sectionKey === 'itensCompra'
  })

  useEffect(() => {
    if (!usuarioLogado) {
      return
    }

    const canSeeActivePage = visibleSections.some(([sectionKey]) => sectionKey === activePage)

    if (!canSeeActivePage) {
      setActivePage(visibleSections[0][0])
    }
  }, [activePage, usuarioLogado, visibleSections])

  const CurrentPage = PAGES[activePage]

  function handleLogin(usuario) {
    localStorage.setItem('usuarioLogado', JSON.stringify(usuario))
    setUsuarioLogado(usuario)
  }

  function handleLogout() {
    localStorage.removeItem('usuarioLogado')
    setUsuarioLogado(null)
    setActivePage('usuarios')
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

      <CurrentPage canManage={isAdmin} />
    </main>
  )
}

export default App
