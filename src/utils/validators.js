export function required(value, label = 'This field') {
    return String(value ?? '').trim() === '' ? `${label} is required` : ''
}

export function positiveNumber(value) {
    const n = Number(value)
    return Number.isNaN(n) || n <= 0 ? 'Enter a number above 0' : ''
}

export function wholeNumber(value) {
    const n = Number(value)
    return Number.isInteger(n) && n >= 0 ? '' : 'Enter a whole number, such as 5'
}

export function usernameOrEmail(value) {
    const v = String(value ?? '').trim()
    if (v === '') return 'Enter your username or email'
    if (v.includes('@')) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address'
    }
    return v.length >= 3 ? '' : 'Username must be at least 3 characters'
}

export function passwordLength(value, min = 6) {
    return String(value ?? '').length >= min
        ? ''
        : `Password must be at least ${min} characters`
}