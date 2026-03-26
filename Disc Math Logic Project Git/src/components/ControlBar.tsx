import { Eye, RefreshCcw, Shuffle, TableProperties } from 'lucide-react'

interface ControlBarProps {
  isTruthTableVisible: boolean
  onGeneratePuzzle: () => void
  onReset: () => void
  onRevealSolution: () => void
  onToggleTruthTable: () => void
}

export function ControlBar({
  isTruthTableVisible,
  onGeneratePuzzle,
  onReset,
  onRevealSolution,
  onToggleTruthTable,
}: ControlBarProps) {
  return (
    <div className="control-bar">
      <button className="primary-button" onClick={onGeneratePuzzle} type="button">
        <Shuffle size={16} />
        Generate New Puzzle
      </button>
      <button className="secondary-button" onClick={onReset} type="button">
        <RefreshCcw size={16} />
        Reset
      </button>
      <button className="secondary-button" onClick={onRevealSolution} type="button">
        <Eye size={16} />
        Show Solution
      </button>
      <button className="secondary-button" onClick={onToggleTruthTable} type="button">
        <TableProperties size={16} />
        {isTruthTableVisible ? 'Hide Truth Table' : 'Show Truth Table'}
      </button>
    </div>
  )
}
