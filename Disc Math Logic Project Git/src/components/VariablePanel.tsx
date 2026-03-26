import type { Assignment } from '../lib'

interface VariablePanelProps {
  assignment: Assignment
  variables: string[]
  onAssignmentChange: (variable: string, value: boolean) => void
}

export function VariablePanel({
  assignment,
  variables,
  onAssignmentChange,
}: VariablePanelProps) {
  return (
    <section className="card panel-card variables-panel">
      <div className="panel-heading">
        <p className="eyebrow">Variables</p>
        <h2>Set each truth value</h2>
        <p className="panel-copy">
          Toggle each proposition directly. The puzzle checks every clue as soon as a value
          changes.
        </p>
      </div>

      <div className="variable-list">
        {variables.map((variable) => {
          const currentValue = assignment[variable]

          return (
            <article key={variable} className="variable-card">
              <div>
                <p className="variable-name">{variable}</p>
                <p className="variable-state">{currentValue ? 'True' : 'False'}</p>
              </div>

              <div
                className="segmented-control"
                role="group"
                aria-label={`Set truth value for ${variable}`}
              >
                <button
                  className={currentValue ? 'is-selected' : ''}
                  onClick={() => onAssignmentChange(variable, true)}
                  type="button"
                >
                  True
                </button>
                <button
                  className={!currentValue ? 'is-selected is-false' : 'is-false'}
                  onClick={() => onAssignmentChange(variable, false)}
                  type="button"
                >
                  False
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
