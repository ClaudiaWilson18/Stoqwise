import { createContext, useContext, useReducer } from 'react'

const ProductsContext = createContext(null)

const initialState = { products: [] }

function productsReducer(state, action) {
    switch (action.type) {
        case 'SET_PRODUCTS':
            return { products: action.payload }
        case 'ADD_PRODUCT':
            return { products: [...state.products, action.payload] }
        case 'UPDATE_PRODUCT':
            return {
                products: state.products.map((p) =>
                    p.id === action.payload.id ? action.payload : p
                ),
            }
        case 'DELETE_PRODUCT':
            return {
                products: state.products.filter((p) => p.id !== action.payload),
            }
        default:
            return state
    }
}

export function ProductsProvider({ children }) {
    const [state, dispatch] = useReducer(productsReducer, initialState)
    return (
        <ProductsContext.Provider value={{ ...state, dispatch }}>
            {children}
        </ProductsContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProducts() {
    const ctx = useContext(ProductsContext)
    if (!ctx) throw new Error('useProducts must be used inside ProductsProvider')
    return ctx
}