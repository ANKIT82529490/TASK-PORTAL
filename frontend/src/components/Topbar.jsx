import { useAuth } from '../context/AuthContext'

export default function Topbar() {
  const { user, logout } = useAuth()

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Task Portal</h1>
        <p className="text-white/60 text-sm">Welcome, <span className="text-white/90 font-medium">{user?.name}</span></p>
      </div>
      <div className="flex items-center gap-2">
        
        <button className="btn-ghost bg-red-500 hover:bg-red-600 p-2 m-2 rounded-md text-white" onClick={logout}>Logout</button>
      </div>
    </div>
  )
}
