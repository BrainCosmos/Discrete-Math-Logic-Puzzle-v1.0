# Logic Puzzle Solver

Interactive browser-based learning game for propositional logic.

Creator credit: Mathieu Spinelli

## Overview

Logic Puzzle Solver lets a player assign truth values to variables and test whether a set of logical clues can all be satisfied at once. The app is designed as a polished class-project demo for discrete mathematics topics such as:

- propositional logic
- conjunction, disjunction, negation, and implication
- contradictions and unsatisfiable puzzles
- satisfiable assignments
- truth table interpretation

The interface is organized into a header, a control area, a three-panel puzzle workspace, a truth table visualizer, and a compact help section.

## Stack

- React 19
- Vite
- TypeScript
- CSS with custom component styling
- `lucide-react` for a small set of interface icons

## Run Locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite in your browser.

## Other Commands

```bash
npm run build
npm run lint
```

## Core Features

- Practice, Challenge, and Impossible modes
- Truth-value toggles for each variable
- Live clue evaluation with satisfied/failed states
- Puzzle status panel with contradiction and solved feedback
- New puzzle generation
- Reset for the current puzzle
- Truth table visualizer with highlighted satisfying rows
- Show Solution support when a satisfying assignment exists
- Clear impossible-mode messaging when no solution exists

## Architecture

Main files:

- `src/App.tsx`
  Coordinates app state, mode changes, assignment changes, and shared puzzle actions.
- `src/lib/logic.ts`
  Defines logical expressions, evaluates them, formats them for display, and generates truth tables by brute force.
- `src/lib/puzzles.ts`
  Stores curated puzzle blueprints for each mode and turns them into playable puzzles.
- `src/components/*`
  Contains focused UI pieces for the header, variable controls, clue list, status panel, truth table, help card, and control bar.

## How Puzzle Generation Works

Puzzle generation is intentionally structured rather than fully random.

- Each mode pulls from a curated set of puzzle blueprints.
- Blueprints are designed to stay readable and educational.
- Practice mode uses smaller clue sets with 2-3 variables.
- Challenge mode uses more involved implication chains and conjunctions with 4-6 clues.
- Impossible mode uses intentionally contradictory clue sets.
- `Generate New Puzzle` selects a different blueprint from the active mode when possible.

This keeps the puzzles understandable while still giving variety during demos.

## How Satisfiability Is Checked

The app uses a brute-force satisfiability check, which is reliable here because puzzle sizes stay small.

- All truth assignments are enumerated for the current variables.
- Every clue is evaluated for every assignment.
- Rows where all clues are true are stored as satisfying assignments.
- If no satisfying row exists, the puzzle is marked unsatisfiable.
- The same computed rows power the truth table, status panel, and Show Solution feature.

Because the largest puzzle uses only five variables, the full search is fast and practical.

## Future Expansion Ideas

- Add biconditional or XOR clue types
- Add student score tracking or puzzle streaks
- Let instructors author custom clue sets from a simple editor
- Add explanation mode showing why a row fails
- Add progressively unlocked lesson levels

## Verification

The project was verified with:

- `npm run build`
- `npm run lint`

The puzzle generator was also exercised across every stored blueprint to confirm that practice and challenge puzzles are satisfiable and impossible-mode puzzles are truly contradictory.
