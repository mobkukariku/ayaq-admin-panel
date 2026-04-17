import { useEffect, useState } from 'react'
import { catalogItemApi, catalogBrandApi, catalogTypeApi } from '../api/catalog'
import type { CatalogItem, CatalogBrand, CatalogType, CreateItemPayload } from '../api/catalog'

// ─── Shared UI ─────────────────────────────────────────────────────────────

const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition'
const primaryBtn = 'bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white text-sm font-medium py-2.5 px-4 rounded-xl transition cursor-pointer'
const cancelBtn = 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium py-2.5 px-4 rounded-xl transition cursor-pointer'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

function StockBadge({ qty }: { qty: number }) {
  if (qty === 0) return <span className="text-xs bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-medium">Нет</span>
  if (qty < 10) return <span className="text-xs bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-medium">{qty} шт.</span>
  return <span className="text-xs bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">{qty} шт.</span>
}

function ProductImage({ url, name, size = 'md' }: { url: string; name: string; size?: 'sm' | 'md' | 'lg' }) {
  const [err, setErr] = useState(false)
  const cls = { sm: 'w-10 h-10', md: 'w-12 h-12', lg: 'w-full aspect-square' }[size]
  if (!url || err) {
    return (
      <div className={`${cls} rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0`}>
        <svg className="w-5 h-5 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    )
  }
  return <img src={url} alt={name} onError={() => setErr(true)} className={`${cls} rounded-xl object-cover shrink-0 bg-gray-100 dark:bg-gray-800`} />
}

// ─── Create Modal ────────────────────────────────────────────────────────────

function CreateModal({ brands, types, onClose, onCreated }: { brands: CatalogBrand[]; types: CatalogType[]; onClose: () => void; onCreated: (item: CatalogItem) => void }) {
  const [form, setForm] = useState<CreateItemPayload>({
    name: '', description: '', price: 0, pictureUrl: '',
    stockQuantity: 0, catalogTypeId: types[0]?.id ?? 0, catalogBrandId: brands[0]?.id ?? 0,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function set<K extends keyof CreateItemPayload>(key: K, val: CreateItemPayload[K]) {
    setForm(f => ({ ...f, [key]: val }))
  }

  async function handleSave() {
    if (!form.name.trim()) return setError('Введите название')
    setSaving(true); setError('')
    try { const { data } = await catalogItemApi.create(form); onCreated(data) }
    catch { setError('Не удалось создать товар') } finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/30 dark:bg-black/50 flex items-end sm:items-center justify-center z-50 px-0 sm:px-4">
      <div className="bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl shadow-xl border-t sm:border border-gray-100 dark:border-gray-800 w-full sm:max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Новый товар</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition cursor-pointer">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-4">
          <Field label="Название"><input className={inputCls} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nike Air Max 90" /></Field>
          <Field label="Описание"><textarea className={`${inputCls} resize-none`} rows={3} value={form.description} onChange={e => set('description', e.target.value)} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Цена (₸)"><input className={inputCls} type="number" min={0} value={form.price} onChange={e => set('price', Number(e.target.value))} /></Field>
            <Field label="Остаток (шт.)"><input className={inputCls} type="number" min={0} value={form.stockQuantity} onChange={e => set('stockQuantity', Number(e.target.value))} /></Field>
          </div>
          <Field label="Фото (URL)"><input className={inputCls} value={form.pictureUrl} onChange={e => set('pictureUrl', e.target.value)} placeholder="https://..." /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Бренд">
              <select className={inputCls} value={form.catalogBrandId} onChange={e => set('catalogBrandId', Number(e.target.value))}>
                {brands.map(b => <option key={b.id} value={b.id}>{b.brand}</option>)}
              </select>
            </Field>
            <Field label="Тип">
              <select className={inputCls} value={form.catalogTypeId} onChange={e => set('catalogTypeId', Number(e.target.value))}>
                {types.map(t => <option key={t.id} value={t.id}>{t.type}</option>)}
              </select>
            </Field>
          </div>
        </div>
        {error && <p className="text-sm text-red-600 dark:text-red-400 mt-3">{error}</p>}
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className={cancelBtn}>Отмена</button>
          <button onClick={handleSave} disabled={saving} className={primaryBtn}>{saving ? 'Создание...' : 'Создать'}</button>
        </div>
      </div>
    </div>
  )
}

// ─── Edit Drawer ──────────────────────────────────────────────────────────────

type EditTab = 'details' | 'stock' | 'media' | 'meta'

function EditDrawer({ item, brands, types, onClose, onUpdated, onDeleted }: {
  item: CatalogItem; brands: CatalogBrand[]; types: CatalogType[]
  onClose: () => void; onUpdated: (item: CatalogItem) => void; onDeleted: (id: number) => void
}) {
  const [tab, setTab] = useState<EditTab>('details')
  const [details, setDetails] = useState({ name: item.name, description: item.description, price: item.price })
  const [stock, setStock] = useState(item.stockQuantity)
  const [picture, setPicture] = useState(item.pictureUrl)
  const [brandId, setBrandId] = useState(item.catalogBrandId)
  const [typeId, setTypeId] = useState(item.catalogTypeId)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [error, setError] = useState('')

  async function save(fn: () => Promise<unknown>, patch: Partial<CatalogItem>) {
    setSaving(true); setError('')
    try { await fn(); onUpdated({ ...item, ...patch }) }
    catch { setError('Не удалось сохранить') } finally { setSaving(false) }
  }

  async function handleDelete() {
    setDeleting(true)
    try { await catalogItemApi.delete(item.id); onDeleted(item.id) }
    catch { setError('Не удалось удалить'); setDeleting(false) }
  }

  const tabs: { key: EditTab; label: string }[] = [
    { key: 'details', label: 'Основное' }, { key: 'stock', label: 'Остаток' },
    { key: 'media', label: 'Фото' }, { key: 'meta', label: 'Бренд/Тип' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/20 dark:bg-black/40" onClick={onClose} />
      <div className="w-full max-w-md bg-white dark:bg-gray-900 h-full flex flex-col shadow-2xl border-l border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between px-4 md:px-6 py-5 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <ProductImage url={item.pictureUrl} name={item.name} size="sm" />
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{item.name}</h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">#{item.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition cursor-pointer shrink-0 ml-3">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex border-b border-gray-100 dark:border-gray-800 px-4 md:px-6 shrink-0 overflow-x-auto">
          {tabs.map(t => (
            <button key={t.key} onClick={() => { setTab(t.key); setError('') }}
              className={`py-3 px-2 md:px-3 text-xs md:text-sm font-medium border-b-2 transition cursor-pointer -mb-px whitespace-nowrap ${
                tab === t.key ? 'border-violet-600 text-violet-700 dark:text-violet-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-5">
          {tab === 'details' && (
            <div className="space-y-4">
              <Field label="Название"><input className={inputCls} value={details.name} onChange={e => setDetails(d => ({ ...d, name: e.target.value }))} /></Field>
              <Field label="Описание"><textarea className={`${inputCls} resize-none`} rows={4} value={details.description} onChange={e => setDetails(d => ({ ...d, description: e.target.value }))} /></Field>
              <Field label="Цена (₸)"><input className={inputCls} type="number" min={0} value={details.price} onChange={e => setDetails(d => ({ ...d, price: Number(e.target.value) }))} /></Field>
              {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
              <button onClick={() => save(() => catalogItemApi.updateDetails(item.id, details), details)} disabled={saving} className={`${primaryBtn} w-full`}>{saving ? 'Сохранение...' : 'Сохранить'}</button>
            </div>
          )}
          {tab === 'stock' && (
            <div className="space-y-4">
              <Field label="Количество на складе"><input className={inputCls} type="number" min={0} value={stock} onChange={e => setStock(Number(e.target.value))} /></Field>
              {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
              <button onClick={() => save(() => catalogItemApi.updateStock(item.id, stock), { stockQuantity: stock })} disabled={saving} className={`${primaryBtn} w-full`}>{saving ? 'Сохранение...' : 'Обновить остаток'}</button>
            </div>
          )}
          {tab === 'media' && (
            <div className="space-y-4">
              {picture && (
                <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 aspect-square bg-gray-50 dark:bg-gray-800">
                  <img src={picture} alt="" className="w-full h-full object-contain" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                </div>
              )}
              <Field label="URL изображения"><input className={inputCls} value={picture} onChange={e => setPicture(e.target.value)} placeholder="https://..." /></Field>
              {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
              <button onClick={() => save(() => catalogItemApi.updatePicture(item.id, picture), { pictureUrl: picture })} disabled={saving} className={`${primaryBtn} w-full`}>{saving ? 'Сохранение...' : 'Обновить фото'}</button>
            </div>
          )}
          {tab === 'meta' && (
            <div className="space-y-4">
              <Field label="Бренд">
                <select className={inputCls} value={brandId} onChange={e => setBrandId(Number(e.target.value))}>
                  {brands.map(b => <option key={b.id} value={b.id}>{b.brand}</option>)}
                </select>
              </Field>
              <Field label="Тип">
                <select className={inputCls} value={typeId} onChange={e => setTypeId(Number(e.target.value))}>
                  {types.map(t => <option key={t.id} value={t.id}>{t.type}</option>)}
                </select>
              </Field>
              {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
              <button onClick={() => save(async () => { await catalogItemApi.updateBrand(item.id, brandId); await catalogItemApi.updateType(item.id, typeId) }, {
                catalogBrandId: brandId, catalogTypeId: typeId,
                catalogItemBrandName: brands.find(b => b.id === brandId)?.brand ?? item.catalogItemBrandName,
                catalogItemTypeName: types.find(t => t.id === typeId)?.type ?? item.catalogItemTypeName,
              })} disabled={saving} className={`${primaryBtn} w-full`}>{saving ? 'Сохранение...' : 'Сохранить'}</button>
            </div>
          )}
        </div>

        <div className="px-4 md:px-6 py-4 border-t border-gray-100 dark:border-gray-800 shrink-0">
          {!confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)} className="w-full text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 py-2.5 rounded-xl transition cursor-pointer">
              Удалить товар
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-700 dark:text-gray-300 text-center">Удалить «{item.name}»?</p>
              <div className="flex gap-2">
                <button onClick={() => setConfirmDelete(false)} className={`${cancelBtn} flex-1`}>Отмена</button>
                <button onClick={handleDelete} disabled={deleting} className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-sm font-medium py-2.5 rounded-xl transition cursor-pointer">
                  {deleting ? 'Удаление...' : 'Удалить'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductsPage() {
  const [items, setItems] = useState<CatalogItem[]>([])
  const [brands, setBrands] = useState<CatalogBrand[]>([])
  const [types, setTypes] = useState<CatalogType[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [brandFilter, setBrandFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [editing, setEditing] = useState<CatalogItem | null>(null)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    Promise.all([catalogItemApi.getAll(), catalogBrandApi.getAll(), catalogTypeApi.getAll()])
      .then(([i, b, t]) => { setItems(i.data); setBrands(b.data); setTypes(t.data) })
      .finally(() => setLoading(false))
  }, [])

  const filtered = items.filter(item => {
    const q = search.toLowerCase()
    return (!q || item.name.toLowerCase().includes(q) || item.catalogItemBrandName.toLowerCase().includes(q)) &&
      (brandFilter === 'all' || item.catalogItemBrandName === brandFilter) &&
      (typeFilter === 'all' || item.catalogItemTypeName === typeFilter)
  })

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><div className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" /></div>
  }

  const selectCls = 'px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition'

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">Товары</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{items.length} позиций</p>
        </div>
        <button onClick={() => setCreating(true)} className={primaryBtn}>
          <span className="hidden sm:inline">+ Добавить товар</span>
          <span className="sm:hidden">+</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 sm:flex-none">
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Поиск..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition w-full sm:w-56" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-0.5">
          <select value={brandFilter} onChange={e => setBrandFilter(e.target.value)} className={selectCls}>
            <option value="all">Все бренды</option>
            {brands.map(b => <option key={b.id} value={b.brand}>{b.brand}</option>)}
          </select>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className={selectCls}>
            <option value="all">Все типы</option>
            {types.map(t => <option key={t.id} value={t.type}>{t.type}</option>)}
          </select>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              {['Товар', 'Бренд', 'Тип', 'Остаток'].map(h => (
                <th key={h} className="text-left text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide px-6 py-4">{h}</th>
              ))}
              <th className="text-right text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide px-6 py-4">Цена</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {filtered.map(item => (
              <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer" onClick={() => setEditing(item)}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <ProductImage url={item.pictureUrl} name={item.name} />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 line-clamp-1 max-w-xs">{item.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{item.catalogItemBrandName}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{item.catalogItemTypeName}</td>
                <td className="px-6 py-4"><StockBadge qty={item.stockQuantity} /></td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white text-right">{item.price.toLocaleString('ru-RU')} ₸</td>
                <td className="px-6 py-4 text-right">
                  <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-400 dark:text-gray-500">Товары не найдены</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 ? (
          <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-12">Товары не найдены</p>
        ) : filtered.map(item => (
          <div key={item.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 cursor-pointer active:bg-gray-50 dark:active:bg-gray-800 transition-colors"
            onClick={() => setEditing(item)}>
            <div className="flex items-center gap-3">
              <ProductImage url={item.pictureUrl} name={item.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.catalogItemBrandName} · {item.catalogItemTypeName}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.price.toLocaleString('ru-RU')} ₸</p>
                <div className="mt-1"><StockBadge qty={item.stockQuantity} /></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && <EditDrawer item={editing} brands={brands} types={types} onClose={() => setEditing(null)}
        onUpdated={u => { setItems(prev => prev.map(i => i.id === u.id ? u : i)); setEditing(u) }}
        onDeleted={id => { setItems(prev => prev.filter(i => i.id !== id)); setEditing(null) }} />}
      {creating && <CreateModal brands={brands} types={types} onClose={() => setCreating(false)}
        onCreated={item => { setItems(prev => [item, ...prev]); setCreating(false) }} />}
    </div>
  )
}
