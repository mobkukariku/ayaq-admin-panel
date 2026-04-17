import { useEffect, useState } from 'react'
import { dashboardApi, type SalesReport, type ActivityLog, type InventoryItem } from '../api/dashboard'

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 md:p-6">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
      {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</p>}
    </div>
  )
}

function SalesChart({ data }: { data: SalesReport[] }) {
  const max = Math.max(...data.map(d => d.salesCount), 1)
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 md:p-6">
      <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-6">Продажи по месяцам</h2>
      <div className="flex items-end gap-1.5 md:gap-2 h-36 md:h-40">
        {data.map((d) => (
          <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
            <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">{d.salesCount}</span>
            <div
              className="w-full bg-violet-500 dark:bg-violet-600 rounded-t-lg transition-all"
              style={{ height: `${(d.salesCount / max) * 100}%`, minHeight: d.salesCount > 0 ? 4 : 0 }}
            />
            <span className="text-xs text-gray-400 dark:text-gray-500 truncate w-full text-center">{d.month}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ActivityTable({ logs }: { logs: ActivityLog[] }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 md:p-6">
      <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Активность клиентов</h2>
      <div className="space-y-3">
        {logs.slice(0, 8).map((log, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 font-medium shrink-0">
                {log.userId.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300 font-mono truncate">{log.userId.slice(0, 10)}…</span>
            </div>
            <div className="flex items-center gap-2 md:gap-3 shrink-0">
              {log.justOrdered && (
                <span className="text-xs bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                  Заказал
                </span>
              )}
              <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">
                {new Date(log.orderDate).toLocaleDateString('ru-RU')}
              </span>
            </div>
          </div>
        ))}
        {logs.length === 0 && <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">Нет данных</p>}
      </div>
    </div>
  )
}

function InventoryList({ items }: { items: InventoryItem[] }) {
  const max = Math.max(...items.map(i => i.stockQuantity), 1)
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 md:p-6">
      <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Остатки на складе</h2>
      <div className="space-y-3">
        {items.slice(0, 8).map((item) => (
          <div key={item.productName}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700 dark:text-gray-300 truncate mr-2">{item.productName}</span>
              <span className="text-gray-500 dark:text-gray-400 shrink-0">{item.stockQuantity} шт.</span>
            </div>
            <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-violet-400 dark:bg-violet-500 rounded-full"
                style={{ width: `${(item.stockQuantity / max) * 100}%` }} />
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">Нет данных</p>}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [sales, setSales] = useState<SalesReport[]>([])
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      dashboardApi.getSalesReport(),
      dashboardApi.getActivityLogs(),
      dashboardApi.getInventorySummary(),
    ]).then(([s, l, inv]) => {
      setSales(s.data)
      setLogs(l.data)
      setInventory(inv.data)
    }).finally(() => setLoading(false))
  }, [])

  const totalSales = sales.reduce((sum, s) => sum + s.salesCount, 0)
  const activeUsers = logs.filter(l => l.justOrdered).length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">Дашборд</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Обзор магазина Ayaq</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
        <StatCard label="Всего продаж" value={totalSales} sub="за все время" />
        <StatCard label="Активных заказов" value={activeUsers} sub="текущий период" />
        <StatCard label="Позиций на складе" value={inventory.length} sub="уникальных товаров" />
      </div>

      <div className="mb-4 md:mb-6">
        <SalesChart data={sales} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ActivityTable logs={logs} />
        <InventoryList items={inventory} />
      </div>
    </div>
  )
}
