import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { Dashboard } from './components/Dashboard'
import { DataTable } from './components/DataTable'
import { Message } from './components/Message'
import { ResourceForm } from './components/ResourceForm'
import { SearchPanel } from './components/SearchPanel'
import { WorkspaceHeader } from './components/WorkspaceHeader'
import { INITIAL_FORMS, SECTIONS } from './constants/sections'
import {
  createResource,
  deleteResource,
  listResources,
  searchResource,
  updateResource,
} from './services/api'

function App() {
  const [activeSection, setActiveSection] = useState('clientes')
  const [records, setRecords] = useState({
    clientes: [],
    produtos: [],
    compras: [],
  })
  const [forms, setForms] = useState(INITIAL_FORMS)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [editingRecord, setEditingRecord] = useState(null)

  const currentSection = SECTIONS[activeSection]

  const stats = useMemo(
    () => ({
      clientes: records.clientes.length,
      produtos: records.produtos.length,
      compras: records.compras.length,
    }),
    [records],
  )

  async function loadSection(sectionKey = activeSection) {
    setLoading(true)
    setMessage('')

    try {
      const items = await listResources(sectionKey)
      setRecords((current) => ({ ...current, [sectionKey]: items }))
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    Promise.all([
      listResources('clientes'),
      listResources('produtos'),
      listResources('compras'),
    ])
      .then(([clientes, produtos, compras]) => {
        if (isMounted) {
          setRecords({ clientes, produtos, compras })
        }
      })
      .catch((error) => {
        if (isMounted) {
          setMessage(error.message)
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  function handleSectionChange(sectionKey) {
    setActiveSection(sectionKey)
    setSearchTerm('')
    setMessage('')
    setEditingRecord(null)
  }

  function handleFormChange(field, value) {
    setForms((current) => ({
      ...current,
      [activeSection]: {
        ...current[activeSection],
        [field]: value,
      },
    }))
  }

  async function handleSubmitForm(event) {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (editingRecord) {
        await updateResource(activeSection, editingRecord.id, forms[activeSection])
      } else {
        await createResource(activeSection, forms[activeSection])
      }

      setForms((current) => ({
        ...current,
        [activeSection]: INITIAL_FORMS[activeSection],
      }))
      setEditingRecord(null)
      await loadSection(activeSection)
      setMessage(editingRecord ? 'Registro atualizado com sucesso.' : 'Registro cadastrado com sucesso.')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  function handleEdit(item) {
    setEditingRecord(item)
    setMessage('')
    setForms((current) => ({
      ...current,
      [activeSection]: mapRecordToForm(activeSection, item),
    }))
  }

  function handleCancelEdit() {
    setEditingRecord(null)
    setForms((current) => ({
      ...current,
      [activeSection]: INITIAL_FORMS[activeSection],
    }))
  }

  async function handleSearch(event) {
    event.preventDefault()

    if (!searchTerm.trim()) {
      loadSection(activeSection)
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const item = await searchResource(activeSection, searchTerm)
      setRecords((current) => ({ ...current, [activeSection]: item ? [item] : [] }))
    } catch (error) {
      setRecords((current) => ({ ...current, [activeSection]: [] }))
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    setLoading(true)
    setMessage('')

    try {
      await deleteResource(activeSection, id)
      await loadSection(activeSection)
      setMessage('Registro removido com sucesso.')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="app-shell">
      <Dashboard
        activeSection={activeSection}
        onSelectSection={handleSectionChange}
        sections={SECTIONS}
        stats={stats}
      />

      <section className="workspace">
        <WorkspaceHeader
          loading={loading}
          onRefresh={() => loadSection(activeSection)}
          section={currentSection}
        />

        <div className="content-grid">
          <SearchPanel
            onChange={setSearchTerm}
            onSubmit={handleSearch}
            searchTerm={searchTerm}
            section={currentSection}
          />

          <ResourceForm
            editingRecord={editingRecord}
            form={forms[activeSection]}
            loading={loading}
            onChange={handleFormChange}
            onCancelEdit={handleCancelEdit}
            onSubmit={handleSubmitForm}
            sectionKey={activeSection}
          />
        </div>

        <Message text={message} />

        <DataTable
          items={records[activeSection]}
          loading={loading}
          onDelete={handleDelete}
          onEdit={handleEdit}
          sectionKey={activeSection}
          title={currentSection.title}
        />
      </section>
    </main>
  )
}

function mapRecordToForm(sectionKey, item) {
  if (sectionKey === 'clientes') {
    return {
      nome: item.nome || '',
      email: item.email || '',
      idade: item.idade || '',
      senha: item.senha || '',
    }
  }

  if (sectionKey === 'produtos') {
    return {
      codigoDeBarras: item.codigoDeBarras || '',
      nome: item.nome || '',
      preco: item.preco || '',
      qtdeEmEstoque: item.qtdeEmEstoque || '',
    }
  }

  return {
    clienteId: item.cliente?.id || '',
    valorTotal: item.valorTotal || '',
  }
}

export default App
