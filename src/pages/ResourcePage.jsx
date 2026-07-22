import { useEffect, useState } from 'react'
import { DataTable } from '../components/DataTable'
import { Message } from '../components/Message'
import { ResourceForm } from '../components/ResourceForm'
import { SearchPanel } from '../components/SearchPanel'
import { WorkspaceHeader } from '../components/WorkspaceHeader'
import { INITIAL_FORMS, SECTIONS } from '../constants/sections'
import {
  createResource,
  deleteResource,
  listResources,
  searchResource,
  updateResource,
} from '../services/api'

export function ResourcePage({ sectionKey, canManage }) {
  const [records, setRecords] = useState([])
  const [form, setForm] = useState(INITIAL_FORMS[sectionKey])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [editingRecord, setEditingRecord] = useState(null)

  const section = SECTIONS[sectionKey]

  async function loadRecords() {
    setLoading(true)
    setMessage('')

    try {
      const items = await listResources(sectionKey)
      setRecords(items)
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    async function loadInitialRecords() {
      setLoading(true)

      try {
        const items = await listResources(sectionKey)

        if (isMounted) {
          setRecords(items)
        }
      } catch (error) {
        if (isMounted) {
          setMessage(error.message)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadInitialRecords()

    return () => {
      isMounted = false
    }
  }, [sectionKey])

  function handleFormChange(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function handleSubmitForm(event) {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (editingRecord) {
        await updateResource(sectionKey, getRecordIdentifier(sectionKey, editingRecord), form)
      } else {
        await createResource(sectionKey, form)
      }

      setForm(INITIAL_FORMS[sectionKey])
      setEditingRecord(null)
      await loadRecords()
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
    setForm(mapRecordToForm(sectionKey, item))
  }

  function handleCancelEdit() {
    setEditingRecord(null)
    setForm(INITIAL_FORMS[sectionKey])
  }

  async function handleSearch(event) {
    event.preventDefault()

    if (!searchTerm.trim()) {
      loadRecords()
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const item = await searchResource(sectionKey, searchTerm)
      setRecords(item ? [item] : [])
    } catch (error) {
      setRecords([])
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(item) {
    setLoading(true)
    setMessage('')

    try {
      await deleteResource(sectionKey, getRecordIdentifier(sectionKey, item))
      await loadRecords()
      setMessage('Registro removido com sucesso.')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page">
      <WorkspaceHeader loading={loading} onRefresh={loadRecords} section={section} />

      <div className="content-grid">
        <SearchPanel
          onChange={setSearchTerm}
          onSubmit={handleSearch}
          searchTerm={searchTerm}
          section={section}
        />

        {canManage && (
          <ResourceForm
            editingRecord={editingRecord}
            form={form}
            loading={loading}
            onChange={handleFormChange}
            onCancelEdit={handleCancelEdit}
            onSubmit={handleSubmitForm}
            sectionKey={sectionKey}
          />
        )}
      </div>

      <Message text={message} />

      <DataTable
        canManage={canManage}
        items={records}
        loading={loading}
        onDelete={handleDelete}
        onEdit={handleEdit}
        sectionKey={sectionKey}
        title={section.title}
      />
    </section>
  )
}

function mapRecordToForm(sectionKey, item) {
  if (sectionKey === 'usuarios') {
    return {
      nome: item.nome || '',
      email: item.email || '',
      idade: item.idade || '',
      senha: item.senha || '',
      role: item.role || 'USUARIO',
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

  if (sectionKey === 'compras') {
    return {
      usuarioId: item.usuario?.id || '',
      valorTotal: item.valorTotal || '',
    }
  }

  return {
    compraId: item.compra?.id || '',
    produtoId: item.produto?.id || '',
    quantidade: item.quantidade || '',
    precoUnitario: item.precoUnitario || '',
  }
}

function getRecordIdentifier(sectionKey, item) {
  if (sectionKey === 'itensCompra') {
    return {
      compraId: item.compra?.id,
      produtoId: item.produto?.id,
    }
  }

  return item.id
}
