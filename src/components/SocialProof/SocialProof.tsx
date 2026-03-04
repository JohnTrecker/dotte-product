import styles from './SocialProof.module.css'

const testimonials = [
  {
    quote:
      "We were scrapping 3–5% of our output every shift. Dotte Product's inline detection caught the root cause within the first week. Scrap rate dropped to under 0.4% in 30 days.",
    name: 'Director of Operations',
    company: 'Tier 1 Automotive Supplier, Michigan',
    stat: '87%',
    statLabel: 'reduction in scrap rate',
  },
  {
    quote:
      "Our inspectors were burning out from high-volume visual checks. Dotte Product handles the classification — they handle escalations. Throughput is up 22% because we stopped bottlenecking at inspection.",
    name: 'VP of Manufacturing',
    company: 'Consumer Electronics OEM, Tennessee',
    stat: '22%',
    statLabel: 'throughput increase',
  },
  {
    quote:
      "I was skeptical about another 'AI for manufacturing' vendor. Dotte Product had us running inference on our existing line cameras in two weeks. No new hardware, no long integration project.",
    name: 'Plant Manager',
    company: 'Precision Metal Fabrication, Ohio',
    stat: '2 weeks',
    statLabel: 'time to first inference',
  },
]

export default function SocialProof() {
  return (
    <section className={`section ${styles.socialProof}`} id="proof">
      <div className="container">
        <div className={styles.header}>
          <p className="section-label">Results</p>
          <h2 className="section-title">
            Results From
            <br />
            The Floor
          </h2>
          <div className="divider" />
        </div>

        <ul className={styles.grid} role="list">
          {testimonials.map((t, i) => (
            <li key={i} className={`reveal ${styles.card}`}>
              <div className={styles.statBlock}>
                <span className={styles.statValue}>{t.stat}</span>
                <span className={styles.statLabel}>{t.statLabel}</span>
              </div>
              <blockquote className={styles.quote}>
                <p>&ldquo;{t.quote}&rdquo;</p>
              </blockquote>
              <footer className={styles.attribution}>
                <span className={styles.name}>{t.name}</span>
                <span className={styles.company}>{t.company}</span>
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
