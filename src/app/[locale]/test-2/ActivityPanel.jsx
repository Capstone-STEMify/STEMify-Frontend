import { useState } from 'react'

export default function ActivityPanel({ activities }) {
  const [stepIndex, setStepIndex] = useState(0)
  const steps = activities[0].steps

  const current = steps[stepIndex]

  return (
    <div style={{ position: 'absolute', top: 20, left: 20, background: 'white', padding: 12, borderRadius: 8 }}>
      <h3>{current.title}</h3>
      <p>{current.description}</p>
      <ul>
        {current.hints?.map((hint, i) => (
          <li key={i}>{hint}</li>
        ))}
      </ul>
      <button disabled={stepIndex === 0} onClick={() => setStepIndex((s) => s - 1)}>
        ◀
      </button>
      <button disabled={stepIndex === steps.length - 1} onClick={() => setStepIndex((s) => s + 1)}>
        ▶
      </button>
    </div>
  )
}
