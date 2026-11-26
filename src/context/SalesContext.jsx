import { createContext, useContext, useReducer } from 'react'

const SalesContext = createContext(null)

const initialState = { sales: [] }

function salesReducer(state, action) {
    switch (action.type) {
        case 'SET_SALES':
            return { sales: action.payload }
        case 'RECORD_SALE':
            return { sales: [...state.sales, action.payload] }
        default:
            return state
    }
}

export function SalesProvider({ children }) {
    const [state, dispatch] = useReducer(salesReducer, initialState)
    return (
        <SalesContext.Provider value={{ ...state, dispatch }}>
            {children}
        </SalesContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSales() {
    const ctx = useContext(SalesContext)
    if (!ctx) throw new Error('useSales must be used inside SalesProvider')
    return ctx
}