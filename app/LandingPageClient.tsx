// app/LandingPageClient.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './landing.module.css'
import { set } from 'zod'

export default function LandingPageClient() {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)
  const [activeButton, setActiveButton] = useState<string | null>(null)
  const [displayText, setDisplayText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [showSubtitle, setShowSubtitle] = useState(false)
  const fullText = 'Find Trusted Workers'


  // Typewriter effect
  useEffect(() => {
    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(interval)
        setShowCursor(false)
        setTimeout(() => setShowSubtitle(true), 200)
      }
    }, 80)

    return () => clearInterval(interval)
  }, [])

  const handleButtonClick = (buttonId: string, href: string) => {
    setActiveButton(buttonId)
    setTimeout(() => {
      window.location.href = href
    }, 1200)
  }

  return (
    <div className={styles.container}>
      {/* Floating background elements */}
      <div className={styles.blob1}></div>
      <div className={styles.blob2}></div>
      <div className={styles.blob3}></div>

      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navContent}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <svg className={styles.logoSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className={styles.logoText}>WorkLink</span>
          </Link>
          <div className={styles.navButtons}>
            <Link href="/auth/login" className={styles.navLogin}>
              Login
            </Link>
            <Link href="/auth/signup" className={styles.navSignup}>
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className={styles.main}>
        {/* Typewriter heading */}
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>
            {displayText}
            {showCursor && <span className={styles.cursor}>|</span>}
          </h1>
          {showSubtitle && (
            <h2 className={styles.heroSubtitle}>
              Near You, Today
            </h2>
          )}
          <p className={styles.heroDescription}>
            Connect with skilled workers in South Africa. Get help with gardening, cleaning, plumbing, and more. Available now.
          </p>
        </div>

        {/* Main CTA Buttons */}
        <div className={styles.ctaButtons}>
          {/* Browse Workers Button */}
          <div className={styles.buttonWrapper}>
            <button
              onMouseEnter={() => setHoveredButton('browse')}
              onMouseLeave={() => setHoveredButton(null)}
              onClick={() => handleButtonClick('browse', '/browse')}
              disabled={activeButton !== null}
              className={`${styles.ctaButton} ${styles.ctaPrimary} ${activeButton === 'browse' ? styles.ctaActive : ''}`}
            >
              {activeButton === 'browse' && <span className={styles.fillAnimation}></span>}
              <span className={styles.buttonContent}>
                {activeButton === 'browse' ? (
                  <>
                    <svg className={styles.spinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className={styles.spinnerCircle} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className={styles.spinnerPath} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </>
                ) : (
                  <>
                    Browse Workers
                    <svg className={styles.arrow} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </span>
              <div className={styles.buttonShadow}></div>
            </button>

            {hoveredButton === 'browse' && activeButton === null && (
              <div className={styles.tooltip}>
                <div className={styles.tooltipArrow}></div>
                <div className={styles.tooltipContent}>
                  <svg className={styles.tooltipIcon} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>View available workers in your area and contact them directly via WhatsApp or phone</span>
                </div>
              </div>
            )}
          </div>

          {/* Worker Button */}
          <div className={styles.buttonWrapper}>
            <button
              onMouseEnter={() => setHoveredButton('worker')}
              onMouseLeave={() => setHoveredButton(null)}
              onClick={() => handleButtonClick('worker', '/auth/signup')}
              disabled={activeButton !== null}
              className={`${styles.ctaButton} ${styles.ctaSecondary} ${activeButton === 'worker' ? styles.ctaActive : ''}`}
            >
              {activeButton === 'worker' && <span className={styles.fillAnimation}></span>}
              <span className={styles.buttonContent}>
                {activeButton === 'worker' ? (
                  <>
                    <svg className={styles.spinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className={styles.spinnerCircle} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className={styles.spinnerPath} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </>
                ) : (
                  "I'm a Worker"
                )}
              </span>
              <div className={styles.buttonShadow}></div>
            </button>

            {hoveredButton === 'worker' && activeButton === null && (
              <div className={styles.tooltip}>
                <div className={styles.tooltipArrow}></div>
                <div className={styles.tooltipContent}>
                  <svg className={styles.tooltipIcon} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>Create your profile, showcase your skills, and connect with clients looking for your services</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className={styles.features}>
          <div className={styles.featureCard}>
            <div className={styles.featureCardShadow}></div>
            <div className={styles.featureCardContent}>
              <div className={styles.featureIcon}>
                <svg className={styles.featureSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Available Today</h3>
              <p className={styles.featureDescription}>
                See which workers are free right now. No waiting, no scheduling hassles.
              </p>
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureCardShadow}></div>
            <div className={styles.featureCardContent}>
              <div className={styles.featureIcon}>
                <svg className={styles.featureSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Local Workers</h3>
              <p className={styles.featureDescription}>
                Find trusted workers in your area. Support your local community.
              </p>
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureCardShadow}></div>
            <div className={styles.featureCardContent}>
              <div className={styles.featureIcon}>
                <svg className={styles.featureSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Verified & Rated</h3>
              <p className={styles.featureDescription}>
                Read reviews from real clients. Hire with confidence.
              </p>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className={styles.howItWorks}>
          <h3 className={styles.sectionTitle}>How It Works</h3>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>
                <div className={styles.stepNumberShadow}></div>
                <div className={styles.stepNumberCircle}>1</div>
              </div>
              <h4 className={styles.stepTitle}>Sign Up</h4>
              <p className={styles.stepDescription}>Create your free account in seconds</p>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>
                <div className={styles.stepNumberShadow}></div>
                <div className={styles.stepNumberCircle}>2</div>
              </div>
              <h4 className={styles.stepTitle}>Search</h4>
              <p className={styles.stepDescription}>Find workers available in your area</p>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>
                <div className={styles.stepNumberShadow}></div>
                <div className={styles.stepNumberCircle}>3</div>
              </div>
              <h4 className={styles.stepTitle}>Connect</h4>
              <p className={styles.stepDescription}>Contact via WhatsApp or phone</p>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>
                <div className={styles.stepNumberShadow}></div>
                <div className={styles.stepNumberCircle}>4</div>
              </div>
              <h4 className={styles.stepTitle}>Get It Done</h4>
              <p className={styles.stepDescription}>Work completed, leave a review</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className={styles.finalCta}>
          <div className={styles.finalCtaShadow}></div>
          <div className={styles.finalCtaContent}>
            <h3 className={styles.finalCtaTitle}>Ready to get started?</h3>
            <p className={styles.finalCtaDescription}>
              Join thousands of South Africans connecting with trusted workers every day.
            </p>
            <Link href="/auth/signup" className={styles.finalCtaButton}>
              Create Free Account
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>&copy; 2025 WorkLink SA. All rights reserved.</p>
      </footer>
    </div>
  )
}