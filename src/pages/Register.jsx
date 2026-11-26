import '../styles/login.css'
import { Link } from 'react-router-dom'

export default function Register() {
    return (
        <main className="login-page">
            <form className="login-card" onSubmit={(e) => e.preventDefault()}>
                <h1>Create account</h1>
                <p className="login-subtitle">New accounts are Sales Staff</p>

                <div className="login-error" role="alert"></div>

                <label htmlFor="name">Full name</label>
                <input id="name" type="text" placeholder="Enter your full name" />

                <label htmlFor="username">Username</label>
                <input id="username" type="text" placeholder="Choose a username" />

                <label htmlFor="password">Password</label>
                <input id="password" type="password" placeholder="At least 6 characters" />

                <label htmlFor="confirm">Confirm password</label>
                <input id="confirm" type="password" placeholder="Enter the password again" />

                <button type="submit">Create account</button>

                <p className="login-switch">
                    Already have an account? <Link to="/login">Log in</Link>
                </p>
            </form>
        </main>
    )
}