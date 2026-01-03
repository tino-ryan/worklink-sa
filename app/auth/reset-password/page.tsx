// app/auth/reset-password/page.tsx
'use client'

import { useState } from 'react'
import { resetPassword } from '@/app/actions/auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from '../auth.module.css'

export default function ResetPasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await resetPassword(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else if (result?.success) {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className={styles.successPage}>
        <div className={styles.successCard}>
          <div className={styles.successIconCircle}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h2 className={styles.successTitle}>
            Check Your Email
          </h2>
          <p className={styles.successText}>
            We've sent you a password reset link. Please check your email and click the link to reset your password.
          </p>
          
          <div className={styles.infoBox}>
            <p className={styles.infoBoxTitle}>Didn't receive the email?</p>
            <p className={styles.infoBoxText}>Check your spam folder or try again in a few minutes.</p>
          </div>

          <Link href="/auth/login" className={styles.primaryButton}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <button onClick={() => router.back()} className={styles.backButton}>
          <svg className={styles.backIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </button>

        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.iconCircle}>
              <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h2 className={styles.title}>
              Reset Password
            </h2>
            <p className={styles.subtitle}>
              Enter your email to receive a reset link
            </p>
          </div>

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

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email Address
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
                  autoComplete="email"
                  className={styles.input}
                  placeholder="you@example.com"
                />
              </div>
              <p className={styles.helperText}>
                ℹ️ We'll send a password reset link to this email
              </p>
            </div>

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
                  Sending...
                </>
              ) : (
                <>
                  Send Reset Link
                  <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>

            <div className={styles.divider}>
              <p className={styles.dividerText}>Remember your password?</p>
              <div style={{ textAlign: 'center' }}>
                <Link href="/auth/login" className={styles.link}>
                  ← Back to Login
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}