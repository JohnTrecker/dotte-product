import styles from './Transformation.module.css'

const stages = [
  {
    phase: '01',
    title: 'Connect',
    duration: 'Day 1–3',
    description:
      'We connect to your existing line cameras — IP cameras, GigE vision, USB — no new hardware required in most deployments.',
    detail: 'Supports RTSP, ONVIF, GenICam protocols',
  },
  {
    phase: '02',
    title: 'Train',
    duration: 'Day 3–10',
    description:
      'Our team annotates defect examples from your actual production samples. The model learns your specific tolerances, not generic benchmarks.',
    detail: 'Minimum 200 labeled samples per class',
  },
  {
    phase: '03',
    title: 'Deploy',
    duration: 'Day 10–14',
    description:
      'Inference runs on-premises on an edge compute node we provision. Latency under 100ms. No cloud dependency for production.',
    detail: 'Edge-first, cloud sync for dashboards',
  },
  {
    phase: '04',
    title: 'Improve',
    duration: 'Ongoing',
    description:
      "Every false positive and missed defect feeds back into model retraining. The system's accuracy improves continuously on your line's real-world distribution.",
    detail: 'Active learning pipeline, weekly model updates',
  },
]

export default function Transformation() {
  return (
    <section className={`section ${styles.transformation}`} id="how-it-works">
      <div className="container">
        <div className={styles.header}>
          <p className="section-label">How It Works</p>
          <h2 className="section-title">
            From Camera Feed
            <br />
            To Closed Loop
          </h2>
          <div className="divider" />
          <p className={styles.intro}>
            Dotte Product is designed to be operational in weeks, not months. No
            lengthy system integration project. No ripping out existing
            infrastructure.
          </p>
        </div>

        <ol className={styles.timeline} role="list">
          {stages.map((stage, index) => (
            <li key={stage.phase} className={`reveal ${styles.stage}`}>
              <div className={styles.stageNumber}>
                <span className={styles.phaseLabel}>{stage.phase}</span>
                {index < stages.length - 1 && (
                  <div className={styles.connector} aria-hidden="true" />
                )}
              </div>
              <div className={styles.stageContent}>
                <div className={styles.stageMeta}>
                  <h3 className={styles.stageTitle}>{stage.title}</h3>
                  <span className={styles.stageDuration}>{stage.duration}</span>
                </div>
                <p className={styles.stageDesc}>{stage.description}</p>
                <span className={styles.stageDetail}>{stage.detail}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
