import {
  analyzePuzzle,
  and,
  createDefaultAssignment,
  implies,
  not,
  or,
  variable,
  type Clue,
  type Expression,
  type Puzzle,
  type PuzzleMode,
} from './logic'

interface ModeOption {
  value: PuzzleMode
  label: string
  description: string
}

interface BlueprintClue {
  expression: Expression
  hint: string
}

interface PuzzleBlueprint {
  key: string
  expectation: 'satisfiable' | 'unsatisfiable'
  clues: BlueprintClue[]
  mode: PuzzleMode
  summary: string
  title: string
  variableCount: number
}

const A = variable('A')
const B = variable('B')
const C = variable('C')
const D = variable('D')
const E = variable('E')

export const MODE_OPTIONS: ModeOption[] = [
  {
    value: 'practice',
    label: 'Practice',
    description: '2-3 variables and quick warm-up clues.',
  },
  {
    value: 'challenge',
    label: 'Challenge',
    description: 'Moderate multi-step puzzles with deeper interactions.',
  },
  {
    value: 'impossible',
    label: 'Impossible',
    description: 'Contradictory clue sets with no satisfying assignment.',
  },
]

const BLUEPRINTS: Record<PuzzleMode, PuzzleBlueprint[]> = {
  practice: [
    {
      key: 'practice-bridge',
      mode: 'practice',
      title: 'Bridge the implication',
      summary: 'A short implication chain with a gentle warm-up feel.',
      variableCount: 2,
      expectation: 'satisfiable',
      clues: [
        {
          expression: or(A, B),
          hint: 'At least one of A or B must be true.',
        },
        {
          expression: implies(A, B),
          hint: 'If A is true, then B must also be true.',
        },
        {
          expression: implies(not(B), A),
          hint: 'If B is false, the puzzle forces A to be true.',
        },
      ],
    },
    {
      key: 'practice-negation',
      mode: 'practice',
      title: 'Negation checkpoint',
      summary: 'Use a negation clue to pin down a unique assignment.',
      variableCount: 2,
      expectation: 'satisfiable',
      clues: [
        {
          expression: not(A),
          hint: 'A must be false.',
        },
        {
          expression: or(A, B),
          hint: 'At least one variable still has to be true.',
        },
        {
          expression: B,
          hint: 'This final clue confirms the surviving option.',
        },
      ],
    },
    {
      key: 'practice-chain',
      mode: 'practice',
      title: 'Small implication chain',
      summary: 'A straightforward three-variable puzzle with one forced truth.',
      variableCount: 3,
      expectation: 'satisfiable',
      clues: [
        {
          expression: implies(A, C),
          hint: 'Whenever A is true, C must be true as well.',
        },
        {
          expression: A,
          hint: 'A is fixed to true.',
        },
        {
          expression: or(B, C),
          hint: 'At least one of B or C must be true.',
        },
      ],
    },
    {
      key: 'practice-trigger',
      mode: 'practice',
      title: 'Triggered conjunction',
      summary: 'A conjunction only matters when both earlier clues line up.',
      variableCount: 3,
      expectation: 'satisfiable',
      clues: [
        {
          expression: implies(and(A, B), C),
          hint: 'If both A and B are true, then C must be true.',
        },
        {
          expression: A,
          hint: 'A starts out fixed to true.',
        },
        {
          expression: or(B, C),
          hint: 'Either B or C must be true.',
        },
      ],
    },
    {
      key: 'practice-elimination',
      mode: 'practice',
      title: 'Eliminate one option',
      summary: 'A small puzzle where implication and negation combine cleanly.',
      variableCount: 3,
      expectation: 'satisfiable',
      clues: [
        {
          expression: not(C),
          hint: 'C must be false.',
        },
        {
          expression: or(A, B),
          hint: 'At least one of A or B must be true.',
        },
        {
          expression: implies(A, C),
          hint: 'If A were true, it would force C to be true.',
        },
      ],
    },
  ],
  challenge: [
    {
      key: 'challenge-gated',
      mode: 'challenge',
      title: 'Gated implication',
      summary: 'Track how one implication opens another part of the puzzle.',
      variableCount: 4,
      expectation: 'satisfiable',
      clues: [
        {
          expression: implies(and(A, B), D),
          hint: 'Both A and B together would force D.',
        },
        {
          expression: or(A, C),
          hint: 'Either A or C must be true.',
        },
        {
          expression: implies(not(C), B),
          hint: 'If C is false, B has to step in.',
        },
        {
          expression: implies(D, C),
          hint: 'D can only be true when C is true.',
        },
        {
          expression: or(B, D),
          hint: 'At least one of B or D must hold.',
        },
      ],
    },
    {
      key: 'challenge-lockstep',
      mode: 'challenge',
      title: 'Lockstep chain',
      summary: 'A multi-step puzzle where one false choice triggers a whole chain.',
      variableCount: 4,
      expectation: 'satisfiable',
      clues: [
        {
          expression: implies(A, B),
          hint: 'A implies B.',
        },
        {
          expression: implies(B, D),
          hint: 'B implies D.',
        },
        {
          expression: or(C, A),
          hint: 'Either C or A must be true.',
        },
        {
          expression: implies(not(C), B),
          hint: 'If C is false, B is forced on.',
        },
        {
          expression: implies(not(D), A),
          hint: 'If D is false, the puzzle pushes you back to A.',
        },
      ],
    },
    {
      key: 'challenge-ladder',
      mode: 'challenge',
      title: 'Five-step ladder',
      summary: 'A broader puzzle with several ways to reach a satisfying row.',
      variableCount: 5,
      expectation: 'satisfiable',
      clues: [
        {
          expression: or(A, B),
          hint: 'The puzzle starts with at least one of A or B.',
        },
        {
          expression: implies(B, C),
          hint: 'If B is true, C must also be true.',
        },
        {
          expression: implies(C, D),
          hint: 'C passing on truth also forces D.',
        },
        {
          expression: implies(not(D), E),
          hint: 'If D is false, E becomes necessary.',
        },
        {
          expression: implies(and(A, E), C),
          hint: 'When A and E are both true, C must be true.',
        },
        {
          expression: or(D, E),
          hint: 'At least one of D or E must end up true.',
        },
      ],
    },
    {
      key: 'challenge-topdown',
      mode: 'challenge',
      title: 'Top-down forcing',
      summary: 'A direct clue triggers a longer implication path through the puzzle.',
      variableCount: 5,
      expectation: 'satisfiable',
      clues: [
        {
          expression: implies(or(A, B), C),
          hint: 'If either A or B is true, then C must be true.',
        },
        {
          expression: implies(C, D),
          hint: 'C implies D.',
        },
        {
          expression: implies(D, E),
          hint: 'D implies E.',
        },
        {
          expression: A,
          hint: 'A is fixed to true.',
        },
        {
          expression: or(not(B), D),
          hint: 'Either B is false, or D is true.',
        },
        {
          expression: or(E, B),
          hint: 'At least one of E or B must be true.',
        },
      ],
    },
    {
      key: 'challenge-balance',
      mode: 'challenge',
      title: 'Balance the branches',
      summary: 'One branch uses negation while the other pushes toward a conjunction.',
      variableCount: 4,
      expectation: 'satisfiable',
      clues: [
        {
          expression: or(not(A), B),
          hint: 'Either A is false, or B is true.',
        },
        {
          expression: or(B, C),
          hint: 'At least one of B or C must be true.',
        },
        {
          expression: implies(and(B, C), D),
          hint: 'If B and C are both true, then D must be true.',
        },
        {
          expression: implies(A, C),
          hint: 'A implies C.',
        },
        {
          expression: implies(not(D), A),
          hint: 'If D is false, A must be true.',
        },
      ],
    },
    {
      key: 'challenge-tension',
      mode: 'challenge',
      title: 'Tension between branches',
      summary: 'A forced true value still leaves room to reason through the remaining clues.',
      variableCount: 5,
      expectation: 'satisfiable',
      clues: [
        {
          expression: implies(and(A, not(B)), C),
          hint: 'If A is true while B is false, then C must be true.',
        },
        {
          expression: implies(C, D),
          hint: 'C implies D.',
        },
        {
          expression: or(D, E),
          hint: 'At least one of D or E must be true.',
        },
        {
          expression: implies(not(E), B),
          hint: 'If E is false, B must be true.',
        },
        {
          expression: A,
          hint: 'A is fixed to true.',
        },
        {
          expression: or(B, D),
          hint: 'At least one of B or D must be true.',
        },
      ],
    },
  ],
  impossible: [
    {
      key: 'impossible-corner',
      mode: 'impossible',
      title: 'Impossible corner',
      summary: 'A short contradiction hidden inside an implication chain.',
      variableCount: 3,
      expectation: 'unsatisfiable',
      clues: [
        {
          expression: A,
          hint: 'A is forced to true.',
        },
        {
          expression: implies(A, B),
          hint: 'If A is true, then B must also be true.',
        },
        {
          expression: not(B),
          hint: 'But this clue demands that B be false.',
        },
        {
          expression: or(C, B),
          hint: 'One final clue keeps C involved, but it cannot rescue the contradiction.',
        },
      ],
    },
    {
      key: 'impossible-split',
      mode: 'impossible',
      title: 'Split decision',
      summary: 'A simple disjunction collapses under two negation clues.',
      variableCount: 4,
      expectation: 'unsatisfiable',
      clues: [
        {
          expression: or(A, B),
          hint: 'At least one of A or B should be true.',
        },
        {
          expression: not(A),
          hint: 'A must be false.',
        },
        {
          expression: not(B),
          hint: 'B must also be false.',
        },
        {
          expression: implies(C, D),
          hint: 'This extra implication is consistent by itself, but the earlier clues already break the puzzle.',
        },
      ],
    },
    {
      key: 'impossible-trigger',
      mode: 'impossible',
      title: 'Triggered contradiction',
      summary: 'A conjunction activates an impossible requirement downstream.',
      variableCount: 4,
      expectation: 'unsatisfiable',
      clues: [
        {
          expression: implies(and(A, B), C),
          hint: 'If A and B are both true, then C must be true.',
        },
        {
          expression: A,
          hint: 'A is forced to true.',
        },
        {
          expression: B,
          hint: 'B is also forced to true.',
        },
        {
          expression: not(C),
          hint: 'But C is forced to false, creating a contradiction.',
        },
        {
          expression: or(D, A),
          hint: 'The last clue stays compatible, but the contradiction has already happened.',
        },
      ],
    },
    {
      key: 'impossible-ladder',
      mode: 'impossible',
      title: 'Broken ladder',
      summary: 'A chain of implications collides with a final negation.',
      variableCount: 5,
      expectation: 'unsatisfiable',
      clues: [
        {
          expression: implies(A, B),
          hint: 'A implies B.',
        },
        {
          expression: implies(B, C),
          hint: 'B implies C.',
        },
        {
          expression: A,
          hint: 'A is forced to true.',
        },
        {
          expression: not(C),
          hint: 'C is forced to false.',
        },
        {
          expression: or(D, E),
          hint: 'At least one of D or E must be true, but that does not fix the contradiction above.',
        },
      ],
    },
    {
      key: 'impossible-cover',
      mode: 'impossible',
      title: 'No way to cover',
      summary: 'A disjunction looks promising until both options force the same conflict.',
      variableCount: 3,
      expectation: 'unsatisfiable',
      clues: [
        {
          expression: implies(A, C),
          hint: 'If A is true, then C must be true.',
        },
        {
          expression: implies(B, C),
          hint: 'If B is true, then C must also be true.',
        },
        {
          expression: or(A, B),
          hint: 'At least one of A or B has to be true.',
        },
        {
          expression: not(C),
          hint: 'But C is forced to false.',
        },
      ],
    },
  ],
}

const selectBlueprint = (
  mode: PuzzleMode,
  previousBlueprintKey?: string,
): PuzzleBlueprint => {
  const pool = BLUEPRINTS[mode]
  const filteredPool =
    pool.length > 1 && previousBlueprintKey
      ? pool.filter((blueprint) => blueprint.key !== previousBlueprintKey)
      : pool

  return filteredPool[Math.floor(Math.random() * filteredPool.length)]
}

const createClues = (blueprint: PuzzleBlueprint): Clue[] =>
  blueprint.clues.map((clue, index) => ({
    id: `${blueprint.key}-clue-${index + 1}`,
    expression: clue.expression,
    hint: clue.hint,
  }))

export const getModeLabel = (mode: PuzzleMode): string =>
  MODE_OPTIONS.find((option) => option.value === mode)?.label ?? mode

export const createPuzzle = (
  mode: PuzzleMode,
  previousBlueprintKey?: string,
): Puzzle => {
  const blueprint = selectBlueprint(mode, previousBlueprintKey)
  const variables = ['A', 'B', 'C', 'D', 'E'].slice(0, blueprint.variableCount)
  const clues = createClues(blueprint)
  const analysis = analyzePuzzle(variables, clues)

  if (
    (blueprint.expectation === 'satisfiable' && !analysis.isSatisfiable) ||
    (blueprint.expectation === 'unsatisfiable' && analysis.isSatisfiable)
  ) {
    throw new Error(`Blueprint ${blueprint.key} does not match its expected satisfiability.`)
  }

  return {
    blueprintKey: blueprint.key,
    clues,
    isSatisfiable: analysis.isSatisfiable,
    mode,
    solutions: analysis.solutions,
    starterAssignment: createDefaultAssignment(variables),
    summary: blueprint.summary,
    title: blueprint.title,
    truthTable: analysis.truthTable,
    variables,
  }
}
