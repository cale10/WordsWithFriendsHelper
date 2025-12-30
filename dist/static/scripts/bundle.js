(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
/**
 * @author Elijah Sawyers <elijahsawyers@gmail.com>
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Whether a move is down or across.
 */
var MoveDirection;
(function (MoveDirection) {
    MoveDirection[MoveDirection["down"] = 0] = "down";
    MoveDirection[MoveDirection["across"] = 1] = "across";
})(MoveDirection = exports.MoveDirection || (exports.MoveDirection = {}));
/**
 * Given the gameboard data, compute the best possible game move by making
 * and xhr request to the backen service.
 *
 * @param {PostData} data the gameboard data.
 * @return a promise to resolve with the best move data.
 */
const computeBestMove = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const xhr = new XMLHttpRequest();
    return new Promise((resolve, reject) => {
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                const responseData = JSON.parse(xhr.responseText);
                const bestMoveData = {
                    word: responseData['word'],
                    score: responseData['score'],
                    direction: responseData['direction'] == 'across' ?
                        MoveDirection.across :
                        MoveDirection.down,
                    lastLetterIndex: responseData['last_letter_index'],
                };
                resolve(bestMoveData);
            }
        };
        xhr.onerror = () => {
            reject();
        };
        xhr.open('POST', '/bestGameMove');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
    });
});
exports.default = computeBestMove;

},{}],2:[function(require,module,exports){
"use strict";
/**
 * @author Enhanced by Claude Code
 * Board configuration presets for different sizes
 */
Object.defineProperty(exports, "__esModule", { value: true });
/** 15x15 Board Configuration (Standard Words With Friends) */
exports.BOARD_15X15 = {
    size: 15,
    bonuses: [
        ['  ', '  ', '  ', 'TW', '  ', '  ', 'TL', '  ', 'TL', '  ', '  ', 'TW', '  ', '  ', '  '],
        ['  ', '  ', 'DL', '  ', '  ', 'DW', '  ', '  ', '  ', 'DW', '  ', '  ', 'DL', '  ', '  '],
        ['  ', 'DL', '  ', '  ', 'DL', '  ', '  ', '  ', '  ', '  ', 'DL', '  ', '  ', 'DL', '  '],
        ['TW', '  ', '  ', 'TL', '  ', '  ', '  ', 'DW', '  ', '  ', '  ', 'TL', '  ', '  ', 'TW'],
        ['  ', '  ', 'DL', '  ', '  ', '  ', 'DL', '  ', 'DL', '  ', '  ', '  ', 'DL', '  ', '  '],
        ['  ', 'DW', '  ', '  ', '  ', 'TL', '  ', '  ', '  ', 'TL', '  ', '  ', '  ', 'DW', '  '],
        ['TL', '  ', '  ', '  ', 'DL', '  ', '  ', '  ', '  ', '  ', 'DL', '  ', '  ', '  ', 'TL'],
        ['  ', '  ', '  ', 'DW', '  ', '  ', '  ', 'ST', '  ', '  ', '  ', 'DW', '  ', '  ', '  '],
        ['TL', '  ', '  ', '  ', 'DL', '  ', '  ', '  ', '  ', '  ', 'DL', '  ', '  ', '  ', 'TL'],
        ['  ', 'DW', '  ', '  ', '  ', 'TL', '  ', '  ', '  ', 'TL', '  ', '  ', '  ', 'DW', '  '],
        ['  ', '  ', 'DL', '  ', '  ', '  ', 'DL', '  ', 'DL', '  ', '  ', '  ', 'DL', '  ', '  '],
        ['TW', '  ', '  ', 'TL', '  ', '  ', '  ', 'DW', '  ', '  ', '  ', 'TL', '  ', '  ', 'TW'],
        ['  ', 'DL', '  ', '  ', 'DL', '  ', '  ', '  ', '  ', '  ', 'DL', '  ', '  ', 'DL', '  '],
        ['  ', '  ', 'DL', '  ', '  ', 'DW', '  ', '  ', '  ', 'DW', '  ', '  ', 'DL', '  ', '  '],
        ['  ', '  ', '  ', 'TW', '  ', '  ', 'TL', '  ', 'TL', '  ', '  ', 'TW', '  ', '  ', '  '],
    ]
};
/** 11x11 Board Configuration (Compact Words With Friends) */
exports.BOARD_11X11 = {
    size: 11,
    bonuses: [
        ['TW', '  ', '  ', 'DL', '  ', '  ', '  ', 'DL', '  ', '  ', 'TW'],
        ['  ', 'DW', '  ', '  ', '  ', 'TL', '  ', '  ', '  ', 'DW', '  '],
        ['  ', '  ', 'DW', '  ', '  ', '  ', '  ', '  ', 'DW', '  ', '  '],
        ['DL', '  ', '  ', 'TL', '  ', '  ', '  ', 'TL', '  ', '  ', 'DL'],
        ['  ', '  ', '  ', '  ', 'DW', '  ', 'DW', '  ', '  ', '  ', '  '],
        ['  ', 'TL', '  ', '  ', '  ', 'ST', '  ', '  ', '  ', 'TL', '  '],
        ['  ', '  ', '  ', '  ', 'DW', '  ', 'DW', '  ', '  ', '  ', '  '],
        ['DL', '  ', '  ', 'TL', '  ', '  ', '  ', 'TL', '  ', '  ', 'DL'],
        ['  ', '  ', 'DW', '  ', '  ', '  ', '  ', '  ', 'DW', '  ', '  '],
        ['  ', 'DW', '  ', '  ', '  ', 'TL', '  ', '  ', '  ', 'DW', '  '],
        ['TW', '  ', '  ', 'DL', '  ', '  ', '  ', 'DL', '  ', '  ', 'TW'],
    ]
};
/** Tile type enum */
var TileType;
(function (TileType) {
    TileType["Plain"] = "plain";
    TileType["DoubleLetter"] = "double-letter";
    TileType["TripleLetter"] = "triple-letter";
    TileType["DoubleWord"] = "double-word";
    TileType["TripleWord"] = "triple-word";
    TileType["Start"] = "start";
})(TileType = exports.TileType || (exports.TileType = {}));
/** Maps bonus codes to CSS classes and display text */
exports.BONUS_MAP = {
    '  ': { cssClass: '', display: '', type: TileType.Plain },
    'DL': { cssClass: 'double-letter', display: 'DL', type: TileType.DoubleLetter },
    'TL': { cssClass: 'triple-letter', display: 'TL', type: TileType.TripleLetter },
    'DW': { cssClass: 'double-word', display: 'DW', type: TileType.DoubleWord },
    'TW': { cssClass: 'triple-word', display: 'TW', type: TileType.TripleWord },
    'ST': { cssClass: 'start-cell', display: '⭐', type: TileType.Start }
};
/** Get board configuration by size */
function getBoardConfig(size) {
    if (size === 11) {
        return JSON.parse(JSON.stringify(exports.BOARD_11X11));
    }
    return JSON.parse(JSON.stringify(exports.BOARD_15X15));
}
exports.getBoardConfig = getBoardConfig;

},{}],3:[function(require,module,exports){
"use strict";
/**
 * @author Elijah Sawyers <elijahsawyers@gmail.com>
 */
Object.defineProperty(exports, "__esModule", { value: true });
/** Represents the different special cell types. */
var CellType;
(function (CellType) {
    CellType[CellType["plain"] = 0] = "plain";
    CellType[CellType["start"] = 1] = "start";
    CellType[CellType["doubleLetter"] = 2] = "doubleLetter";
    CellType[CellType["tripleLetter"] = 3] = "tripleLetter";
    CellType[CellType["doubleWord"] = 4] = "doubleWord";
    CellType[CellType["tripleWord"] = 5] = "tripleWord";
})(CellType = exports.CellType || (exports.CellType = {}));
/** Represents the base cell class. */
class Cell {
    /**
     * Construct a new cell with the HTMLElement of the cell and a letter.
     *
     * @param {HTMLElement} cell the HTML element in the DOM that represents the cell.
     * @param {Letter|null} letter the letter the cell holds, or null, if it doesn't
     * hold a letter.
     */
    constructor(cell, letter = null) {
        // Whether or not the cell is currently selected by the user. 
        this._selected = false;
        // Whether or not the cell is currently a part of the best move being displayed.
        this._bestMoveCell = false;
        this._cell = cell;
        this._letter = letter;
    }
    /** Getter for the cell's HTMLElement. */
    get cell() {
        return this._cell;
    }
    /** Setter for the cell's HTMLElement. */
    set cell(newCell) {
        throw Error('Cannot change the cell!');
    }
    /** Getter for the current letter of the cell. */
    get letter() {
        return this._letter;
    }
    /** Setter for the current letter of the cell. */
    set letter(newLetter) {
        this._letter = newLetter;
    }
    /**
     * Toggles whether or not the cell is in selected mode (i.e. adds/removes a red border).
     */
    toggleSelected() {
        this._selected = !this._selected;
        if (this._selected) {
            this._cell.classList.add('selected-cell');
        }
        else {
            this._cell.classList.remove('selected-cell');
        }
    }
    /**
     * Toggles the cell to be a part of the best move (i.e. adds/removes a purple border).
     */
    toggleBestMove() {
        this._bestMoveCell = !this._bestMoveCell;
        if (this._bestMoveCell) {
            this._cell.classList.add('best-move-cell');
        }
        else {
            this._cell.classList.remove('best-move-cell');
        }
    }
}
exports.Cell = Cell;
/** Represents a cell in the game board. */
class GameBoardCell extends Cell {
    /**
     * Construct a new cell with the HTMLElement of the cell and a letter, as well
     * as a cell type.
     *
     * @param {HTMLElement} cell the HTML element in the DOM that represents the cell.
     * @param {CellType} cellType the cell type (i.e. bonus cell, middle cell, etc.).
     * @param {number} index the index on the gameboard (0-254).
     * @param {Letter|null} letter the letter the cell holds, or null, if it doesn't hold
     * a letter.
     */
    constructor(cell, cellType, index, letter = null) {
        super(cell, letter);
        this._cellType = cellType;
        this._index = index;
    }
    /** Must override the getter if the setter is overridden, per the spec. */
    get letter() {
        return this._letter;
    }
    /** Override the setter for the current letter of the cell. */
    set letter(newLetter) {
        this._letter = newLetter;
        // Remove the current letter.
        if (newLetter == null) {
            this._cell.classList.remove('letter');
            if (this.cellType == CellType.doubleLetter)
                this._cell.innerHTML = 'DL';
            else if (this.cellType == CellType.tripleLetter)
                this._cell.innerHTML = 'TL';
            else if (this.cellType == CellType.doubleWord)
                this._cell.innerHTML = 'DW';
            else if (this.cellType == CellType.tripleWord)
                this._cell.innerHTML = 'TW';
            else if (this.cellType == CellType.start)
                this._cell.innerHTML = '<i id="star" class="fas fa-star"></i>';
            else
                this._cell.innerHTML = '';
        }
        // Set the current letter.
        else {
            this._cell.classList.add('letter');
            this._cell.innerHTML =
                `${newLetter.letter}<span class="letter-point-value">${newLetter.value}</span>`;
        }
    }
    /** Getter for the cell type. */
    get cellType() {
        return this._cellType;
    }
    /** Setter for the cell type (for board editor). */
    set cellType(newCellType) {
        this._cellType = newCellType || CellType.plain;
    }
    /** Public getter for type property (alias for cellType). */
    get type() {
        return this._cellType;
    }
    /** Public setter for type property (alias for cellType). */
    set type(newType) {
        this._cellType = newType || CellType.plain;
    }
    /** Getter for the cell index. */
    get index() {
        return this._index;
    }
    /** Setter for the cell index. */
    set index(newIndex) {
        throw Error('Cannot change the cell index!');
    }
}
exports.GameBoardCell = GameBoardCell;
/** Represents a cell in the user's letter dock. */
class UserCell extends Cell {
    /** Must override the getter if the setter is overridden, per the spec. */
    get letter() {
        return this._letter;
    }
    /** Override the setter for the current letter of the cell. */
    set letter(newLetter) {
        this._letter = newLetter;
        // Remove the current letter.
        if (newLetter == null) {
            this._cell.innerHTML = '';
        }
        // Set the current letter.
        else {
            this._cell.innerHTML =
                `${newLetter.letter}<span class="user-letter-point-value">${newLetter.value}</span>`;
        }
    }
}
exports.UserCell = UserCell;

},{}],4:[function(require,module,exports){
"use strict";
/**
 * @author Elijah Sawyers (Enhanced with Mobile & Dynamic Features)
 */
Object.defineProperty(exports, "__esModule", { value: true });
const BestMove_1 = require("./BestMove");
const Cell_1 = require("./Cell");
const Letter_1 = require("./Letter");
const BoardConfig_1 = require("./BoardConfig");
/** Represents the game board with mobile and editor support. */
class GameBoard {
    /** Construct a new game board. */
    constructor() {
        this._boardSize = 15;
        this._boardConfig = BoardConfig_1.getBoardConfig(15);
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
        this._score = document.getElementById('score-value');
        this._loader = document.getElementById('loader');
        this._boardContainer = document.getElementById('game-board');
        this._letterDock = document.getElementById('letter-dock');
        this._boardSizeSelector = document.getElementById('board-size-selector');
        this._editorToggle = document.getElementById('editor-toggle');
        this._mirrorToggle = document.getElementById('mirror-toggle');
        this._saveBoardButton = document.getElementById('save-board');
        this._exportBoardButton = document.getElementById('export-board');
        this._importBoardButton = document.getElementById('import-board');
        this._menuToggle = document.getElementById('menu-toggle');
        this._instructionsPanel = document.getElementById('instructions-panel');
        this._letterPickerModal = document.getElementById('letter-picker-modal');
        this._tilePickerModal = document.getElementById('tile-picker-modal');
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
    initializeBoard() {
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
            const bonusInfo = BoardConfig_1.BONUS_MAP[bonusCode];
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
            let cellType = Cell_1.CellType.plain;
            switch (bonusInfo.type) {
                case BoardConfig_1.TileType.DoubleLetter:
                    cellType = Cell_1.CellType.doubleLetter;
                    break;
                case BoardConfig_1.TileType.TripleLetter:
                    cellType = Cell_1.CellType.tripleLetter;
                    break;
                case BoardConfig_1.TileType.DoubleWord:
                    cellType = Cell_1.CellType.doubleWord;
                    break;
                case BoardConfig_1.TileType.TripleWord:
                    cellType = Cell_1.CellType.tripleWord;
                    break;
                case BoardConfig_1.TileType.Start:
                    cellType = Cell_1.CellType.start;
                    break;
            }
            this._gameBoardCells.push(new Cell_1.GameBoardCell(cellDiv, cellType, i));
        }
    }
    /**
     * Initialize the letter rack (7 tiles)
     */
    initializeLetterRack() {
        this._letterDock.innerHTML = '';
        this._letterRackCells = [];
        for (let i = 0; i < 7; i++) {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'letter user-letter';
            this._letterDock.appendChild(cellDiv);
            this._letterRackCells.push(new Cell_1.UserCell(cellDiv));
        }
    }
    /**
     * Initialize letter picker modal with A-Z buttons
     */
    initializeLetterPickerModal() {
        const letterGrid = this._letterPickerModal.querySelector('.letter-grid');
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
    initializeTilePickerModal() {
        // Already initialized in HTML, just need to wire up events
    }
    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Board size selector
        if (this._boardSizeSelector) {
            this._boardSizeSelector.addEventListener('change', () => {
                const newSize = parseInt(this._boardSizeSelector.value);
                this.changeBoardSize(newSize);
            });
        }
        else {
            console.error('Board size selector not found');
        }
        // Editor toggle
        if (this._editorToggle) {
            this._editorToggle.addEventListener('click', () => {
                this.toggleEditorMode();
            });
        }
        else {
            console.error('Editor toggle button not found');
        }
        // Mirror toggle
        if (this._mirrorToggle) {
            this._mirrorToggle.addEventListener('click', () => {
                this.toggleMirrorMode();
            });
        }
        else {
            console.error('Mirror toggle button not found');
        }
        // Save board button
        if (this._saveBoardButton) {
            this._saveBoardButton.addEventListener('click', () => {
                this.saveBoard();
            });
        }
        else {
            console.error('Save board button not found');
        }
        // Export board button
        if (this._exportBoardButton) {
            this._exportBoardButton.addEventListener('click', () => {
                this.exportBoard();
            });
        }
        else {
            console.error('Export board button not found');
        }
        // Import board button
        if (this._importBoardButton) {
            this._importBoardButton.addEventListener('click', () => {
                this.importBoard();
            });
        }
        else {
            console.error('Import board button not found');
        }
        // Menu toggle (mobile hamburger)
        if (this._menuToggle) {
            this._menuToggle.addEventListener('click', () => {
                this._instructionsPanel.classList.toggle('collapsed');
            });
        }
        else {
            console.error('Menu toggle button not found');
        }
        // Cell clicks (board and rack)
        document.addEventListener('click', (e) => {
            this.onClick(e);
        });
        // Keyboard input (desktop only)
        document.addEventListener('keydown', (e) => {
            this.onKeyDown(e);
        });
        // Letter picker modal events
        this._letterPickerModal.addEventListener('click', (e) => {
            const target = e.target;
            // Close button
            if (target.classList.contains('modal-close')) {
                this.closeLetterPicker();
            }
            // Letter button
            if (target.classList.contains('letter-button') || target.closest('.letter-button')) {
                const button = target.classList.contains('letter-button') ? target : target.closest('.letter-button');
                const letter = button.dataset.letter;
                if (letter === 'DELETE') {
                    this.handleLetterSelection(null);
                }
                else if (letter) {
                    this.handleLetterSelection(letter);
                }
            }
            // Click outside modal to close
            if (target.classList.contains('modal-overlay')) {
                this.closeLetterPicker();
            }
        });
        // Tile picker modal events
        this._tilePickerModal.addEventListener('click', (e) => {
            const target = e.target;
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
    changeBoardSize(newSize) {
        // Save current configuration before switching
        if (this._boardSize === 11) {
            this._savedConfig11 = JSON.parse(JSON.stringify(this._boardConfig));
            if (this._savedConfig11) {
                this.saveConfigToLocalStorage('boardConfig11', this._savedConfig11);
            }
        }
        else if (this._boardSize === 15) {
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
        }
        else if (newSize === 15 && this._savedConfig15) {
            this._boardConfig = JSON.parse(JSON.stringify(this._savedConfig15));
        }
        else {
            this._boardConfig = BoardConfig_1.getBoardConfig(newSize);
        }
        this.initializeBoard();
        this.clear();
    }
    /**
     * Toggle editor mode
     */
    toggleEditorMode() {
        this._editorMode = !this._editorMode;
        if (this._editorMode) {
            this._editorToggle.classList.add('active');
            this._editorToggle.textContent = '✓ Editing';
            this._mirrorToggle.classList.remove('hidden');
            this._saveBoardButton.classList.remove('hidden');
            this._exportBoardButton.classList.remove('hidden');
            this._importBoardButton.classList.remove('hidden');
            document.body.classList.add('editor-mode');
        }
        else {
            // Auto-save to localStorage when exiting editor mode
            if (this._boardSize === 11) {
                this._savedConfig11 = JSON.parse(JSON.stringify(this._boardConfig));
                if (this._savedConfig11) {
                    this.saveConfigToLocalStorage('boardConfig11', this._savedConfig11);
                }
            }
            else if (this._boardSize === 15) {
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
    toggleMirrorMode() {
        this._mirrorMode = !this._mirrorMode;
        if (this._mirrorMode) {
            this._mirrorToggle.classList.add('active');
            this._mirrorToggle.textContent = '🪞 Mirror On';
        }
        else {
            this._mirrorToggle.classList.remove('active');
            this._mirrorToggle.textContent = '🪞 Mirror Off';
        }
    }
    /**
     * Save the current board configuration
     */
    saveBoard() {
        // Build a new bonuses array from the current board
        const newBonuses = [];
        for (let row = 0; row < this._boardSize; row++) {
            const rowBonuses = [];
            for (let col = 0; col < this._boardSize; col++) {
                const index = row * this._boardSize + col;
                const cell = this._gameBoardCells[index];
                const cellType = cell.cellType;
                // Map CellType enum to bonus code
                let bonusCode = '  ';
                switch (cellType) {
                    case Cell_1.CellType.doubleLetter:
                        bonusCode = 'DL';
                        break;
                    case Cell_1.CellType.tripleLetter:
                        bonusCode = 'TL';
                        break;
                    case Cell_1.CellType.doubleWord:
                        bonusCode = 'DW';
                        break;
                    case Cell_1.CellType.tripleWord:
                        bonusCode = 'TW';
                        break;
                    case Cell_1.CellType.start:
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
        }
        else if (this._boardSize === 15) {
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
    saveConfigToLocalStorage(key, config) {
        try {
            localStorage.setItem(key, JSON.stringify(config));
        }
        catch (e) {
            console.error('Failed to save to localStorage:', e);
        }
    }
    /**
     * Load configuration from localStorage
     */
    loadConfigFromLocalStorage(key) {
        try {
            const data = localStorage.getItem(key);
            if (data) {
                return JSON.parse(data);
            }
        }
        catch (e) {
            console.error('Failed to load from localStorage:', e);
        }
        return null;
    }
    /**
     * Export current board configuration as JSON file
     */
    exportBoard() {
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
    importBoard() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = (e) => {
            var _a;
            const target = e.target;
            const file = (_a = target.files) === null || _a === void 0 ? void 0 : _a[0];
            if (!file)
                return;
            const reader = new FileReader();
            reader.onload = (event) => {
                var _a;
                try {
                    const content = (_a = event.target) === null || _a === void 0 ? void 0 : _a.result;
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
                    }
                    else if (newSize === 15) {
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
                }
                catch (err) {
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
    onClick(e) {
        const target = e.target;
        // Handle game board cell clicks
        if (target.classList.contains('game-board-cell') || target.closest('.game-board-cell')) {
            const cellDiv = target.classList.contains('game-board-cell') ? target : target.closest('.game-board-cell');
            const cell = this._gameBoardCells.find(c => c.cell === cellDiv);
            if (cell) {
                if (this._editorMode) {
                    // Editor mode: open tile picker
                    this._cellAwaitingInput = cell;
                    this.openTilePicker();
                }
                else {
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
            const cellDiv = target.classList.contains('user-letter') ? target : target.closest('.user-letter');
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
    onKeyDown(e) {
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
    openLetterPicker() {
        this._letterPickerModal.classList.remove('hidden');
    }
    /**
     * Close letter picker modal
     */
    closeLetterPicker() {
        this._letterPickerModal.classList.add('hidden');
        this._cellAwaitingInput = null;
    }
    /**
     * Handle letter selection from modal
     */
    handleLetterSelection(letter) {
        if (this._cellAwaitingInput) {
            this._cellAwaitingInput.letter = letter ? {
                letter: letter,
                value: Letter_1.LetterValues[letter]
            } : null;
        }
        this.closeLetterPicker();
    }
    /**
     * Open tile type picker modal
     */
    openTilePicker() {
        this._tilePickerModal.classList.remove('hidden');
    }
    /**
     * Close tile type picker modal
     */
    closeTilePicker() {
        this._tilePickerModal.classList.add('hidden');
        this._cellAwaitingInput = null;
    }
    /**
     * Handle tile type selection from modal (editor mode)
     */
    handleTileTypeSelection(tileType) {
        if (!this._cellAwaitingInput || !(this._cellAwaitingInput instanceof Cell_1.GameBoardCell)) {
            return;
        }
        const cell = this._cellAwaitingInput;
        const cellDiv = cell.cell;
        const index = cell.index;
        const row = Math.floor(index / this._boardSize);
        const col = index % this._boardSize;
        // Store current letter if any
        const currentLetter = cell.letter;
        // Determine new cell type and CSS class
        let bonusCode = '  ';
        let newCellType = Cell_1.CellType.plain;
        let cssClass = '';
        switch (tileType) {
            case 'double-letter':
                bonusCode = 'DL';
                newCellType = Cell_1.CellType.doubleLetter;
                cssClass = 'double-letter';
                break;
            case 'triple-letter':
                bonusCode = 'TL';
                newCellType = Cell_1.CellType.tripleLetter;
                cssClass = 'triple-letter';
                break;
            case 'double-word':
                bonusCode = 'DW';
                newCellType = Cell_1.CellType.doubleWord;
                cssClass = 'double-word';
                break;
            case 'triple-word':
                bonusCode = 'TW';
                newCellType = Cell_1.CellType.tripleWord;
                cssClass = 'triple-word';
                break;
            case 'start':
                bonusCode = 'ST';
                newCellType = Cell_1.CellType.start;
                cssClass = 'start-cell';
                break;
            default:
                bonusCode = '  ';
                newCellType = Cell_1.CellType.plain;
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
    applyMirroredTileType(row, col, tileType, bonusCode, cellType) {
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
            { row: row, col: maxIndex - col },
            { row: maxIndex - row, col: col },
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
    computeBestMove() {
        this.discard();
        this.showSpinner();
        this.deselectSelectedCell();
        const postData = this.buildPostData();
        BestMove_1.default(postData).then((bestMove) => {
            // Check for error message from backend
            if (bestMove.error) {
                this.hideSpinner();
                alert(bestMove.error);
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
    displayBestMove(bestMove) {
        let currentIndex = bestMove.lastLetterIndex[0] * this._boardSize + bestMove.lastLetterIndex[1];
        for (let i = 0; i < bestMove.word.length; i++) {
            this.setScore(bestMove.score);
            // Track rack vs board letters
            if (!this._gameBoardCells[currentIndex].letter) {
                this._bestMoveRackCells.push(this._gameBoardCells[currentIndex]);
            }
            else {
                this._bestMoveCells.push(this._gameBoardCells[currentIndex]);
            }
            // Add purple border and set letter
            this._gameBoardCells[currentIndex].toggleBestMove();
            this._gameBoardCells[currentIndex].letter = {
                letter: bestMove.word[bestMove.word.length - i - 1],
                value: Letter_1.LetterValues[bestMove.word[bestMove.word.length - i - 1]]
            };
            // Move to next cell
            if (bestMove.direction === BestMove_1.MoveDirection.across) {
                currentIndex -= 1;
            }
            else {
                currentIndex -= this._boardSize;
            }
        }
    }
    /**
     * Build POST data for backend
     */
    buildPostData() {
        var _a, _b;
        const postData = {
            gameLetters: [],
            userLetters: [],
            boardSize: this._boardSize,
            bonusBoard: this._boardConfig.bonuses
        };
        // Grab game board letters
        for (let i = 0; i < this._gameBoardCells.length; i++) {
            if (this._gameBoardCells[i].letter != null) {
                postData.gameLetters.push({
                    letter: (_a = this._gameBoardCells[i].letter) === null || _a === void 0 ? void 0 : _a.letter,
                    index: this._gameBoardCells[i].index
                });
            }
        }
        // Grab user letters
        for (let i = 0; i < this._letterRackCells.length; i++) {
            if (this._letterRackCells[i].letter != null) {
                postData.userLetters.push((_b = this._letterRackCells[i].letter) === null || _b === void 0 ? void 0 : _b.letter);
            }
        }
        return postData;
    }
    /**
     * Clear board and rack
     */
    clear() {
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
    discard() {
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
    keep() {
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
    setScore(score) {
        if (score) {
            this._score.innerHTML = String(score);
        }
        else {
            this._score.innerHTML = '00';
        }
    }
    /**
     * Show loading spinner
     */
    showSpinner() {
        this._loader.classList.remove('hidden');
    }
    /**
     * Hide loading spinner
     */
    hideSpinner() {
        this._loader.classList.add('hidden');
    }
    /**
     * Set selected cell letter (desktop keyboard input)
     */
    setSelectedCellLetter(letter) {
        if (this._selectedCell) {
            this._selectedCell.letter = (letter == null) ? null : {
                letter: letter === ' ' ? '?' : letter.toUpperCase(),
                value: Letter_1.LetterValues[letter === ' ' ? '?' : letter.toUpperCase()]
            };
            this.deselectSelectedCell();
        }
    }
    /**
     * Deselect selected cell
     */
    deselectSelectedCell() {
        if (this._selectedCell) {
            this._selectedCell.toggleSelected();
            this._selectedCell = null;
        }
    }
}
exports.default = GameBoard;

},{"./BestMove":1,"./BoardConfig":2,"./Cell":3,"./Letter":5}],5:[function(require,module,exports){
"use strict";
/**
 * @author Elijah Sawyers <elijahsawyers@gmail.com>
 */
Object.defineProperty(exports, "__esModule", { value: true });
/** All letter point values. */
exports.LetterValues = {
    'A': 1,
    'B': 4,
    'C': 4,
    'D': 2,
    'E': 1,
    'F': 4,
    'G': 3,
    'H': 3,
    'I': 1,
    'J': 10,
    'K': 5,
    'L': 2,
    'M': 4,
    'N': 2,
    'O': 1,
    'P': 4,
    'Q': 10,
    'R': 1,
    'S': 1,
    'T': 1,
    'U': 2,
    'V': 5,
    'W': 4,
    'X': 8,
    'Y': 3,
    'Z': 10,
    '?': 0,
};

},{}],6:[function(require,module,exports){
"use strict";
/**
 * @author Elijah Sawyers <elijahsawyers@gmail.com>
 */
Object.defineProperty(exports, "__esModule", { value: true });
const GameBoard_1 = require("./GameBoard");
// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const gameBoard = new GameBoard_1.default();
        // Expose to window for testing purposes
        window.gameBoardInstance = gameBoard;
    });
}
else {
    // DOM already loaded
    const gameBoard = new GameBoard_1.default();
    // Expose to window for testing purposes
    window.gameBoardInstance = gameBoard;
}

},{"./GameBoard":4}]},{},[6]);
