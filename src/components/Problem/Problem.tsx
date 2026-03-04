import styles from './Problem.module.css'

const problems = [
  {
    id: '01',
    title: 'Defects Caught Too Late',
    body: 'End-of-line inspection catches failures after hours of value has been added. A single bad part can invalidate an entire batch by the time it surfaces.',
    stat: '72%',
    statLabel: 'of defects discovered downstream',
  },
  {
    id: '02',
    title: 'Inconsistent Human Inspection',
    body: 'Visual inspection accuracy degrades over an 8-hour shift. Fatigue, lighting variation, and subjective judgment introduce unpredictable escape rates.',
    stat: '23%',
    statLabel: 'average human inspection error rate',
  },
  {
    id: '03',
    title: 'Reactive, Not Preventive',
    body: 'Scrap reports tell you what went wrong yesterday. Without real-time feedback, process drift compounds invisibly until a costly rework event forces action.',
    stat: '$50K+',
    statLabel: 'median cost per recall or rework event',
  },
]

export default function Problem() {
  return (
    <section className={`section ${styles.problem}`} id="problem">
      <div className="container">
        <div className={styles.header}>
          <p className="section-label">The Problem</p>
          <h2 className="section-title">
            Your Current Process
            <br />
            Is Hemorrhaging Margin
          </h2>
          <div className="divider" />
          <p className={styles.intro}>
            High-volume manufacturing runs on tight tolerances. The moment a
            defect escapes the line, the cost compounds — scrap, rework, recall
            risk, and customer trust eroded.
          </p>
        </div>

        <ul className={styles.cards} role="list">
          {problems.map((p) => (
            <li key={p.id} className={`reveal ${styles.card}`}>
              <span className={styles.cardId}>{p.id}</span>
              <div className={styles.cardStat}>
                <span className={styles.statValue}>{p.stat}</span>
                <span className={styles.statLabel}>{p.statLabel}</span>
              </div>
              <h3 className={styles.cardTitle}>{p.title}</h3>
              <p className={styles.cardBody}>{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
