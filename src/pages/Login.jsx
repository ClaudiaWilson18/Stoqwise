import '../styles/login.css'
export default function Login() {
  return (
      <main className="login-page">
        <form className="login-card" onSubmit={(e) => e.preventDefault()}>
          <h1>Stoqwise</h1>
          <p className="login-subtitle">Log in to continue</p>

          <div className="login-error" role="alert"></div>

          <label htmlFor="identifier">Username or email</label>
          <input
              id="identifier"
              type="text"
              placeholder="Enter your username or email"
          />

          <label htmlFor="password">Password</label>
          <input
              id="password"
              type="password"
              placeholder="Enter your password"
          />

          <button type="submit">Log in</button>
        </form>
      </main>
  )
}