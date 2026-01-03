// app/auth/signup/page.tsx
'use client'

import { useState } from 'react'
import { signup } from '@/app/actions/auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from '../auth.module.css'

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [userType, setUserType] = useState<'client' | 'worker'>('client')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await signup(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className={styles.backButton}
        >
          <svg 
            className={styles.backIcon}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </button>

        {/* Main Card */}
        <div className={styles.card}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.iconCircle}>
              <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className={styles.title}>
              Create Your Account
            </h2>
            <p className={styles.subtitle}>
              Join WorkLink and start connecting today
            </p>
          </div>

          {/* Form */}
          <form className={styles.form} onSubmit={handleSubmit}>
            {error && (
              <div className={styles.error}>
                <svg className={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p style={{ fontWeight: 600, margin: 0 }}>Error</p>
                  <p style={{ margin: 0 }}>{error}</p>
                </div>
              </div>
            )}

            {/* Full Name */}
            <div className={styles.formGroup}>
              <label htmlFor="fullName" className={styles.label}>
                Full Name <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div className={styles.inputWrapper}>
                <svg className={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  className={styles.input}
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email Address <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div className={styles.inputWrapper}>
                <svg className={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={styles.input}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className={styles.formGroup}>
              <label htmlFor="phoneNumber" className={styles.label}>
                Phone Number <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div className={styles.inputWrapper}>
                <svg className={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  className={styles.input}
                  placeholder="0821234567"
                />
              </div>
              <p className={styles.helperText}>
                📱 Used for WhatsApp contact
              </p>
            </div>

            {/* Password */}
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                Password <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div className={styles.inputWrapper}>
                <svg className={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  className={styles.input}
                  placeholder="••••••••"
                />
              </div>
              <p className={styles.helperText}>
                ℹ️ Minimum 6 characters
              </p>
            </div>

            {/* User Type Selection */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                I want to: <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input type="hidden" name="userType" value={userType} />
              <div className={styles.userTypeGrid}>
                <button
                  type="button"
                  onClick={() => setUserType('client')}
                  className={`${styles.userTypeButton} ${userType === 'client' ? styles.selected : ''}`}
                >
                  {userType === 'client' && (
                    <div className={styles.checkmark}>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  <div className={styles.userTypeEmoji}>👤</div>
                  <div className={styles.userTypeTitle}>Find Workers</div>
                  <div className={styles.userTypeDesc}>I need help with tasks</div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setUserType('worker')}
                  className={`${styles.userTypeButton} ${userType === 'worker' ? styles.selected : ''}`}
                >
                  {userType === 'worker' && (
                    <div className={styles.checkmark}>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  <div className={styles.userTypeEmoji}>🛠️</div>
                  <div className={styles.userTypeTitle}>Find Work</div>
                  <div className={styles.userTypeDesc}>I offer services</div>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? (
                <>
                  <svg className={styles.spinner} fill="none" viewBox="0 0 24 24">
                    <circle className={styles.spinnerCircle} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className={styles.spinnerPath} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>

            {/* Terms */}
            <p className={styles.terms}>
              By signing up, you agree to our{' '}
              <Link href="/terms" className={styles.link}>
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className={styles.link}>
                Privacy Policy
              </Link>
            </p>

            {/* Footer */}
            <div className={styles.footer}>
              Already have an account?{' '}
              <Link href="/auth/login" className={styles.link}>
                Sign in →
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}