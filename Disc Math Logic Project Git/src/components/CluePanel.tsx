import { CheckCircle2, XCircle } from 'lucide-react'
import { expressionToString, type Clue } from '../lib'

interface CluePanelProps {
  clues: Clue[]
  clueResults: boolean[]
}

export function CluePanel({ clues, clueResults }: CluePanelProps) {
  return (
    <section className="card panel-card clues-panel">
      <div className="panel-heading">
        <p className="eyebrow">Puzzle Clues</p>
        <h2>Test each statement live</h2>
        <p className="panel-copy">
          Every clue updates immediately as you flip the truth values.
        </p>
      </div>

      <ol className="clue-list">
        {clues.map((clue, index) => {
          const isSatisfied = clueResults[index]

          return (
            <li
              key={clue.id}
              className={`clue-card ${isSatisfied ? 'is-satisfied' : 'is-failed'}`}
              title={clue.hint}
            >
              <div className="clue-card-header">
                <span className="rule-label">Rule {index + 1}</span>
                <span className={`status-chip ${isSatisfied ? 'status-good' : 'status-bad'}`}>
                  {isSatisfied ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  {isSatisfied ? 'Satisfied' : 'Failed'}
                </span>
              </div>
              <p className="logic-expression">{expressionToString(clue.expression)}</p>
              <p className="clue-hint">{clue.hint}</p>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
