import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import ProductForm from './pages/ProductForm'
import RecordSale from './pages/RecordSale'
import Receipt from './pages/Receipt'
import SalesHistory from './pages/SalesHistory'
import Reports from './pages/Reports'

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/inventory/new" element={<ProductForm />} />
        <Route path="/sales/new" element={<RecordSale />} />
        <Route path="/receipt" element={<Receipt />} />
        <Route path="/sales" element={<SalesHistory />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
  )
}