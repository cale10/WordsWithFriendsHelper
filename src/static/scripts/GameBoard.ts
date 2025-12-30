/**
 * @author Elijah Sawyers (Enhanced with Mobile & Dynamic Features)
 */

import computeBestMove, {BestMoveData, MoveDirection} from './BestMove';
import {CellType, Cell, UserCell, GameBoardCell} from './Cell';
import {LetterValues} from './Letter';
import {getBoardConfig, BONUS_MAP, TileType, BoardConfig} from './BoardConfig';

/** Represents the game data to be posted to the backend service. */
export interface PostData {
  gameLetters: Array<object>;
  userLetters: Array<string|undefined>;
  boardSize: number;
  bonusBoard: string[][];
}

/** Represents the game board with mobile and editor support. */
export default class GameBoard {
  // Board size (11 or 15)
  private _boardSize: number;

  // Board configuration with bonuses
  private _boardConfig: BoardConfig;

  // Saved board configurations (persisted across size changes)
  private _savedConfig11: BoardConfig | null;
  private _savedConfig15: BoardConfig | null;

  // Editor mode flag
  private _editorMode: boolean;

  // Mirror mode flag (for quadrant mirroring)
  private _mirrorMode: boolean;

  // HTML elements
  _score: HTMLElement;
  _loader: HTMLElement;
  private _boardContainer: HTMLElement;
  private _letterDock: HTMLElement;
  private _boardSizeSelector: HTMLSelectElement;
  private _editorToggle: HTMLButtonElement;
  private _mirrorToggle: HTMLButtonElement;
  private _saveBoardButton: HTMLButtonElement;
  private _exportBoardButton: HTMLButtonElement;
  private _importBoardButton: HTMLButtonElement;
  private _menuToggle: HTMLButtonElement;
  private _instructionsPanel: HTMLElement;

  // Modals
  private _letterPickerModal: HTMLElement;
  private _tilePickerModal: HTMLElement;

  // Game board cells
  _gameBoardCells: Array<GameBoardCell>;

  // User's letter rack cells
  _letterRackCells: Array<UserCell>;

  // Best move tracking
  _bestMoveCells: Array<Cell>;
  _bestMoveRackCells: Array<Cell>;

  // Currently selected cell for letter input
  _selectedCell: Cell|null;

  // Cell waiting for modal input (mobile)
  private _cellAwaitingInput: Cell|null;

  /** Construct a new game board. */
  constructor() {
    this._boardSize = 15;
    this._boardConfig = getBoardConfig(15);

    // Load saved configurations from localStorage
    this._savedConfig11 = this.loadConfigFromLocalStorage('boardConfig11');
    this._savedConfig15 = this.loadConfigFromLocalStorage('boardConfig15');

    // If we have a saved config for the current size, use it
    if (this._savedConfig15) {
      this._boardConfig = JSON.parse(JSON.stringify(this._savedConfig15));
    }

    this._editorMode = false;
    this._mirrorMode = false;
    this._gameBoardCells = [];
    this._letterRackCells = [];
    this._bestMoveCells = [];
    this._bestMoveRackCells = [];
    this._selectedCell = null;
    this._cellAwaitingInput = null;

    // Grab DOM elements
    this._score = document.getElementById('score-value') as HTMLElement;
    this._loader = document.getElementById('loader') as HTMLElement;
    this._boardContainer = document.getElementById('game-board') as HTMLElement;
    this._letterDock = document.getElementById('letter-dock') as HTMLElement;
    this._boardSizeSelector = document.getElementById('board-size-selector') as HTMLSelectElement;
    this._editorToggle = document.getElementById('editor-toggle') as HTMLButtonElement;
    this._mirrorToggle = document.getElementById('mirror-toggle') as HTMLButtonElement;
    this._saveBoardButton = document.getElementById('save-board') as HTMLButtonElement;
    this._exportBoardButton = document.getElementById('export-board') as HTMLButtonElement;
    this._importBoardButton = document.getElementById('import-board') as HTMLButtonElement;
    this._menuToggle = document.getElementById('menu-toggle') as HTMLButtonElement;
    this._instructionsPanel = document.getElementById('instructions-panel') as HTMLElement;
    this._letterPickerModal = document.getElementById('letter-picker-modal') as HTMLElement;
    this._tilePickerModal = document.getElementById('tile-picker-modal') as HTMLElement;

    // Verify critical elements exist
    if (!this._letterPickerModal || !this._tilePickerModal) {
      console.error('Critical DOM elements missing!', {
        letterPickerModal: !!this._letterPickerModal,
        tilePickerModal: !!this._tilePickerModal
      });
      throw new Error('Failed to initialize GameBoard: required DOM elements not found');
    }

    // Initialize the board and letter rack
    this.initializeBoard();
    this.initializeLetterRack();
    this.initializeLetterPickerModal();
    this.initializeTilePickerModal();

    // Setup event listeners
    this.setupEventListeners();
  }

  /**
   * Initialize the game board grid dynamically
   */
  initializeBoard(): void {
    this._boardContainer.innerHTML = '';
    this._gameBoardCells = [];

    // Set CSS grid template
    this._boardContainer.style.gridTemplateColumns = `repeat(${this._boardSize}, 1fr)`;
    this._boardContainer.style.gridTemplateRows = `repeat(${this._boardSize}, 1fr)`;

    // Generate cells
    for (let i = 0; i < this._boardSize * this._boardSize; i++) {
      const row = Math.floor(i / this._boardSize);
      const col = i % this._boardSize;
      const bonusCode = this._boardConfig.bonuses[row][col];
      const bonusInfo = BONUS_MAP[bonusCode];

      const cellDiv = document.createElement('div');
      cellDiv.className = 'game-board-cell';
      if (bonusInfo.cssClass) {
        cellDiv.classList.add(bonusInfo.cssClass);
      }
      cellDiv.textContent = bonusInfo.display;

      // Add star icon for start cell
      if (bonusCode === 'ST') {
        cellDiv.innerHTML = '<i id="star" class="fas fa-star"></i>';
      }

      this._boardContainer.appendChild(cellDiv);

      // Determine cell type
      let cellType = CellType.plain;
      switch (bonusInfo.type) {
        case TileType.DoubleLetter:
          cellType = CellType.doubleLetter;
          break;
        case TileType.TripleLetter:
          cellType = CellType.tripleLetter;
          break;
        case TileType.DoubleWord:
          cellType = CellType.doubleWord;
          break;
        case TileType.TripleWord:
          cellType = CellType.tripleWord;
          break;
        case TileType.Start:
          cellType = CellType.start;
          break;
      }

      this._gameBoardCells.push(new GameBoardCell(cellDiv, cellType, i));
    }
  }

  /**
   * Initialize the letter rack (7 tiles)
   */
  initializeLetterRack(): void {
    this._letterDock.innerHTML = '';
    this._letterRackCells = [];

    for (let i = 0; i < 7; i++) {
      const cellDiv = document.createElement('div');
      cellDiv.className = 'letter user-letter';
      this._letterDock.appendChild(cellDiv);
      this._letterRackCells.push(new UserCell(cellDiv));
    }
  }

  /**
   * Initialize letter picker modal with A-Z buttons
   */
  initializeLetterPickerModal(): void {
    const letterGrid = this._letterPickerModal.querySelector('.letter-grid') as HTMLElement;
    letterGrid.innerHTML = '';

    // Create A-Z buttons
    for (let i = 0; i < 26; i++) {
      const letter = String.fromCharCode(65 + i); // A-Z
      const button = document.createElement('button');
      button.className = 'letter-button';
      button.textContent = letter;
      button.dataset.letter = letter;
      letterGrid.appendChild(button);
    }
  }

  /**
   * Initialize tile type picker modal
   */
  initializeTilePickerModal(): void {
    // Already initialized in HTML, just need to wire up events
  }

  /**
   * Setup all event listeners
   */
  setupEventListeners(): void {
    // Board size selector
    if (this._boardSizeSelector) {
      this._boardSizeSelector.addEventListener('change', () => {
        const newSize = parseInt(this._boardSizeSelector.value);
        this.changeBoardSize(newSize);
      });
    } else {
      console.error('Board size selector not found');
    }

    // Editor toggle
    if (this._editorToggle) {
      this._editorToggle.addEventListener('click', () => {
        this.toggleEditorMode();
      });
    } else {
      console.error('Editor toggle button not found');
    }

    // Mirror toggle
    if (this._mirrorToggle) {
      this._mirrorToggle.addEventListener('click', () => {
        this.toggleMirrorMode();
      });
    } else {
      console.error('Mirror toggle button not found');
    }

    // Save board button
    if (this._saveBoardButton) {
      this._saveBoardButton.addEventListener('click', () => {
        this.saveBoard();
      });
    } else {
      console.error('Save board button not found');
    }

    // Export board button
    if (this._exportBoardButton) {
      this._exportBoardButton.addEventListener('click', () => {
        this.exportBoard();
      });
    } else {
      console.error('Export board button not found');
    }

    // Import board button
    if (this._importBoardButton) {
      this._importBoardButton.addEventListener('click', () => {
        this.importBoard();
      });
    } else {
      console.error('Import board button not found');
    }

    // Menu toggle (mobile hamburger)
    if (this._menuToggle) {
      this._menuToggle.addEventListener('click', () => {
        this._instructionsPanel.classList.toggle('collapsed');
      });
    } else {
      console.error('Menu toggle button not found');
    }

    // Cell clicks (board and rack)
    document.addEventListener('click', (e: MouseEvent) => {
      this.onClick(e);
    });

    // Keyboard input (desktop only)
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      this.onKeyDown(e);
    });

    // Letter picker modal events
    this._letterPickerModal.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Close button
      if (target.classList.contains('modal-close')) {
        this.closeLetterPicker();
      }

      // Letter button
      if (target.classList.contains('letter-button') || target.closest('.letter-button')) {
        const button = target.classList.contains('letter-button') ? target : target.closest('.letter-button') as HTMLElement;
        const letter = button.dataset.letter;

        if (letter === 'DELETE') {
          this.handleLetterSelection(null);
        } else if (letter) {
          this.handleLetterSelection(letter);
        }
      }

      // Click outside modal to close
      if (target.classList.contains('modal-overlay')) {
        this.closeLetterPicker();
      }
    });

    // Tile picker modal events
    this._tilePickerModal.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Close button
      if (target.classList.contains('modal-close')) {
        this.closeTilePicker();
      }

      // Tile type button
      if (target.classList.contains('tile-type-button')) {
        const tileType = target.dataset.tileType;
        if (tileType) {
          this.handleTileTypeSelection(tileType);
        }
      }

      // Click outside modal to close
      if (target.classList.contains('modal-overlay')) {
        this.closeTilePicker();
      }
    });
  }

  /**
   * Change board size and reinitialize
   */
  changeBoardSize(newSize: number): void {
    // Save current configuration before switching
    if (this._boardSize === 11) {
      this._savedConfig11 = JSON.parse(JSON.stringify(this._boardConfig));
      if (this._savedConfig11) {
        this.saveConfigToLocalStorage('boardConfig11', this._savedConfig11);
      }
    } else if (this._boardSize === 15) {
      this._savedConfig15 = JSON.parse(JSON.stringify(this._boardConfig));
      if (this._savedConfig15) {
        this.saveConfigToLocalStorage('boardConfig15', this._savedConfig15);
      }
    }

    // Update board size
    this._boardSize = newSize;

    // Load saved configuration for new size, or default if none exists
    if (newSize === 11 && this._savedConfig11) {
      this._boardConfig = JSON.parse(JSON.stringify(this._savedConfig11));
    } else if (newSize === 15 && this._savedConfig15) {
      this._boardConfig = JSON.parse(JSON.stringify(this._savedConfig15));
    } else {
      this._boardConfig = getBoardConfig(newSize);
    }

    this.initializeBoard();
    this.clear();
  }

  /**
   * Toggle editor mode
   */
  toggleEditorMode(): void {
    this._editorMode = !this._editorMode;

    if (this._editorMode) {
      this._editorToggle.classList.add('active');
      this._editorToggle.textContent = '✓ Editing';
      this._mirrorToggle.classList.remove('hidden');
      this._saveBoardButton.classList.remove('hidden');
      this._exportBoardButton.classList.remove('hidden');
      this._importBoardButton.classList.remove('hidden');
      document.body.classList.add('editor-mode');
    } else {
      // Auto-save to localStorage when exiting editor mode
      if (this._boardSize === 11) {
        this._savedConfig11 = JSON.parse(JSON.stringify(this._boardConfig));
        if (this._savedConfig11) {
          this.saveConfigToLocalStorage('boardConfig11', this._savedConfig11);
        }
      } else if (this._boardSize === 15) {
        this._savedConfig15 = JSON.parse(JSON.stringify(this._boardConfig));
        if (this._savedConfig15) {
          this.saveConfigToLocalStorage('boardConfig15', this._savedConfig15);
        }
      }

      this._editorToggle.classList.remove('active');
      this._editorToggle.textContent = '🎨 Edit Board';
      this._mirrorToggle.classList.add('hidden');
      this._saveBoardButton.classList.add('hidden');
      this._exportBoardButton.classList.add('hidden');
      this._importBoardButton.classList.add('hidden');
      document.body.classList.remove('editor-mode');
      // Reset mirror mode when exiting editor
      if (this._mirrorMode) {
        this._mirrorMode = false;
        this._mirrorToggle.classList.remove('active');
        this._mirrorToggle.textContent = '🪞 Mirror Off';
      }
    }
  }

  /**
   * Toggle mirror mode for quadrant mirroring
   */
  toggleMirrorMode(): void {
    this._mirrorMode = !this._mirrorMode;

    if (this._mirrorMode) {
      this._mirrorToggle.classList.add('active');
      this._mirrorToggle.textContent = '🪞 Mirror On';
    } else {
      this._mirrorToggle.classList.remove('active');
      this._mirrorToggle.textContent = '🪞 Mirror Off';
    }
  }

  /**
   * Save the current board configuration
   */
  saveBoard(): void {
    // Build a new bonuses array from the current board
    const newBonuses: string[][] = [];

    for (let row = 0; row < this._boardSize; row++) {
      const rowBonuses: string[] = [];
      for (let col = 0; col < this._boardSize; col++) {
        const index = row * this._boardSize + col;
        const cell = this._gameBoardCells[index];
        const cellType = cell.cellType;

        // Map CellType enum to bonus code
        let bonusCode = '  ';
        switch (cellType) {
          case CellType.doubleLetter:
            bonusCode = 'DL';
            break;
          case CellType.tripleLetter:
            bonusCode = 'TL';
            break;
          case CellType.doubleWord:
            bonusCode = 'DW';
            break;
          case CellType.tripleWord:
            bonusCode = 'TW';
            break;
          case CellType.start:
            bonusCode = 'ST';
            break;
          default:
            bonusCode = '  ';
        }

        rowBonuses.push(bonusCode);
      }
      newBonuses.push(rowBonuses);
    }

    // Update the board configuration
    this._boardConfig.bonuses = newBonuses;

    // Save to persistent storage based on current board size
    if (this._boardSize === 11) {
      this._savedConfig11 = JSON.parse(JSON.stringify(this._boardConfig));
      if (this._savedConfig11) {
        this.saveConfigToLocalStorage('boardConfig11', this._savedConfig11);
      }
    } else if (this._boardSize === 15) {
      this._savedConfig15 = JSON.parse(JSON.stringify(this._boardConfig));
      if (this._savedConfig15) {
        this.saveConfigToLocalStorage('boardConfig15', this._savedConfig15);
      }
    }

    // Exit editor mode
    this.toggleEditorMode();

    // Show success feedback (temporary change to button text)
    const originalText = this._editorToggle.textContent;
    this._editorToggle.textContent = '✓ Saved!';
    this._editorToggle.style.background = 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)';
    this._editorToggle.style.color = 'white';

    setTimeout(() => {
      this._editorToggle.textContent = originalText;
      this._editorToggle.style.background = '';
      this._editorToggle.style.color = '';
    }, 2000);
  }

  /**
   * Save configuration to localStorage
   */
  saveConfigToLocalStorage(key: string, config: BoardConfig): void {
    try {
      localStorage.setItem(key, JSON.stringify(config));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  /**
   * Load configuration from localStorage
   */
  loadConfigFromLocalStorage(key: string): BoardConfig | null {
    try {
      const data = localStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load from localStorage:', e);
    }
    return null;
  }

  /**
   * Export current board configuration as JSON file
   */
  exportBoard(): void {
    const config = {
      size: this._boardSize,
      bonuses: this._boardConfig.bonuses,
      timestamp: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `board-${this._boardSize}x${this._boardSize}-${Date.now()}.json`;
    link.click();

    URL.revokeObjectURL(url);

    // Show feedback
    const originalText = this._editorToggle.textContent;
    this._editorToggle.textContent = '⬇ Exported!';
    this._editorToggle.style.background = 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)';
    this._editorToggle.style.color = 'white';

    setTimeout(() => {
      this._editorToggle.textContent = originalText;
      this._editorToggle.style.background = '';
      this._editorToggle.style.color = '';
    }, 2000);
  }

  /**
   * Import board configuration from JSON file
   */
  importBoard(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const config = JSON.parse(content);

          // Validate the config
          if (!config.size || !config.bonuses) {
            alert('Invalid board configuration file');
            return;
          }

          // Apply the configuration
          const newSize = config.size;
          this._boardSize = newSize;
          this._boardConfig = {
            size: newSize,
            bonuses: config.bonuses,
          };

          // Save to appropriate slot
          if (newSize === 11) {
            this._savedConfig11 = JSON.parse(JSON.stringify(this._boardConfig));
            if (this._savedConfig11) {
              this.saveConfigToLocalStorage('boardConfig11', this._savedConfig11);
            }
          } else if (newSize === 15) {
            this._savedConfig15 = JSON.parse(JSON.stringify(this._boardConfig));
            if (this._savedConfig15) {
              this.saveConfigToLocalStorage('boardConfig15', this._savedConfig15);
            }
          }

          // Update board size selector
          this._boardSizeSelector.value = newSize.toString();

          // Reinitialize the board
          this.initializeBoard();
          this.clear();

          // Show feedback
          const originalText = this._editorToggle.textContent;
          this._editorToggle.textContent = '⬆ Imported!';
          this._editorToggle.style.background = 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)';
          this._editorToggle.style.color = 'white';

          setTimeout(() => {
            this._editorToggle.textContent = originalText;
            this._editorToggle.style.background = '';
            this._editorToggle.style.color = '';
          }, 2000);
        } catch (err) {
          console.error('Failed to import board:', err);
          alert('Failed to import board configuration. Please check the file format.');
        }
      };

      reader.readAsText(file);
    };

    input.click();
  }

  /**
   * Handle click events
   */
  onClick(e: MouseEvent): void {
    const target = e.target as HTMLElement;

    // Handle game board cell clicks
    if (target.classList.contains('game-board-cell') || target.closest('.game-board-cell')) {
      const cellDiv = target.classList.contains('game-board-cell') ? target : target.closest('.game-board-cell') as HTMLElement;
      const cell = this._gameBoardCells.find(c => c.cell === cellDiv);

      if (cell) {
        if (this._editorMode) {
          // Editor mode: open tile picker
          this._cellAwaitingInput = cell;
          this.openTilePicker();
        } else {
          // Normal mode: open letter picker
          this.discard();
          this._cellAwaitingInput = cell;
          this.openLetterPicker();
        }
      }
    }

    // Handle letter rack cell clicks (disabled in editor mode)
    else if (target.classList.contains('user-letter') || target.closest('.user-letter')) {
      if (this._editorMode) {
        // Don't allow letter placement in editor mode
        return;
      }

      const cellDiv = target.classList.contains('user-letter') ? target : target.closest('.user-letter') as HTMLElement;
      const cell = this._letterRackCells.find(c => c.cell === cellDiv);

      if (cell) {
        this.discard();
        this._cellAwaitingInput = cell;
        this.openLetterPicker();
      }
    }

    // Handle button clicks (disabled in editor mode)
    else if (target.id === 'clear') {
      if (!this._editorMode) {
        this.clear();
      }
    }
    else if (target.id === 'go') {
      if (!this._editorMode) {
        this.computeBestMove();
      }
    }
    else if (target.id === 'discard') {
      if (!this._editorMode) {
        this.discard();
      }
    }
    else if (target.id === 'keep') {
      if (!this._editorMode) {
        this.keep();
      }
    }
  }

  /**
   * Handle keyboard events (desktop only)
   */
  onKeyDown(e: KeyboardEvent): void {
    // Skip if modal is open
    if (!this._letterPickerModal.classList.contains('hidden') ||
        !this._tilePickerModal.classList.contains('hidden')) {
      return;
    }

    // Disable keyboard input in editor mode
    if (this._editorMode) {
      return;
    }

    // Only use keyboard if a cell is selected (not modal-based)
    if (this._selectedCell && e.key.search(/^[A-Za-z ]$/) != -1) {
      this.setSelectedCellLetter(e.key);
    }
    else if (this._selectedCell && e.key === 'Backspace') {
      this.setSelectedCellLetter(null);
    }
    else if (this._selectedCell && e.key === 'Escape') {
      this.deselectSelectedCell();
    }
  }

  /**
   * Open letter picker modal
   */
  openLetterPicker(): void {
    this._letterPickerModal.classList.remove('hidden');
  }

  /**
   * Close letter picker modal
   */
  closeLetterPicker(): void {
    this._letterPickerModal.classList.add('hidden');
    this._cellAwaitingInput = null;
  }

  /**
   * Handle letter selection from modal
   */
  handleLetterSelection(letter: string | null): void {
    if (this._cellAwaitingInput) {
      this._cellAwaitingInput.letter = letter ? {
        letter: letter,
        value: LetterValues[letter]
      } : null;
    }
    this.closeLetterPicker();
  }

  /**
   * Open tile type picker modal
   */
  openTilePicker(): void {
    this._tilePickerModal.classList.remove('hidden');
  }

  /**
   * Close tile type picker modal
   */
  closeTilePicker(): void {
    this._tilePickerModal.classList.add('hidden');
    this._cellAwaitingInput = null;
  }

  /**
   * Handle tile type selection from modal (editor mode)
   */
  handleTileTypeSelection(tileType: string): void {
    if (!this._cellAwaitingInput || !(this._cellAwaitingInput instanceof GameBoardCell)) {
      return;
    }

    const cell = this._cellAwaitingInput as GameBoardCell;
    const cellDiv = cell.cell;
    const index = cell.index;
    const row = Math.floor(index / this._boardSize);
    const col = index % this._boardSize;

    // Store current letter if any
    const currentLetter = cell.letter;

    // Determine new cell type and CSS class
    let bonusCode = '  ';
    let newCellType = CellType.plain;
    let cssClass = '';

    switch (tileType) {
      case 'double-letter':
        bonusCode = 'DL';
        newCellType = CellType.doubleLetter;
        cssClass = 'double-letter';
        break;
      case 'triple-letter':
        bonusCode = 'TL';
        newCellType = CellType.tripleLetter;
        cssClass = 'triple-letter';
        break;
      case 'double-word':
        bonusCode = 'DW';
        newCellType = CellType.doubleWord;
        cssClass = 'double-word';
        break;
      case 'triple-word':
        bonusCode = 'TW';
        newCellType = CellType.tripleWord;
        cssClass = 'triple-word';
        break;
      case 'start':
        bonusCode = 'ST';
        newCellType = CellType.start;
        cssClass = 'start-cell';
        break;
      default:
        bonusCode = '  ';
        newCellType = CellType.plain;
        cssClass = '';
    }

    // Update visual appearance: remove all bonus classes, add new one
    cellDiv.classList.remove('double-letter', 'triple-letter', 'double-word', 'triple-word', 'start-cell');
    if (cssClass) {
      cellDiv.classList.add(cssClass);
    }

    // Update config
    this._boardConfig.bonuses[row][col] = bonusCode;

    // Update cell type
    cell.type = newCellType;

    // Restore letter if there was one (this triggers the cell's letter setter which redraws properly)
    cell.letter = currentLetter;

    // Apply mirroring if enabled
    if (this._mirrorMode) {
      this.applyMirroredTileType(row, col, tileType, bonusCode, newCellType);
    }

    this.closeTilePicker();
  }

  /**
   * Apply tile type to mirrored quadrant positions
   */
  applyMirroredTileType(row: number, col: number, tileType: string, bonusCode: string, cellType: CellType): void {
    const maxIndex = this._boardSize - 1;

    // Determine CSS class from tile type
    let cssClass = '';
    switch (tileType) {
      case 'double-letter':
        cssClass = 'double-letter';
        break;
      case 'triple-letter':
        cssClass = 'triple-letter';
        break;
      case 'double-word':
        cssClass = 'double-word';
        break;
      case 'triple-word':
        cssClass = 'triple-word';
        break;
      case 'start':
        cssClass = 'start-cell';
        break;
      default:
        cssClass = '';
    }

    // Calculate mirrored positions
    const mirroredPositions = [
      { row: row, col: maxIndex - col },           // Horizontal flip
      { row: maxIndex - row, col: col },           // Vertical flip
      { row: maxIndex - row, col: maxIndex - col } // Both flips
    ];

    // Apply tile type to each mirrored position
    for (const pos of mirroredPositions) {
      // Skip if it's the same as the original position (center cell)
      if (pos.row === row && pos.col === col) {
        continue;
      }

      const mirrorIndex = pos.row * this._boardSize + pos.col;
      const mirrorCell = this._gameBoardCells[mirrorIndex];
      const mirrorCellDiv = mirrorCell.cell;

      // Store current letter if any
      const currentLetter = mirrorCell.letter;

      // Update visual appearance: remove all bonus classes, add new one
      mirrorCellDiv.classList.remove('double-letter', 'triple-letter', 'double-word', 'triple-word', 'start-cell');
      if (cssClass) {
        mirrorCellDiv.classList.add(cssClass);
      }

      // Update config
      this._boardConfig.bonuses[pos.row][pos.col] = bonusCode;

      // Update cell type
      mirrorCell.type = cellType;

      // Restore letter if there was one (this triggers proper redraw)
      mirrorCell.letter = currentLetter;
    }
  }

  /**
   * Compute best move
   */
  computeBestMove(): void {
    this.discard();
    this.showSpinner();
    this.deselectSelectedCell();

    const postData = this.buildPostData();
    computeBestMove(postData).then((bestMove: BestMoveData) => {
      // Check for error message from backend
      if ((bestMove as any).error) {
        this.hideSpinner();
        alert((bestMove as any).error);
        return;
      }

      this.displayBestMove(bestMove);
      this.hideSpinner();
    }).catch((error) => {
      this.hideSpinner();
      alert('Error computing best move. Please try again.');
      console.error(error);
    });
  }

  /**
   * Display best move on board
   */
  displayBestMove(bestMove: BestMoveData): void {
    let currentIndex = bestMove.lastLetterIndex[0] * this._boardSize + bestMove.lastLetterIndex[1];

    for (let i = 0; i < bestMove.word.length; i++) {
      this.setScore(bestMove.score);

      // Track rack vs board letters
      if (!this._gameBoardCells[currentIndex].letter) {
        this._bestMoveRackCells.push(this._gameBoardCells[currentIndex]);
      } else {
        this._bestMoveCells.push(this._gameBoardCells[currentIndex]);
      }

      // Add purple border and set letter
      this._gameBoardCells[currentIndex].toggleBestMove();
      this._gameBoardCells[currentIndex].letter = {
        letter: bestMove.word[bestMove.word.length - i - 1],
        value: LetterValues[bestMove.word[bestMove.word.length - i - 1]]
      };

      // Move to next cell
      if (bestMove.direction === MoveDirection.across) {
        currentIndex -= 1;
      } else {
        currentIndex -= this._boardSize;
      }
    }
  }

  /**
   * Build POST data for backend
   */
  buildPostData(): PostData {
    const postData: PostData = {
      gameLetters: [],
      userLetters: [],
      boardSize: this._boardSize,
      bonusBoard: this._boardConfig.bonuses
    };

    // Grab game board letters
    for (let i = 0; i < this._gameBoardCells.length; i++) {
      if (this._gameBoardCells[i].letter != null) {
        postData.gameLetters.push({
          letter: this._gameBoardCells[i].letter?.letter,
          index: this._gameBoardCells[i].index
        });
      }
    }

    // Grab user letters
    for (let i = 0; i < this._letterRackCells.length; i++) {
      if (this._letterRackCells[i].letter != null) {
        postData.userLetters.push(this._letterRackCells[i].letter?.letter);
      }
    }

    return postData;
  }

  /**
   * Clear board and rack
   */
  clear(): void {
    this.setSelectedCellLetter(null);

    for (let i = 0; i < this._gameBoardCells.length; i++) {
      this._gameBoardCells[i].letter = null;
    }

    for (let i = 0; i < this._letterRackCells.length; i++) {
      this._letterRackCells[i].letter = null;
    }

    this.discard();
  }

  /**
   * Discard best move
   */
  discard(): void {
    for (let i = 0; i < this._bestMoveCells.length; i++) {
      this._bestMoveCells[i].toggleBestMove();
    }
    this._bestMoveCells = [];

    for (let i = 0; i < this._bestMoveRackCells.length; i++) {
      this._bestMoveRackCells[i].toggleBestMove();
      this._bestMoveRackCells[i].letter = null;
    }
    this._bestMoveRackCells = [];

    this.setScore(null);
  }

  /**
   * Keep best move
   */
  keep(): void {
    for (let i = 0; i < this._bestMoveCells.length; i++) {
      this._bestMoveCells[i].toggleBestMove();
    }

    for (let i = 0; i < this._bestMoveRackCells.length; i++) {
      this._bestMoveRackCells[i].toggleBestMove();
    }

    this._bestMoveCells = [];
    this._bestMoveRackCells = [];
    this.setScore(null);
  }

  /**
   * Set score display
   */
  setScore(score: number|null): void {
    if (score) {
      this._score.innerHTML = String(score);
    } else {
      this._score.innerHTML = '00';
    }
  }

  /**
   * Show loading spinner
   */
  showSpinner(): void {
    this._loader.classList.remove('hidden');
  }

  /**
   * Hide loading spinner
   */
  hideSpinner(): void {
    this._loader.classList.add('hidden');
  }

  /**
   * Set selected cell letter (desktop keyboard input)
   */
  setSelectedCellLetter(letter: string|null): void {
    if (this._selectedCell) {
      this._selectedCell.letter = (letter == null) ? null : {
        letter: letter === ' ' ? '?' : letter.toUpperCase(),
        value: LetterValues[letter === ' ' ? '?' : letter.toUpperCase()]
      };
      this.deselectSelectedCell();
    }
  }

  /**
   * Deselect selected cell
   */
  deselectSelectedCell(): void {
    if (this._selectedCell) {
      this._selectedCell.toggleSelected();
      this._selectedCell = null;
    }
  }
}
