// app/auth/verify-email/page.tsx
import styles from '../auth.module.css'

export default function VerifyEmailPage() {
  return (
    <div className={styles.successPage}>
      <div className={styles.successCard}>
        <div className={styles.successIconCircle}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        
        <h2 className={styles.successTitle}>
          Check your email
        </h2>
        <p className={styles.successText}>
          We've sent you a verification link. Please check your email and click the link to activate your account.
        </p>
        
        <div className={styles.infoBox}>
          <p className={styles.infoBoxTitle}>Didn't receive the email?</p>
          <p className={styles.infoBoxText}>Check your spam folder or contact support.</p>
        </div>
      </div>
    </div>
  )
}