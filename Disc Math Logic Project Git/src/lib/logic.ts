export type PuzzleMode = 'practice' | 'challenge' | 'impossible'

export type Assignment = Record<string, boolean>

export type Expression =
  | { kind: 'variable'; name: string }
  | { kind: 'not'; expression: Expression }
  | { kind: 'and' | 'or' | 'implies'; left: Expression; right: Expression }

export interface Clue {
  id: string
  expression: Expression
  hint: string
}

export interface TruthTableRow {
  key: string
  assignment: Assignment
  clueResults: boolean[]
  overall: boolean
}

export interface Puzzle {
  blueprintKey: string
  clues: Clue[]
  isSatisfiable: boolean
  mode: PuzzleMode
  solutions: Assignment[]
  starterAssignment: Assignment
  summary: string
  title: string
  truthTable: TruthTableRow[]
  variables: string[]
}

export const variable = (name: string): Expression => ({
  kind: 'variable',
  name,
})

export const not = (expression: Expression): Expression => ({
  kind: 'not',
  expression,
})

export const and = (left: Expression, right: Expression): Expression => ({
  kind: 'and',
  left,
  right,
})

export const or = (left: Expression, right: Expression): Expression => ({
  kind: 'or',
  left,
  right,
})

export const implies = (left: Expression, right: Expression): Expression => ({
  kind: 'implies',
  left,
  right,
})

export const evaluateExpression = (
  expression: Expression,
  assignment: Assignment,
): boolean => {
  switch (expression.kind) {
    case 'variable':
      return assignment[expression.name]
    case 'not':
      return !evaluateExpression(expression.expression, assignment)
    case 'and':
      return (
        evaluateExpression(expression.left, assignment) &&
        evaluateExpression(expression.right, assignment)
      )
    case 'or':
      return (
        evaluateExpression(expression.left, assignment) ||
        evaluateExpression(expression.right, assignment)
      )
    case 'implies':
      return (
        !evaluateExpression(expression.left, assignment) ||
        evaluateExpression(expression.right, assignment)
      )
  }
}

const formatExpressionSegment = (
  expression: Expression,
  nested: boolean,
): string => {
  switch (expression.kind) {
    case 'variable':
      return expression.name
    case 'not': {
      const value =
        expression.expression.kind === 'variable' ||
        expression.expression.kind === 'not'
          ? formatExpressionSegment(expression.expression, true)
          : `(${formatExpressionSegment(expression.expression, false)})`
      return `¬${value}`
    }
    case 'and':
    case 'or':
    case 'implies': {
      const symbol =
        expression.kind === 'and' ? '∧' : expression.kind === 'or' ? '∨' : '→'
      const value = `${formatExpressionSegment(expression.left, true)} ${symbol} ${formatExpressionSegment(expression.right, true)}`
      return nested ? `(${value})` : value
    }
  }
}

export const expressionToString = (expression: Expression): string =>
  formatExpressionSegment(expression, false)

export const createDefaultAssignment = (variables: string[]): Assignment =>
  Object.fromEntries(variables.map((variableName) => [variableName, false]))

export const getAssignmentKey = (
  variables: string[],
  assignment: Assignment,
): string =>
  variables.map((variableName) => (assignment[variableName] ? 'T' : 'F')).join('')

export const formatAssignment = (
  variables: string[],
  assignment: Assignment,
): string =>
  variables
    .map((variableName) => `${variableName} = ${assignment[variableName] ? 'T' : 'F'}`)
    .join('  ·  ')

const generateAssignments = (variables: string[]): Assignment[] => {
  const rowCount = 2 ** variables.length
  return Array.from({ length: rowCount }, (_, rowIndex) =>
    Object.fromEntries(
      variables.map((variableName, variableIndex) => {
        const bitShift = variables.length - variableIndex - 1
        return [variableName, Boolean((rowIndex >> bitShift) & 1)]
      }),
    ),
  )
}

export const analyzePuzzle = (
  variables: string[],
  clues: Clue[],
): {
  isSatisfiable: boolean
  solutions: Assignment[]
  truthTable: TruthTableRow[]
} => {
  const truthTable = generateAssignments(variables).map((assignment) => {
    const clueResults = clues.map((clue) =>
      evaluateExpression(clue.expression, assignment),
    )

    return {
      key: getAssignmentKey(variables, assignment),
      assignment,
      clueResults,
      overall: clueResults.every(Boolean),
    }
  })

  const solutions = truthTable
    .filter((row) => row.overall)
    .map((row) => row.assignment)

  return {
    isSatisfiable: solutions.length > 0,
    solutions,
    truthTable,
  }
}
