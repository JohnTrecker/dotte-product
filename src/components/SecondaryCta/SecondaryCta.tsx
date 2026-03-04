import styles from './SecondaryCta.module.css'

const avatarLetters = ['JM', 'SR', 'DK', 'AP', 'TW']

export default function SecondaryCta() {
  return (
    <section className={`section ${styles.secondaryCta}`} id="cta">
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.avatarRow} aria-hidden="true">
            <div className={styles.avatars}>
              {avatarLetters.map((initials) => (
                <div key={initials} className={styles.avatar}>
                  {initials}
                </div>
              ))}
            </div>
            <p className={styles.avatarLabel}>
              <strong>47 operators</strong> already on the early access list
            </p>
          </div>

          <div className={styles.textBlock}>
            <p className="section-label">Limited Early Access</p>
            <h2 className={styles.ctaTitle}>
              Don&apos;t Let Another
              <br />
              Shift Slip By
            </h2>
            <div className="divider" />
            <p className={styles.ctaBody}>
              We&apos;re onboarding a limited cohort of manufacturers for our
              pilot program. Early partners get dedicated onboarding support,
              model customization, and preferred pricing — locked in before
              general availability.
            </p>
          </div>

          <div className={styles.actions}>
            <a href="#hero" className="btn-primary">
              Secure Your Spot
            </a>
            <a href="mailto:hello@dotte.ai" className="btn-outline">
              Talk to Sales
            </a>
          </div>

          <ul className={styles.perks} role="list">
            <li className={styles.perk}>
              <span className={styles.checkmark} aria-hidden="true">—</span>
              Dedicated onboarding engineer
            </li>
            <li className={styles.perk}>
              <span className={styles.checkmark} aria-hidden="true">—</span>
              Custom defect model training
            </li>
            <li className={styles.perk}>
              <span className={styles.checkmark} aria-hidden="true">—</span>
              Pilot pricing locked for 24 months
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
