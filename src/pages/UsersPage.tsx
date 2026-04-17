import { useEffect, useState } from 'react'
import { usersApi } from '../api/users'
import type { AppUser, UpdateProfilePayload } from '../api/users'

const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition'

function Avatar({ user, size = 'md' }: { user: AppUser; size?: 'sm' | 'md' }) {
  const cls = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-9 h-9 text-sm'
  const initials = [user.firstName, user.lastName]
    .filter(Boolean).map(s => s[0]).join('').toUpperCase() || user.userName[0].toUpperCase()

  if (user.profilePictureUrl) {
    return <img src={user.profilePictureUrl} alt={initials} className={`${cls} rounded-full object-cover shrink-0`}
      onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
  }
  return (
    <div className={`${cls} rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center text-violet-700 dark:text-violet-300 font-semibold shrink-0`}>
      {initials}
    </div>
  )
}

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    Admin: 'bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300',
    User: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[role] ?? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'}`}>
      {role}
    </span>
  )
}

function EditModal({ user, onClose, onSaved }: { user: AppUser; onClose: () => void; onSaved: (u: AppUser) => void }) {
  const [form, setForm] = useState<UpdateProfilePayload>({
    firstName: user.firstName, lastName: user.lastName, profilePictureUrl: user.profilePictureUrl,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    setSaving(true); setError('')
    try {
      await usersApi.update(user.userId, form)
      onSaved({ ...user, ...form })
    } catch { setError('Не удалось сохранить') } finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/30 dark:bg-black/50 flex items-end sm:items-center justify-center z-50 px-0 sm:px-4">
      <div className="bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl shadow-xl border-t sm:border border-gray-100 dark:border-gray-800 w-full sm:max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Редактировать профиль</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition cursor-pointer">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-4">
          {[{ label: 'Имя', key: 'firstName' }, { label: 'Фамилия', key: 'lastName' }, { label: 'Фото (URL)', key: 'profilePictureUrl' }]
            .map(({ label, key }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
                <input type="text" className={inputCls} value={form[key as keyof UpdateProfilePayload]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
              </div>
            ))}
        </div>
        {error && <p className="text-sm text-red-600 dark:text-red-400 mt-3">{error}</p>}
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer">Отмена</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white text-sm font-medium transition cursor-pointer">
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function UsersPage() {
  const [users, setUsers] = useState<AppUser[]>([])
  const [filtered, setFiltered] = useState<AppUser[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<AppUser | null>(null)

  useEffect(() => {
    usersApi.getAll().then(res => { setUsers(res.data); setFiltered(res.data) }).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(users.filter(u =>
      u.email.toLowerCase().includes(q) ||
      u.userName.toLowerCase().includes(q) ||
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(q)
    ))
  }, [search, users])

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><div className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" /></div>
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">Пользователи</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{users.length} аккаунтов</p>
        </div>
        <div className="relative">
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Поиск..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition w-full sm:w-72" />
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              {['Пользователь', 'Email', 'Username', 'Роли', ''].map(h => (
                <th key={h} className="text-left text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide px-6 py-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {filtered.map(user => (
              <tr key={user.userId} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar user={user} />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.firstName || user.lastName ? `${user.firstName} ${user.lastName}`.trim() : '—'}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-mono mt-0.5">{user.userId.slice(0, 8)}…</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{user.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{user.userName}</td>
                <td className="px-6 py-4"><div className="flex gap-1.5 flex-wrap">{user.roles.map(r => <RoleBadge key={r} role={r} />)}</div></td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => setEditing(user)} className="text-sm text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-200 font-medium transition cursor-pointer">
                    Изменить
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-400 dark:text-gray-500">Пользователи не найдены</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 ? (
          <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-12">Пользователи не найдены</p>
        ) : filtered.map(user => (
          <div key={user.userId} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar user={user} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user.firstName || user.lastName ? `${user.firstName} ${user.lastName}`.trim() : user.userName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{user.email}</p>
                </div>
              </div>
              <button onClick={() => setEditing(user)} className="text-xs text-violet-600 dark:text-violet-400 font-medium shrink-0 cursor-pointer">
                Изменить
              </button>
            </div>
            <div className="flex items-center gap-2 mt-3">
              {user.roles.map(r => <RoleBadge key={r} role={r} />)}
            </div>
          </div>
        ))}
      </div>

      {editing && <EditModal user={editing} onClose={() => setEditing(null)} onSaved={u => { setUsers(prev => prev.map(x => x.userId === u.userId ? u : x)); setEditing(null) }} />}
    </div>
  )
}
