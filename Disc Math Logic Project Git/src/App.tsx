import { useState } from 'react'
import {
  CluePanel,
  ControlBar,
  HelpCard,
  ModeSelector,
  PuzzleHeader,
  StatusPanel,
  TruthTableCard,
  VariablePanel,
} from './components'
import {
  MODE_OPTIONS,
  createPuzzle,
  evaluateExpression,
  getAssignmentKey,
  type Assignment,
  type Puzzle,
  type PuzzleMode,
} from './lib'
import './App.css'

const initialMode: PuzzleMode = 'challenge'
const initialPuzzle = createPuzzle(initialMode)

const createFreshState = (nextPuzzle: Puzzle) => ({
  assignment: nextPuzzle.starterAssignment,
  revealedSolutionKey: null as string | null,
})

function App() {
  const [mode, setMode] = useState<PuzzleMode>(initialMode)
  const [puzzle, setPuzzle] = useState<Puzzle>(initialPuzzle)
  const [assignment, setAssignment] = useState<Assignment>(
    initialPuzzle.starterAssignment,
  )
  const [showTruthTable, setShowTruthTable] = useState(true)
  const [revealedSolutionKey, setRevealedSolutionKey] = useState<string | null>(
    null,
  )

  const clueResults = puzzle.clues.map((clue) =>
    evaluateExpression(clue.expression, assignment),
  )
  const satisfiedCount = clueResults.filter(Boolean).length
  const isSolved = clueResults.every(Boolean)
  const failedClues = clueResults
    .map((isSatisfied, index) => (isSatisfied ? null : index + 1))
    .filter((value): value is number => value !== null)
  const currentAssignmentKey = getAssignmentKey(puzzle.variables, assignment)
  const currentRowIndex = puzzle.truthTable.findIndex(
    (row) => row.key === currentAssignmentKey,
  )
  const solutionShown = revealedSolutionKey !== null

  const setPuzzleAndReset = (nextMode: PuzzleMode, nextPuzzle: Puzzle) => {
    const freshState = createFreshState(nextPuzzle)
    setMode(nextMode)
    setPuzzle(nextPuzzle)
    setAssignment(freshState.assignment)
    setRevealedSolutionKey(freshState.revealedSolutionKey)
  }

  const handleModeChange = (nextMode: PuzzleMode) => {
    if (nextMode === mode) {
      return
    }

    setPuzzleAndReset(nextMode, createPuzzle(nextMode))
  }

  const handleGeneratePuzzle = () => {
    setPuzzleAndReset(mode, createPuzzle(mode, puzzle.blueprintKey))
  }

  const handleReset = () => {
    setAssignment(puzzle.starterAssignment)
    setRevealedSolutionKey(null)
  }

  const handleShowSolution = () => {
    if (!puzzle.isSatisfiable) {
      setRevealedSolutionKey(null)
      return
    }

    const solution = puzzle.solutions[0]
    setAssignment(solution)
    setRevealedSolutionKey(getAssignmentKey(puzzle.variables, solution))
    setShowTruthTable(true)
  }

  const handleAssignmentChange = (variable: string, value: boolean) => {
    setAssignment((currentAssignment) => ({
      ...currentAssignment,
      [variable]: value,
    }))
  }

  const activeMode = MODE_OPTIONS.find((option) => option.value === mode)

  return (
    <div className="app-shell">
      <PuzzleHeader
        mode={mode}
        modeDescription={activeMode?.description ?? ''}
        puzzle={puzzle}
        isSolved={isSolved}
        satisfiedCount={satisfiedCount}
      />

      <section className="toolbar-card card">
        <ModeSelector modes={MODE_OPTIONS} selectedMode={mode} onChange={handleModeChange} />
        <ControlBar
          isTruthTableVisible={showTruthTable}
          onGeneratePuzzle={handleGeneratePuzzle}
          onReset={handleReset}
          onRevealSolution={handleShowSolution}
          onToggleTruthTable={() => setShowTruthTable((value) => !value)}
        />
      </section>

      <main className="workspace-grid">
        <VariablePanel
          assignment={assignment}
          variables={puzzle.variables}
          onAssignmentChange={handleAssignmentChange}
        />
        <CluePanel clues={puzzle.clues} clueResults={clueResults} />
        <StatusPanel
          currentAssignment={assignment}
          currentRowIndex={currentRowIndex}
          failedClues={failedClues}
          hasShownSolution={solutionShown}
          isSolved={isSolved}
          puzzle={puzzle}
          revealedSolutionKey={revealedSolutionKey}
          satisfiedCount={satisfiedCount}
          currentAssignmentKey={currentAssignmentKey}
        />
      </main>

      <TruthTableCard
        clues={puzzle.clues}
        currentAssignmentKey={currentAssignmentKey}
        isVisible={showTruthTable}
        onToggleVisibility={() => setShowTruthTable((value) => !value)}
        revealedSolutionKey={revealedSolutionKey}
        rows={puzzle.truthTable}
        variables={puzzle.variables}
      />

      <HelpCard />
    </div>
  )
}

export default App
