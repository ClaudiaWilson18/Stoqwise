import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/login.css'
import { addUser } from '../data/productService'
import { required, usernameOrEmail, passwordLength } from '../utils/validators'

export default function Register() {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        name: '',
        username: '',
        password: '',
        confirm: '',
    })
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setForm({ ...form, [e.target.id]: e.target.value })
        setError('')
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const problem =
            required(form.name, 'Full name') ||
            usernameOrEmail(form.username) ||
            passwordLength(form.password) ||
            (form.password !== form.confirm ? 'Passwords do not match' : '')

        if (problem) {
            setError(problem)
            return
        }

        const result = addUser(form)
        if (!result.ok) {
            setError(result.error)
            return
        }
        navigate('/login')
    }

    return (
        <main className="login-page">
            <form className="login-card" onSubmit={handleSubmit}>
                <h1>Create account</h1>
                <p className="login-subtitle">New accounts are Sales Staff</p>

                <div className="login-error" role="alert">{error}</div>

                <label htmlFor="name">Full name</label>
                <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                />

                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    type="text"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Choose a username"
                />

                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                />

                <label htmlFor="confirm">Confirm password</label>
                <input
                    id="confirm"
                    type="password"
                    value={form.confirm}
                    onChange={handleChange}
                    placeholder="Enter the password again"
                />

                <button type="submit">Create account</button>

                <p className="login-switch">
                    Already have an account? <Link to="/login">Log in</Link>
                </p>
            </form>
        </main>
    )
}