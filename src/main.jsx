import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/base.css'
import './components/ui/ui.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProductsProvider } from './context/ProductsContext'
import { SalesProvider } from './context/SalesContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
          <AuthProvider>
              <ProductsProvider>
                  <SalesProvider>
                      <App />
                  </SalesProvider>
              </ProductsProvider>
          </AuthProvider>
      </BrowserRouter>
  </StrictMode>,
)
