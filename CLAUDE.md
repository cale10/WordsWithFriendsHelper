# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Words With Friends Helper is a web application that analyzes a Words With Friends game board and suggests the highest-scoring word to play. The app uses a hybrid architecture with a Flask Python backend (word computation algorithm) and TypeScript frontend (UI).

## Development Commands

### Initial Setup
```bash
# Create and activate virtual environment
python -m venv venv
. venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
npm install
pip install -r requirements.txt

# Build the project
gulp
```

### Build System
```bash
# Build all source files to dist/ folder
gulp

# The build process:
# - Compiles TypeScript files with Browserify/Tsify → dist/static/scripts/bundle.js
# - Copies Python files (.py) → dist/
# - Copies templates (.html) → dist/templates/
# - Copies styles (.css) → dist/static/styles/
# - Copies assets (images) → dist/static/assets/
# - Copies dictionary (words.txt) → dist/
```

### Running the Application
```bash
# Run the Flask application (must build first)
python dist/app.py

# Then visit http://localhost:5000 in your browser
```

### Linting
```bash
# ESLint is configured with TypeScript rules
npm run lint      # Check TypeScript files for linting errors
npm run lint:fix  # Automatically fix linting errors where possible
```

## Architecture

### Backend (Python/Flask)

**Flask Routes** (src/app.py):
- `GET /` - Renders the main HTML template
- `POST /bestGameMove` - Accepts game board data, returns best word play

**Algorithm** (src/best_game_move.py):
The core algorithm is based on CMU's Scrabble algorithm paper and uses:
- **Anchors**: Empty cells adjacent to occupied cells (or center cell [7,7] on empty board)
- **Cross-checks**: Valid letters for each cell that form valid perpendicular words
- **Recursive extension**: Tries placing letters in both directions (across/down) from anchors
- **Scoring**: Accounts for letter values, multipliers (DL, TL, DW, TW), cross-words, and 35-point bonus for using all 7 tiles

Key functions:
- `compute_anchors()` - Identifies valid starting positions for words
- `compute_across_cross_checks()` / `compute_down_cross_checks()` - Determines valid letters per cell
- `extend_right()` / `extend_down()` - Recursively builds words from anchors
- `score_word_across()` / `score_word_down()` - Calculates word scores including bonuses

**Dictionary** (src/dictionary.py):
- Loads `words.txt` (172,000+ valid words) into a Python set for O(1) lookup
- Words are validated in lowercase

### Frontend (TypeScript)

The frontend uses object-oriented TypeScript classes compiled with Browserify:

**src/static/scripts/GameBoard.ts**:
- Main controller class managing the 15x15 game board and user interactions
- Handles cell selection, keyboard input, and button clicks (Clear, Go, Discard, Keep)
- Communicates with Flask backend via `computeBestMove()` → POST `/bestGameMove`
- Displays results by highlighting cells with purple borders

**src/static/scripts/Cell.ts**:
- `Cell` (abstract base class) - Represents any cell with letter/value
- `GameBoardCell` - 15x15 board cells with bonus types (DL, TL, DW, TW, start)
- `UserCell` - 7-cell letter rack at bottom of screen

**src/static/scripts/BestMove.ts**:
- Makes POST request to `/bestGameMove` endpoint
- Returns `BestMoveData` with word, score, direction (across/down), and last letter position

**src/static/scripts/Letter.ts**:
- Defines `LetterValues` dictionary mapping letters to point values (A=1, Q=10, etc.)

**Entry Point** (src/static/scripts/main.ts):
- Initializes `GameBoard` class on page load

### Data Flow

1. User enters letters in game board cells and letter rack cells (TypeScript UI)
2. User clicks "Go" button
3. `GameBoard.buildPostData()` creates JSON with `gameLetters` (board) and `userLetters` (rack)
4. POST request to `/bestGameMove` endpoint
5. Flask calls `best_game_move.compute()` with JSON data
6. Algorithm computes best word across and down, returns higher-scoring option
7. Frontend displays result with purple borders and score

## Important Notes

### Flask Version
Flask has been upgraded from 1.1.1 to 2.3.2 for compatibility with modern Jinja2 versions. The application code is fully compatible with both versions.

### Game Board Representation
- 15x15 grid with cells indexed 0-224 (row-major order)
- Empty cells represented as single space `' '`
- Wildcard tiles represented as `'?'` (worth 0 points)

### Coordinate Systems
- Backend uses `[row, col]` (0-indexed)
- Frontend uses single index `row * 15 + col` in some places
- "Last letter index" refers to the final letter of the word when spelling backward from that position

### Bonus Squares
Defined in `GAME_BOARD_BONUSES` matrix in `best_game_move.py`:
- `'DL'` - Double Letter
- `'TL'` - Triple Letter
- `'DW'` - Double Word
- `'TW'` - Triple Word
- `'  '` - Plain square

### Build Output
All source files are processed by Gulp and copied to `dist/` folder. Always run the application from `dist/app.py`, not `src/app.py`.

### Python Path Issues
The `dictionary.py` uses `os.path.dirname(os.path.abspath(__file__))` to locate `words.txt` relative to the script location, ensuring it works when run from `dist/` folder.

## File Structure Overview

```
WordsWithFriendsHelper/
├── src/
│   ├── app.py                  # Flask application
│   ├── best_game_move.py       # Core algorithm (800+ lines)
│   ├── dictionary.py           # Dictionary loader
│   ├── words.txt               # Word list (172K+ words)
│   ├── static/
│   │   ├── scripts/            # TypeScript source
│   │   │   ├── main.ts         # Entry point
│   │   │   ├── GameBoard.ts    # Main UI controller
│   │   │   ├── Cell.ts         # Cell classes
│   │   │   ├── BestMove.ts     # API client
│   │   │   └── Letter.ts       # Letter values
│   │   ├── styles/
│   │   │   └── styles.css
│   │   └── assets/
│   │       └── logo.png
│   └── templates/
│       └── index.html          # Main template
├── dist/                       # Build output (git-ignored)
├── gulpfile.js                 # Build configuration
├── package.json                # Node dependencies
├── requirements.txt            # Python dependencies (Flask==2.3.2)
└── tsconfig.json               # TypeScript config
```
