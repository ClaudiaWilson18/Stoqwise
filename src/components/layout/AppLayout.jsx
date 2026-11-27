import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function AppLayout() {
    return (
        <div className="app-layout" style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <TopBar />
                <main className="app-main" style={{ flex: 1, padding: 16 }}>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}