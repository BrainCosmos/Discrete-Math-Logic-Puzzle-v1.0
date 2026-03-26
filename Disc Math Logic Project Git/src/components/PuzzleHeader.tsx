import { Sparkles, TriangleAlert } from 'lucide-react'
import { getModeLabel, type Puzzle, type PuzzleMode } from '../lib'

interface PuzzleHeaderProps {
  mode: PuzzleMode
  modeDescription: string
  puzzle: Puzzle
  isSolved: boolean
  satisfiedCount: number
}

export function PuzzleHeader({
  mode,
  modeDescription,
  puzzle,
  isSolved,
  satisfiedCount,
}: PuzzleHeaderProps) {
  return (
    <header className="hero-card card">
      <div className="hero-copy">
        <p className="eyebrow">Logic Puzzle Solver</p>
        <h1>Assign truth values to satisfy every logical clue.</h1>
        <p className="hero-subtitle">
          A browser-based discrete mathematics puzzle lab for practicing
          satisfiability, contradiction, implication, and truth-table reasoning.
        </p>
        <p className="creator-credit">Creator credit: Mathieu Spinelli</p>
      </div>

      <div className="hero-meta">
        <article className="meta-card">
          <div className="meta-card-label">
            <Sparkles size={16} />
            <span>Current Puzzle</span>
          </div>
          <h2>{puzzle.title}</h2>
          <p>{puzzle.summary}</p>
        </article>

        <article className="meta-card emphasis">
          <div className="meta-card-label">
            <TriangleAlert size={16} />
            <span>Status</span>
          </div>
          <div className="meta-chip-row">
            <span className="meta-chip">{getModeLabel(mode)}</span>
            <span className={`meta-chip ${puzzle.isSatisfiable ? 'ok' : 'danger'}`}>
              {puzzle.isSatisfiable ? 'Satisfiable' : 'Impossible'}
            </span>
            <span className={`meta-chip ${isSolved ? 'ok' : 'warning'}`}>
              {isSolved ? 'Solved' : `${satisfiedCount}/${puzzle.clues.length} clues`}
            </span>
          </div>
          <p>{modeDescription}</p>
        </article>
      </div>
    </header>
  )
}
