import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/login.css'
import { getUsers } from '../data/productService'
import { required, usernameOrEmail } from '../utils/validators'
import { useAuth } from '../context/AuthContext'

export default function Login() {
    const navigate = useNavigate()
    const { dispatch } = useAuth()
    const [form, setForm] = useState({ identifier: '', password: '' })
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setForm({ ...form, [e.target.id]: e.target.value })
        setError('')
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const problem =
            usernameOrEmail(form.identifier) || required(form.password, 'Password')
        if (problem) {
            setError(problem)
            return
        }

        const wanted = form.identifier.trim().toLowerCase()
        const match = getUsers().find(
            (u) => u.username.toLowerCase() === wanted && u.password === form.password
        )
        if (!match) {
            setError('Incorrect username or password')
            return
        }

        dispatch({
            type: 'LOGIN',
            payload: {
                id: match.id,
                name: match.name,
                username: match.username,
                role: match.role,
            },
        })
        navigate('/dashboard')
    }

    return (
        <main className="login-page">
            <form className="login-card" onSubmit={handleSubmit}>
                <h1>Stoqwise</h1>
                <p className="login-subtitle">Log in to continue</p>

                <div className="login-error" role="alert">{error}</div>

                <label htmlFor="identifier">Username or email</label>
                <input
                    id="identifier"
                    type="text"
                    value={form.identifier}
                    onChange={handleChange}
                    placeholder="Enter your username or email"
                />

                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                />

                <button type="submit">Log in</button>

                <p className="login-switch">
                    No account? <Link to="/register">Create one</Link>
                </p>
            </form>
        </main>
    )
}