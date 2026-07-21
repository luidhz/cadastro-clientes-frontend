import { useState } from 'react'
import './App.css'
import { SECTIONS } from './constants/sections'
import { UsuariosPage } from './pages/UsuariosPage'
import { ComprasPage } from './pages/ComprasPage'
import { ItensCompraPage } from './pages/ItensCompraPage'
import { ProdutosPage } from './pages/ProdutosPage'

const PAGES = {
  usuarios: UsuariosPage,
  produtos: ProdutosPage,
  compras: ComprasPage,
  itensCompra: ItensCompraPage,
}

function App() {
  const [activePage, setActivePage] = useState('usuarios')
  const CurrentPage = PAGES[activePage]

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div>
          <h1>Sistema de Cadastros</h1>
        </div>

        <nav className="page-nav">
          {Object.entries(SECTIONS).map(([sectionKey, section]) => (
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
      </aside>

      <CurrentPage />
    </main>
  )
}

export default App
