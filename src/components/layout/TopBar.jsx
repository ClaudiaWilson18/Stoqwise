import { useLocation, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'

const PAGE_TITLES = {
    '/dashboard': 'Dashboard',
    '/inventory': 'Inventory',
    '/inventory/new': 'Product form',
    '/sales/new': 'Record sale',
    '/receipt': 'Receipt',
    '/sales': 'Sales history',
    '/reports': 'Reports',
}

export default function TopBar() {
    const { pathname } = useLocation()
    const navigate = useNavigate()

    // TEMPORARY: replace with useAuth() once Nana's AuthContext is merged
    const user = { name: 'Admin', role: 'Admin' }

    const title = PAGE_TITLES[pathname] || 'Stoqwise'

    function handleLogout() {
        // TEMPORARY: call logout() from useAuth() here once it exists
        navigate('/login')
    }

    return (
        <header
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 16px',
                minHeight: 64,
                borderBottom: '1px solid #ddd',
            }}
        >
            <h1 style={{ margin: 0, fontSize: 20 }}>{title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span>
          {user.name} ({user.role})
        </span>
                <button
                    onClick={handleLogout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        minHeight: 44,
                        padding: '0 12px',
                        cursor: 'pointer',
                    }}
                >
                    <LogOut size={18} aria-hidden="true" />
                    <span>Log out</span>
                </button>
            </div>
        </header>
    )
}