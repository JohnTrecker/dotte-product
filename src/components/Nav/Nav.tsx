'use client'

import { useEffect, useState } from 'react'
import styles from './Nav.module.css'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { href: '#problem', label: 'Problem' },
    { href: '#solution', label: 'Solution' },
    { href: '#proof', label: 'Results' },
    { href: '#how-it-works', label: 'How It Works' },
  ]

  return (
    <header
      className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}
      role="banner"
    >
      <nav className={`container ${styles.nav}`} aria-label="Main navigation">
        <a href="#hero" className={styles.logo} aria-label="Dotte Product home">
          <span className={styles.logoMark} aria-hidden="true">●</span>
          <span className={styles.logoText}>DOTTE PRODUCT</span>
        </a>

        <ul className={`${styles.links} ${menuOpen ? styles.open : ''}`} role="list">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className={styles.link}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            </li>
          ))}
          <li>
            <a href="#hero" className={`btn-primary ${styles.ctaLink}`}>
              Get Early Access
            </a>
          </li>
        </ul>

        <button
          className={styles.menuToggle}
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen : ''}`} />
        </button>
      </nav>
    </header>
  )
}
