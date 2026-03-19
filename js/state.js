/**
 * State Management Module
 * Handles application state, persistence, and updates
 */

class StateManager {
  constructor() {
    this.state = {
      currentLevel: 0,
      completed: new Set(),
      streak: 0,
      hintVisible: false,
      codes: {}
    };
    this.loadState();
  }

  /**
   * Load state from localStorage
   */
  loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem('embeddedc_state') || '{}');
      if (saved.completed) {
        this.state.completed = new Set(saved.completed);
      }
      if (saved.streak !== undefined) {
        this.state.streak = saved.streak;
      }
      if (saved.codes) {
        this.state.codes = saved.codes;
      }
      if (saved.currentLevel !== undefined) {
        this.state.currentLevel = saved.currentLevel;
      }
    } catch (e) {
      console.error('Failed to load state:', e);
    }
  }

  /**
   * Save state to localStorage
   */
  saveState() {
    try {
      localStorage.setItem('embeddedc_state', JSON.stringify({
        completed: [...this.state.completed],
        streak: this.state.streak,
        codes: this.state.codes,
        currentLevel: this.state.currentLevel
      }));
    } catch (e) {
      console.error('Failed to save state:', e);
    }
  }

  /**
   * Get current state
   */
  getState() {
    return this.state;
  }

  /**
   * Set current level
   */
  setCurrentLevel(levelIndex) {
    this.state.currentLevel = levelIndex;
    this.saveState();
  }

  /**
   * Toggle hint visibility
   */
  toggleHint() {
    this.state.hintVisible = !this.state.hintVisible;
    return this.state.hintVisible;
  }

  /**
   * Reset hint visibility
   */
  resetHintVisibility() {
    this.state.hintVisible = false;
  }

  /**
   * Save code for a level
   */
  saveCode(levelId, code) {
    this.state.codes[levelId] = code;
    this.saveState();
  }

  /**
   * Get saved code for a level, or default to expected
   */
  getCode(levelId, defaultCode) {
    return this.state.codes[levelId] || defaultCode;
  }

  /**
   * Mark level as completed
   */
  completeLevel(levelId) {
    const wasNew = !this.state.completed.has(levelId);
    this.state.completed.add(levelId);
    if (wasNew) {
      this.state.streak++;
    }
    this.saveState();
    return wasNew;
  }

  /**
   * Reset streak
   */
  resetStreak() {
    this.state.streak = 0;
    this.saveState();
  }

  /**
   * Get completion count
   */
  getCompletionCount() {
    return this.state.completed.size;
  }

  /**
   * Check if level is completed
   */
  isLevelCompleted(levelId) {
    return this.state.completed.has(levelId);
  }

  /**
   * Is all levels completed
   */
  isAllCompleted(totalLevels) {
    return this.state.completed.size === totalLevels;
  }

  /**
   * Get all completed level IDs
   */
  getCompletedLevels() {
    return Array.from(this.state.completed);
  }
}

// Export for use in modules
const stateManager = new StateManager();
