import { CheckCircle2, CircleDot, SearchSlash } from 'lucide-react'
import { formatAssignment, type Assignment, type Puzzle } from '../lib'

interface StatusPanelProps {
  currentAssignment: Assignment
  currentAssignmentKey: string
  currentRowIndex: number
  failedClues: number[]
  hasShownSolution: boolean
  isSolved: boolean
  puzzle: Puzzle
  revealedSolutionKey: string | null
  satisfiedCount: number
}

const joinRuleLabels = (failedClues: number[]) => {
  if (failedClues.length === 0) {
    return 'none'
  }

  if (failedClues.length === 1) {
    return `clue ${failedClues[0]}`
  }

  const allButLast = failedClues.slice(0, -1).join(', ')
  const last = failedClues.at(-1)
  return `clues ${allButLast}, and ${last}`
}

export function StatusPanel({
  currentAssignment,
  currentAssignmentKey,
  currentRowIndex,
  failedClues,
  hasShownSolution,
  isSolved,
  puzzle,
  revealedSolutionKey,
  satisfiedCount,
}: StatusPanelProps) {
  let title = 'Keep refining the assignment'
  let toneClass = 'tone-warning'
  let icon = <CircleDot size={18} />
  let message = `The current setting breaks ${joinRuleLabels(failedClues)}.`

  if (!puzzle.isSatisfiable) {
    title = 'Contradictory puzzle'
    toneClass = 'tone-danger'
    icon = <SearchSlash size={18} />
    message =
      'No truth assignment can satisfy every clue. Use the truth table to see why each row fails.'
  } else if (isSolved) {
    title = 'Puzzle solved'
    toneClass = 'tone-success'
    icon = <CheckCircle2 size={18} />
    message = 'This assignment satisfies all clues.'
  } else if (hasShownSolution && revealedSolutionKey === currentAssignmentKey) {
    title = 'Solution revealed'
    toneClass = 'tone-success'
    icon = <CheckCircle2 size={18} />
    message = 'A valid satisfying assignment is now loaded in the controls.'
  } else if (hasShownSolution && revealedSolutionKey !== currentAssignmentKey) {
    title = 'Solution highlighted'
    toneClass = 'tone-info'
    icon = <CheckCircle2 size={18} />
    message = 'A valid solution remains highlighted in the truth table while you keep exploring.'
  }

  return (
    <section className="card panel-card status-panel">
      <div className="panel-heading">
        <p className="eyebrow">Live Evaluation</p>
        <h2>See what your assignment means</h2>
        <p className="panel-copy">
          The solver checks the current row instantly and compares it against the full
          puzzle.
        </p>
      </div>

      <div className={`status-callout ${toneClass}`}>
        <div className="status-callout-title">
          {icon}
          <span>{title}</span>
        </div>
        <p>{message}</p>
      </div>

      <div className="status-progress">
        <div className="status-progress-copy">
          <span>Clues satisfied</span>
          <strong>
            {satisfiedCount} / {puzzle.clues.length}
          </strong>
        </div>
        <div className="status-progress-bar" aria-hidden="true">
          <span
            style={{
              width: `${(satisfiedCount / puzzle.clues.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <dl className="metric-grid">
        <div className="metric-card">
          <dt>Satisfying rows</dt>
          <dd>
            {puzzle.solutions.length} / {puzzle.truthTable.length}
          </dd>
        </div>
        <div className="metric-card">
          <dt>Current row</dt>
          <dd>
            {currentRowIndex + 1} / {puzzle.truthTable.length}
          </dd>
        </div>
        <div className="metric-card">
          <dt>Puzzle state</dt>
          <dd>{puzzle.isSatisfiable ? 'Satisfiable' : 'Unsatisfiable'}</dd>
        </div>
        <div className="metric-card">
          <dt>Marked solution</dt>
          <dd>{revealedSolutionKey ? 'Yes' : 'No'}</dd>
        </div>
      </dl>

      <div className="assignment-card">
        <p className="assignment-label">Current assignment</p>
        <p className="assignment-value">{formatAssignment(puzzle.variables, currentAssignment)}</p>
      </div>
    </section>
  )
}
