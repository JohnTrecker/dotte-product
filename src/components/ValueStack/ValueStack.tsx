'use client'

import { useState } from 'react'
import styles from './ValueStack.module.css'

const rows = [
  {
    feature: 'Detection latency',
    before: '8–24 hrs (end of line)',
    after: '< 100 ms (inline, real-time)',
  },
  {
    feature: 'Inspection consistency',
    before: 'Variable — depends on operator',
    after: '99.97% repeatability',
  },
  {
    feature: 'Defect classification',
    before: 'Manual, single-category',
    after: 'Multi-class CV model, auto-labeled',
  },
  {
    feature: 'Integration',
    before: 'Siloed inspection station',
    after: 'MES / SCADA data feed',
  },
  {
    feature: 'Deployment time',
    before: '6–18 months (legacy systems)',
    after: 'Weeks on existing hardware',
  },
  {
    feature: 'Cost per inspection point',
    before: 'High OpEx (headcount)',
    after: 'Fixed SaaS, scales to $0 marginal',
  },
]

export default function ValueStack() {
  const [showAfter, setShowAfter] = useState(true)

  return (
    <section className={`section ${styles.valueStack}`} id="solution">
      <div className="container">
        <div className={styles.headerRow}>
          <div className={styles.headerText}>
            <p className="section-label">The Solution</p>
            <h2 className="section-title">
              Before Dotte.
              <br />
              After Dotte.
            </h2>
            <div className="divider" />
          </div>

          <div className={styles.toggle} role="group" aria-label="View mode">
            <button
              className={`${styles.toggleBtn} ${!showAfter ? styles.active : ''}`}
              onClick={() => setShowAfter(false)}
              aria-pressed={!showAfter}
            >
              Before
            </button>
            <button
              className={`${styles.toggleBtn} ${showAfter ? styles.active : ''}`}
              onClick={() => setShowAfter(true)}
              aria-pressed={showAfter}
            >
              After
            </button>
          </div>
        </div>

        <div className={styles.tableWrapper} role="region" aria-label="Comparison table">
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.thFeature}>Feature</th>
                <th
                  className={`${styles.th} ${!showAfter ? styles.thHighlight : ''}`}
                >
                  Before Dotte
                </th>
                <th
                  className={`${styles.th} ${showAfter ? styles.thHighlight : ''}`}
                >
                  After Dotte
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.feature} className={styles.row}>
                  <td className={styles.tdFeature}>{row.feature}</td>
                  <td
                    className={`${styles.td} ${!showAfter ? styles.tdHighlight : styles.tdDim}`}
                  >
                    {!showAfter ? (
                      <span className={styles.badBefore}>{row.before}</span>
                    ) : (
                      row.before
                    )}
                  </td>
                  <td
                    className={`${styles.td} ${showAfter ? styles.tdHighlight : styles.tdDim}`}
                  >
                    {showAfter ? (
                      <span className={styles.goodAfter}>{row.after}</span>
                    ) : (
                      row.after
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
