import { createContext, useContext, useReducer, useEffect } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY = 'stoqwise_user'
const initialState = { user: null, role: null }

function loadInitialState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const user = JSON.parse(saved)
      return { user, role: user.role }
    }
  } catch {
    // ignore bad saved data
  }
  return initialState
}

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
  const [state, dispatch] = useReducer(authReducer, null, loadInitialState)

  useEffect(() => {
    if (state.user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.user))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [state.user])

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