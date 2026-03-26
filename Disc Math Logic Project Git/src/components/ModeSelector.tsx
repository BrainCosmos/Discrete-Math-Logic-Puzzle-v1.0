import type { PuzzleMode } from '../lib'

interface ModeOption {
  value: PuzzleMode
  label: string
  description: string
}

interface ModeSelectorProps {
  modes: ModeOption[]
  selectedMode: PuzzleMode
  onChange: (mode: PuzzleMode) => void
}

export function ModeSelector({
  modes,
  selectedMode,
  onChange,
}: ModeSelectorProps) {
  return (
    <div className="mode-selector">
      <div className="mode-selector-copy">
        <p className="eyebrow">Game Mode</p>
        <h2>Choose the puzzle style</h2>
      </div>

      <div className="mode-chip-row" role="tablist" aria-label="Puzzle mode selector">
        {modes.map((mode) => (
          <button
            key={mode.value}
            aria-selected={selectedMode === mode.value}
            className={`mode-chip ${selectedMode === mode.value ? 'is-selected' : ''}`}
            onClick={() => onChange(mode.value)}
            role="tab"
            type="button"
          >
            <span>{mode.label}</span>
            <small>{mode.description}</small>
          </button>
        ))}
      </div>
    </div>
  )
}
