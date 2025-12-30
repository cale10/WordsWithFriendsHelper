/**
 * @author Elijah Sawyers <elijahsawyers@gmail.com>
 */

import GameBoard from './GameBoard';

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = new GameBoard();
    // Expose to window for testing purposes
    (window as any).gameBoardInstance = gameBoard;
  });
} else {
  // DOM already loaded
  const gameBoard = new GameBoard();
  // Expose to window for testing purposes
  (window as any).gameBoardInstance = gameBoard;
}
