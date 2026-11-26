import { createContext, useContext, useReducer } from 'react'

const AuthContext = createContext(null)

const initialState = { user: null, role: null }

function authReducer(state, action) {
    switch (action.type) {
        case 'LOGIN':
            return { user: action.payload, role: action.payload.role }
        case 'LOGOUT':
            return initialState
        default:
            return state
    }
}

export function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(authReducer, initialState)
    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
    return ctx
}