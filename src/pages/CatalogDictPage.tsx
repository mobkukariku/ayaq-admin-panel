import { useEffect, useState } from 'react'
import { catalogBrandApi, catalogTypeApi } from '../api/catalog'
import type { CatalogBrand, CatalogType } from '../api/catalog'

interface DictItem { id: number; label: string }

function DictPanel({ title, items, loading, onCreate, onDelete }: {
  title: string; items: DictItem[]; loading: boolean
  onCreate: (name: string) => Promise<void>; onDelete: (id: number) => Promise<void>
}) {
  const [input, setInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [confirmId, setConfirmId] = useState<number | null>(null)
  const [error, setError] = useState('')

  async function handleCreate() {
    const name = input.trim()
    if (!name) return setError('Введите название')
    setSaving(true); setError('')
    try { await onCreate(name); setInput('') }
    catch { setError('Не удалось создать') } finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    setDeletingId(id)
    try { await onDelete(id); setConfirmId(null) }
    catch { setError('Не удалось удалить') } finally { setDeletingId(null) }
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col">
      <div className="px-5 md:px-6 py-5 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h2>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">{items.length} записей</p>
      </div>

      <div className="px-5 md:px-6 py-4 border-b border-gray-50 dark:border-gray-800">
        <div className="flex gap-2">
          <input type="text" value={input}
            onChange={e => { setInput(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            placeholder={`Новый ${title.toLowerCase().slice(0, -1)}...`}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition" />
          <button onClick={handleCreate} disabled={saving}
            className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white text-sm font-medium transition cursor-pointer shrink-0">
            {saving ? '...' : 'Добавить'}
          </button>
        </div>
        {error && <p className="text-xs text-red-500 dark:text-red-400 mt-2">{error}</p>}
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-5 h-5 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-10">Пусто</p>
        ) : items.map(item => (
          <div key={item.id} className="flex items-center justify-between px-5 md:px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-300 dark:text-gray-600 font-mono w-6 text-right shrink-0">#{item.id}</span>
              <span className="text-sm text-gray-800 dark:text-gray-200">{item.label}</span>
            </div>
            {confirmId === item.id ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">Удалить?</span>
                <button onClick={() => setConfirmId(null)} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer">Нет</button>
                <button onClick={() => handleDelete(item.id)} disabled={deletingId === item.id}
                  className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-300 font-medium cursor-pointer disabled:opacity-50">
                  {deletingId === item.id ? '...' : 'Да'}
                </button>
              </div>
            ) : (
              <button onClick={() => setConfirmId(item.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 dark:text-gray-600 hover:text-red-400 cursor-pointer">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function CatalogDictPage() {
  const [brands, setBrands] = useState<CatalogBrand[]>([])
  const [types, setTypes] = useState<CatalogType[]>([])
  const [loadingBrands, setLoadingBrands] = useState(true)
  const [loadingTypes, setLoadingTypes] = useState(true)

  useEffect(() => {
    catalogBrandApi.getAll().then(r => setBrands(r.data)).finally(() => setLoadingBrands(false))
    catalogTypeApi.getAll().then(r => setTypes(r.data)).finally(() => setLoadingTypes(false))
  }, [])

  async function createBrand(name: string) { const { data } = await catalogBrandApi.create(name); setBrands(prev => [...prev, data]) }
  async function deleteBrand(id: number) { await catalogBrandApi.delete(id); setBrands(prev => prev.filter(b => b.id !== id)) }
  async function createType(name: string) { const { data } = await catalogTypeApi.create(name); setTypes(prev => [...prev, data]) }
  async function deleteType(id: number) { await catalogTypeApi.delete(id); setTypes(prev => prev.filter(t => t.id !== id)) }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">Справочники</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Управление брендами и типами товаров</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <DictPanel title="Бренды" items={brands.map(b => ({ id: b.id, label: b.brand }))} loading={loadingBrands} onCreate={createBrand} onDelete={deleteBrand} />
        <DictPanel title="Типы" items={types.map(t => ({ id: t.id, label: t.type }))} loading={loadingTypes} onCreate={createType} onDelete={deleteType} />
      </div>
    </div>
  )
}
