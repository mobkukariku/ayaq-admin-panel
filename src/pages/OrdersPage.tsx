import { useEffect, useState } from 'react'
import { ordersApi } from '../api/orders'
import type { Order } from '../api/orders'

function StatusBadge({ confirmed }: { confirmed: boolean }) {
  return confirmed ? (
    <span className="inline-flex items-center gap-1.5 text-xs bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-full font-medium">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400" />Подтверждён
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-xs bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 px-2.5 py-1 rounded-full font-medium">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />Ожидает
    </span>
  )
}

function OrderDrawer({ order, onClose, onConfirm }: { order: Order; onClose: () => void; onConfirm: (id: number) => void }) {
  const [confirming, setConfirming] = useState(false)

  async function handleConfirm() {
    setConfirming(true)
    try { await ordersApi.confirm(order.id); onConfirm(order.id) }
    finally { setConfirming(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/20 dark:bg-black/40" onClick={onClose} />
      <div className="w-full max-w-md bg-white dark:bg-gray-900 h-full overflow-y-auto shadow-2xl flex flex-col border-l border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between px-4 md:px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Заказ #{order.id}</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{new Date(order.orderDate).toLocaleString('ru-RU')}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition cursor-pointer">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 px-4 md:px-6 py-5 space-y-6">
          <div>
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">Статус</p>
            <StatusBadge confirmed={order.isConfirmed} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">Клиент</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 font-mono break-all">{order.userId}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">Доставка</p>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-2 text-sm">
              {[
                ['Метод', order.shippingMethod.name],
                ['Стоимость', `${order.shippingMethod.cost.toLocaleString('ru-RU')} ₸`],
                ['Срок', order.shippingMethod.deliveryTime],
                ['Адрес', order.shippingDetails.addressToShip],
                ['Телефон', order.shippingDetails.phoneNumber],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <span className="text-gray-500 dark:text-gray-400 shrink-0">{k}</span>
                  <span className="text-gray-900 dark:text-white text-right">{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">Состав</p>
            <div className="space-y-2">
              {order.items.map(item => (
                <div key={item.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3">
                  <div className="min-w-0 mr-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.productName}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{item.quantity} шт. × {item.unitPrice.toLocaleString('ru-RU')} ₸</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white shrink-0">{item.totalPrice.toLocaleString('ru-RU')} ₸</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-800">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Итого</span>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">{order.totalPrice.toLocaleString('ru-RU')} ₸</span>
          </div>
        </div>

        {!order.isConfirmed && (
          <div className="px-4 md:px-6 py-4 border-t border-gray-100 dark:border-gray-800">
            <button onClick={handleConfirm} disabled={confirming}
              className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white text-sm font-medium py-2.5 rounded-xl transition cursor-pointer">
              {confirming ? 'Подтверждение...' : 'Подтвердить заказ'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

type FilterStatus = 'all' | 'pending' | 'confirmed'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Order | null>(null)
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    ordersApi.getAll().then(res => setOrders(res.data)).finally(() => setLoading(false))
  }, [])

  function handleConfirmed(id: number) {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, isConfirmed: true } : o))
    setSelected(prev => prev?.id === id ? { ...prev, isConfirmed: true } : prev)
  }

  const filtered = orders.filter(o => {
    const matchesStatus = filter === 'all' || (filter === 'confirmed' && o.isConfirmed) || (filter === 'pending' && !o.isConfirmed)
    const q = search.toLowerCase()
    return matchesStatus && (!q || String(o.id).includes(q) || o.userId.toLowerCase().includes(q) || o.shippingDetails.addressToShip.toLowerCase().includes(q))
  })

  const pendingCount = orders.filter(o => !o.isConfirmed).length

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><div className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" /></div>
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">Заказы</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {orders.length} всего
            {pendingCount > 0 && <span className="ml-2 text-amber-600 dark:text-amber-400 font-medium">· {pendingCount} ожидают</span>}
          </p>
        </div>
        <div className="relative">
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="ID, клиент, адрес..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition w-full sm:w-64" />
        </div>
      </div>

      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {(['all', 'pending', 'confirmed'] as FilterStatus[]).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer whitespace-nowrap ${
              filter === f
                ? 'bg-violet-600 text-white'
                : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}>
            {{ all: 'Все', pending: 'Ожидают', confirmed: 'Подтверждённые' }[f]}
          </button>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              {['Заказ', 'Дата', 'Клиент', 'Доставка', 'Статус'].map(h => (
                <th key={h} className="text-left text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide px-6 py-4">{h}</th>
              ))}
              <th className="text-right text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide px-6 py-4">Сумма</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {filtered.map(order => (
              <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer" onClick={() => setSelected(order)}>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">#{order.id}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{new Date(order.orderDate).toLocaleDateString('ru-RU')}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 font-mono">{order.userId.slice(0, 10)}…</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{order.shippingMethod.name}</td>
                <td className="px-6 py-4"><StatusBadge confirmed={order.isConfirmed} /></td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white text-right">{order.totalPrice.toLocaleString('ru-RU')} ₸</td>
                <td className="px-6 py-4 text-right">
                  <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-400 dark:text-gray-500">Заказы не найдены</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 ? (
          <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-12">Заказы не найдены</p>
        ) : filtered.map(order => (
          <div key={order.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 cursor-pointer active:bg-gray-50 dark:active:bg-gray-800 transition-colors"
            onClick={() => setSelected(order)}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">#{order.id}</span>
              <StatusBadge confirmed={order.isConfirmed} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">{new Date(order.orderDate).toLocaleDateString('ru-RU')} · {order.shippingMethod.name}</span>
              <span className="font-semibold text-gray-900 dark:text-white">{order.totalPrice.toLocaleString('ru-RU')} ₸</span>
            </div>
          </div>
        ))}
      </div>

      {selected && <OrderDrawer order={selected} onClose={() => setSelected(null)} onConfirm={handleConfirmed} />}
    </div>
  )
}
