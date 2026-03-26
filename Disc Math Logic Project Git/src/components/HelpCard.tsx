export function HelpCard() {
  return (
    <details className="card help-card">
      <summary>
        <span>Logic Help</span>
        <span className="help-summary-copy">Quick reminders for the key operators</span>
      </summary>

      <div className="help-grid">
        <article className="help-item">
          <h3>AND</h3>
          <p>
            <span className="inline-expression">A ∧ B</span> is true only when both parts
            are true.
          </p>
        </article>
        <article className="help-item">
          <h3>OR</h3>
          <p>
            <span className="inline-expression">A ∨ B</span> is true when at least one part
            is true.
          </p>
        </article>
        <article className="help-item">
          <h3>NOT</h3>
          <p>
            <span className="inline-expression">¬A</span> flips the truth value of{' '}
            <span className="inline-expression">A</span>.
          </p>
        </article>
        <article className="help-item">
          <h3>Implication</h3>
          <p>
            <span className="inline-expression">A → B</span> is false only when{' '}
            <span className="inline-expression">A</span> is true and{' '}
            <span className="inline-expression">B</span> is false.
          </p>
        </article>
      </div>
    </details>
  )
}
