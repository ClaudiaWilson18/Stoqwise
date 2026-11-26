import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, ClipboardList, TrendingUp } from 'lucide-react'

const NAV_LINKS = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Admin', 'Sales Staff'] },
    { to: '/inventory', label: 'Inventory', icon: Package, roles: ['Admin', 'Sales Staff'] },
    { to: '/sales/new', label: 'Record sale', icon: ShoppingCart, roles: ['Admin', 'Sales Staff'] },
    { to: '/sales', label: 'Sales history', icon: ClipboardList, roles: ['Admin', 'Sales Staff'] },
    { to: '/reports', label: 'Reports', icon: TrendingUp, roles: ['Admin'] },
]

export default function Sidebar() {
    // TEMPORARY: replace with useAuth() once Nana's AuthContext is merged
    const role = 'Admin'

    const links = NAV_LINKS.filter((link) => link.roles.includes(role))

    return (
        <nav style={{ width: 220, padding: 16, borderRight: '1px solid #ddd' }}>
            <h2 style={{ marginTop: 0 }}>Stoqwise</h2>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {links.map(({ to, label, icon: Icon }) => (
                    <li key={to}>
                        <NavLink
                            to={to}
                            end
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                minHeight: 44,
                                padding: '0 8px',
                                textDecoration: 'none',
                                fontWeight: isActive ? 'bold' : 'normal',
                            })}
                        >
                            <Icon size={18} aria-hidden="true" />
                            <span>{label}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    )
}