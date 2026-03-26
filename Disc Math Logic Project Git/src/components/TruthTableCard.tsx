import { ChevronDown, ChevronUp } from 'lucide-react'
import { expressionToString, type Clue, type TruthTableRow } from '../lib'

interface TruthTableCardProps {
  clues: Clue[]
  currentAssignmentKey: string
  isVisible: boolean
  onToggleVisibility: () => void
  revealedSolutionKey: string | null
  rows: TruthTableRow[]
  variables: string[]
}

export function TruthTableCard({
  clues,
  currentAssignmentKey,
  isVisible,
  onToggleVisibility,
  revealedSolutionKey,
  rows,
  variables,
}: TruthTableCardProps) {
  return (
    <section className="card truth-table-card">
      <div className="truth-table-header">
        <div>
          <p className="eyebrow">Truth Table Visualizer</p>
          <h2>Compare every possible assignment</h2>
          <p className="panel-copy">
            Green rows satisfy the whole puzzle. The current row and any revealed solution
            are outlined for quick comparison.
          </p>
        </div>
        <button className="ghost-button" onClick={onToggleVisibility} type="button">
          {isVisible ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {isVisible ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {isVisible ? (
        <div className="truth-table-scroll">
          <table className="truth-table">
            <thead>
              <tr>
                <th>Row</th>
                {variables.map((variable) => (
                  <th key={variable}>{variable}</th>
                ))}
                {clues.map((clue, index) => (
                  <th key={clue.id} title={clue.hint}>
                    C{index + 1}
                    <span className="table-subhead">{expressionToString(clue.expression)}</span>
                  </th>
                ))}
                <th>Overall</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                const isCurrentRow = row.key === currentAssignmentKey
                const isSolutionRow = row.key === revealedSolutionKey

                return (
                  <tr
                    key={row.key}
                    className={[
                      row.overall ? 'row-satisfied' : 'row-unsatisfied',
                      isCurrentRow ? 'row-current' : '',
                      isSolutionRow ? 'row-solution' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <td className="row-label">
                      <span>{index + 1}</span>
                      <div className="row-badges">
                        {isCurrentRow ? <span className="table-badge current">Current</span> : null}
                        {isSolutionRow ? (
                          <span className="table-badge solution">Solution</span>
                        ) : null}
                      </div>
                    </td>
                    {variables.map((variable) => (
                      <td key={`${row.key}-${variable}`}>
                        <span className={`truth-pill ${row.assignment[variable] ? 'true' : 'false'}`}>
                          {row.assignment[variable] ? 'T' : 'F'}
                        </span>
                      </td>
                    ))}
                    {row.clueResults.map((result, resultIndex) => (
                      <td key={`${row.key}-clue-${resultIndex}`}>
                        <span className={`truth-pill ${result ? 'true' : 'false'}`}>
                          {result ? 'T' : 'F'}
                        </span>
                      </td>
                    ))}
                    <td>
                      <span className={`truth-pill ${row.overall ? 'true' : 'false'}`}>
                        {row.overall ? 'T' : 'F'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="truth-table-collapsed">
          The full truth table is hidden. Expand it to inspect all {rows.length} possible
          assignments.
        </p>
      )}
    </section>
  )
}
