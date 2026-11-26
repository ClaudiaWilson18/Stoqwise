import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/base.css'
import './components/ui/ui.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { getProducts, recordSale } from './data/productService';
console.log(getProducts().length);                  // 25
console.log(recordSale('Test', [{ productId: 1, quantity: 3 }]));

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter><App /></BrowserRouter>
  </StrictMode>,
)
