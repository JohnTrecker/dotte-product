import styles from './Footer.module.css'

const currentYear = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <a href="#hero" className={styles.logo} aria-label="Dotte Product home">
              <span className={styles.logoMark} aria-hidden="true">●</span>
              <span className={styles.logoText}>DOTTE PRODUCT</span>
            </a>
            <p className={styles.tagline}>
              Vision AI for Manufacturers
            </p>
          </div>

          <nav className={styles.links} aria-label="Footer navigation">
            <div className={styles.linkGroup}>
              <span className={styles.linkGroupLabel}>Product</span>
              <a href="#problem" className={styles.link}>Problem</a>
              <a href="#solution" className={styles.link}>Solution</a>
              <a href="#how-it-works" className={styles.link}>How It Works</a>
            </div>
            <div className={styles.linkGroup}>
              <span className={styles.linkGroupLabel}>Company</span>
              <a href="mailto:hello@dotteproduct.com" className={styles.link}>Contact</a>
              <a href="mailto:careers@dotteproduct.com" className={styles.link}>Careers</a>
            </div>
          </nav>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            &copy; {currentYear} Dotte Product Inc. All rights reserved.
          </p>
          <div className={styles.legal}>
            <a href="#" className={styles.legalLink}>Privacy Policy</a>
            <a href="#" className={styles.legalLink}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
